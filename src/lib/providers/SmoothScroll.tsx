"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { BASE_PATH } from "@/lib/asset";

/** Lenis smooth scroll on GSAP's ticker, wired to ScrollTrigger. Off under reduced motion. */

/* The live instance, kept module-scoped so anything on the page can hand the
   scroll to Lenis instead of going around it. This exists because of a real
   bug: the jump-to-stage buttons called window.scrollTo({behavior:"smooth"}),
   and the browser's smooth scroll and Lenis then fought for the scroll
   position every frame — the page visibly tore back and forth. There can only
   be one thing driving the scroll. */
let current: Lenis | null = null;

/* The router, kept for goTo() below, which is called from places that are not
   components (the radial menu's key handler, the global link handler). */
let push: ((href: string) => void) | null = null;

/** how long the page takes to fade before the next one replaces it */
const LEAVE_MS = 170;

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      if (current === lenis) current = null;
    };
  }, [reduced]);

  useEffect(() => {
    push = (href) => router.push(href);
    return () => {
      push = null;
    };
  }, [router]);

  // the new page has arrived: take the fade off
  useEffect(() => {
    delete document.documentElement.dataset.leaving;
  }, [pathname]);

  /* EVERY IN-SITE LINK, HANDLED ONE WAY.
     A link to a section of the page you are on glides there instead of
     jumping; a link to another page lets this one fade before the next one
     fades in (app/template.tsx). Captured on the window so it runs before
     Next's own Link handler, which stands down when the event is already
     handled. Anything unusual (a new tab, a download, another site, a phone
     number, a file) is left to the browser. */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.hasAttribute("download") || a.hasAttribute("data-own-scroll")) return;
      if (a.target && a.target !== "_self") return;
      if (goTo(a.href)) e.preventDefault();
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, []);

  return <>{children}</>;
}

const norm = (p: string) => p.replace(/\/+$/, "") || "/";

/**
 * Go to an in-site address the way a click on a link to it would. Returns
 * false when the address is not one this should handle, so a caller can let
 * the browser have it.
 */
export function goTo(href: string): boolean {
  if (typeof window === "undefined") return false;
  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return false;
  }
  if (url.origin !== window.location.origin) return false;
  // a file (the brochure, an image) is the browser's to open
  if (/\.[a-z0-9]{2,5}$/i.test(url.pathname)) return false;

  const samePage = norm(url.pathname) === norm(window.location.pathname);
  if (samePage) {
    const id = url.hash.length > 1 ? decodeURIComponent(url.hash.slice(1)) : "";
    if (id) {
      const el = document.getElementById(id);
      if (!el) return false;
      scrollToEl(el);
    } else {
      scrollToY(0);
    }
    // The address still says where you are, so it can be copied and shared.
    // The FIRST jump away from the plain page is pushed, so Back returns to
    // where the visitor was reading when they jumped (the browser restores that
    // entry's scroll position) instead of leaving the site: on a one-page site
    // that is what Back is expected to do, and leaving was read as a fault
    // (design review, 19 Sep 2026). Jumps after that replace the entry, so Back
    // never has to retrace every section in turn. Next's own state rides along
    // either way: its popstate handler reloads the page for a state without it.
    const next = url.pathname + url.search + url.hash;
    if (next !== window.location.pathname + window.location.search + window.location.hash) {
      if (window.location.hash) window.history.replaceState(window.history.state, "", next);
      else window.history.pushState(window.history.state, "", next);
    }
    return true;
  }

  if (!push) return false;
  const go = push;
  const path = BASE_PATH && url.pathname.startsWith(BASE_PATH) ? url.pathname.slice(BASE_PATH.length) || "/" : url.pathname;
  const target = path + url.search + url.hash;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    go(target);
    return true;
  }
  const root = document.documentElement;
  root.dataset.leaving = "1";
  window.setTimeout(() => go(target), LEAVE_MS);
  // if the next page never arrives (offline, a failed fetch), do not leave
  // this one invisible
  window.setTimeout(() => {
    delete root.dataset.leaving;
  }, 4000);
  return true;
}

/**
 * Scroll to a document position through whatever is actually driving the page.
 *
 * With Lenis running, that means Lenis. Without it (reduced motion, or before
 * hydration) it falls back to the native call, which is correct there because
 * nothing else is competing.
 *
 * `duration` is in seconds and scales with distance by default: a jump to the
 * next stage should not take as long as a jump across the whole journey, and a
 * fixed duration makes short jumps feel sluggish and long ones feel violent.
 */
export function scrollToY(y: number, opts: { duration?: number; onComplete?: () => void } = {}) {
  const target = Math.max(0, Math.round(y));
  const lenis = current;
  if (!lenis) {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
    opts.onComplete?.();
    return;
  }
  const distance = Math.abs(target - window.scrollY);
  const duration =
    opts.duration ?? Math.min(1.9, Math.max(0.75, 0.55 + distance / window.innerHeight / 3.4));
  lenis.scrollTo(target, {
    duration,
    // Long travel wants to leave quickly and arrive slowly, so the eye can
    // read where it has landed. This is an expo-out with a soft start.
    easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -9 * t)),
    onComplete: opts.onComplete,
  });
}

/**
 * Scroll an element to the top of the viewport. The gap left above it is the
 * page's `scroll-padding-top` plus the element's own `scroll-margin-top`,
 * exactly what the browser's own jump to it uses, so a link that glides and an
 * address typed in with a #section land in the same place.
 */
export function scrollToEl(el: Element | null, offset?: number) {
  if (!el) return;
  // A target with no box cannot be scrolled to: the pinned journey is removed
  // under reduced motion and where there is no WebGL, and "#journey" then
  // measured as the top of the page. What stands in for it follows it in the
  // document (the static story), so the link goes there.
  while (el && el.getClientRects().length === 0) el = el.nextElementSibling;
  if (!el) return;
  const target = el;
  const px = (v: string) => parseFloat(v) || 0;
  const gap =
    offset ?? px(getComputedStyle(document.documentElement).scrollPaddingTop) + px(getComputedStyle(target).scrollMarginTop);
  const measure = () => {
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    return Math.min(max, window.scrollY + target.getBoundingClientRect().top - gap);
  };
  // THE PAGE CAN MOVE UNDER A GLIDE. The landing is worked out when the link
  // is pressed, and a glide lasts up to two seconds: an answer still opening
  // in the hero, or a picture arriving above the target, moves the target
  // while the page is on its way, and the glide came to rest a hundred pixels
  // short on a phone. So the landing is checked once it is reached and the
  // remainder is glided, once. A visitor who takes over the scroll stops the
  // glide, and then nothing is corrected (Lenis calls back only on arrival).
  scrollToY(measure(), {
    onComplete: () => {
      const y2 = measure();
      if (Math.abs(y2 - window.scrollY) > 2) scrollToY(y2, { duration: 0.45 });
    },
  });
}
