"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** Lenis smooth scroll on GSAP's ticker, wired to ScrollTrigger. Off under reduced motion. */

/* The live instance, kept module-scoped so anything on the page can hand the
   scroll to Lenis instead of going around it. This exists because of a real
   bug: the jump-to-stage buttons called window.scrollTo({behavior:"smooth"}),
   and the browser's smooth scroll and Lenis then fought for the scroll
   position every frame — the page visibly tore back and forth. There can only
   be one thing driving the scroll. */
let current: Lenis | null = null;

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
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
  return <>{children}</>;
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

/** Scroll an element to the top of the viewport, allowing for the fixed nav. */
export function scrollToEl(el: Element | null, offset = 0) {
  if (!el) return;
  const y = window.scrollY + el.getBoundingClientRect().top - offset;
  scrollToY(y);
}
