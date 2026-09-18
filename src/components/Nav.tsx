"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navRoutes, ROUTES } from "@/content/site";
import { CONTACT } from "@/content/plates";
import { MenuToggleIcon } from "@/components/ui/MenuToggleIcon";
import { RadialMenu, type RadialItem } from "@/components/ui/RadialMenu";
import { cn } from "@/lib/cn";
import { Wordmark } from "@/components/site/Wordmark";

/**
 * THE NAV, AS ONE CONTINUOUS MORPH.
 *
 *   A  at the top of the page      a full-width bar of glass, attached
 *   B  once you start scrolling    detached, a floating pill
 *
 * Width, height, radius and inset are INTERPOLATED every frame from the scroll,
 * so there is no moment where the nav is "in" a state.
 *
 * The pill stays through the scroll journey. It used to collapse there to a
 * single orb with a right-click hint; on 17 Sep 2026 the finish review asked
 * for the phone number and the test action to stay one tap away the whole
 * way down, since the journey is where a visitor decides. The quick menu is
 * the round button inside the pill.
 */

/** scroll distance over which the bar detaches into the pill */
const DETACH = 260;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/* Drafting glyphs rather than a general-purpose icon set: a 24-unit box each,
   drawn in the same hairline language as the plate. */
const GLYPHS: Record<string, React.ReactNode> = {
  "/system/": (
    <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="3" y="6" width="5" height="13" rx="1" />
      <rect x="9.5" y="6" width="5" height="13" rx="1" />
      <rect x="16" y="6" width="5" height="13" rx="1" />
      <path d="M3 5h18" />
    </g>
  ),
  "/installation/": (
    <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20V9l8-5 8 5v11" />
      <path d="M9 20v-6h6v6" />
    </g>
  ),
  "/questions/": (
    <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.4 9.6a2.7 2.7 0 1 1 3.3 2.7v1.5" />
      <path d="M12.7 17.2h.01" />
    </g>
  ),
  "/water-test/": (
    <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3.5c0 0 5.5 6.2 5.5 10a5.5 5.5 0 0 1-11 0c0-3.8 5.5-10 5.5-10Z" />
      <path d="M9.6 14.6a2.6 2.6 0 0 0 2.6 2.4" />
    </g>
  ),
};

const RADIAL_ITEMS: RadialItem[] = ROUTES.map((r) => ({
  id: r.href,
  label: r.label,
  href: r.href,
  glyph: GLYPHS[r.href] ?? null,
}));

export function Nav() {
  const [sheet, setSheet] = useState(false);
  const [menuAt, setMenuAt] = useState<{ x: number; y: number } | null>(null);
  const pathname = usePathname();
  const here = (href: string) => pathname === href || pathname === href.replace(/\/$/, "");

  const headRef = useRef<HTMLElement>(null);
  const ringBtnRef = useRef<HTMLButtonElement>(null);

  /* ---- the morph ---- */
  useEffect(() => {
    const head = headRef.current;
    if (!head) return;
    let raf = 0;
    const frame = () => {
      const vw = window.innerWidth;
      const t = clamp01(window.scrollY / DETACH);
      const full = Math.min(vw, 1240);
      // wide enough for the links, the phone number, the test action and the
      // quick-menu button, so nothing in the pill is ever squeezed
      const pill = Math.min(920, vw - 28);
      head.style.setProperty("--nw", `${lerp(full, pill, t)}px`);
      head.style.setProperty("--nh", `${lerp(72, 56, t)}px`);
      head.style.setProperty("--nr", `${lerp(0, 999, t)}px`);
      head.style.setProperty("--nt", `${lerp(0, 10, t)}px`);
      head.style.setProperty("--bar-o", "1");
      head.style.setProperty("--orb-o", "0");
      head.style.setProperty("--edge-o", String(1 - t));
      head.dataset.j = "0";
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  const openAt = useCallback((x: number, y: number) => setMenuAt({ x, y }), []);

  /* Opens the ring under the trigger on a pointer device, and in the thumb
     arc on a phone, same rule as the orb. */
  const ringBtnClick = () => {
    if (menuAt) {
      setMenuAt(null);
      return;
    }
    const b = ringBtnRef.current?.getBoundingClientRect();
    if (!b) return;
    const touch = window.innerWidth < 768;
    openAt(
      touch ? window.innerWidth / 2 : b.left + b.width / 2,
      touch ? window.innerHeight * 0.58 : b.bottom + 150,
    );
  };

  return (
    <>
      <header
        ref={headRef}
        className={cn("site-nav", sheet && "is-open", menuAt && "is-ringed")}
      >
        <svg className="nav-defs" aria-hidden="true" focusable="false">
          <filter id="ng-liquid" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.014" numOctaves="2" seed="4" result="n" />
            <feGaussianBlur in="n" stdDeviation="1.4" result="ns" />
            <feDisplacementMap in="SourceGraphic" in2="ns" scale="12" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
        <div className="nav-pane" aria-hidden="true" />

        <div className="wrap nav-bar">
          <Link className="brand" href="/" data-cursor aria-label="Next Gen Water Systems, home" onClick={() => setSheet(false)}>
            <Wordmark variant="compact" />
          </Link>

          <nav className="nav-links" aria-label="Primary">
            {navRoutes.map((r) => (
              <Link
                key={r.href}
                className={cn("navlink", here(r.href) && "is-here")}
                href={r.href}
                aria-current={here(r.href) ? "page" : undefined}
                data-cursor
              >
                {r.label}
              </Link>
            ))}
            <a className="nav-tel" href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} data-cursor aria-label={`Call ${CONTACT.phone}`}>
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5.5 3.5h3l1.6 4.4-2.2 1.4a11 11 0 0 0 6.8 6.8l1.4-2.2 4.4 1.6v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 3.5 5.7a2 2 0 0 1 2-2.2Z" />
              </svg>
              <span>{CONTACT.phone}</span>
            </a>
            <Link className="nav-cta" href="/water-test/" data-cursor>
              Book water test
            </Link>
          </nav>

          {/* The radial menu was previously reachable only from inside the
              journey, which meant a visitor who never got that far never knew
              it existed. It now has a permanent trigger sitting with the links,
              so the ring is one click from every page. The right-click shortcut
              inside the drawing still works and is now a shortcut rather than
              the only way in. */}
          <button
            ref={ringBtnRef}
            className="nav-ring-btn"
            onClick={ringBtnClick}
            aria-label={menuAt ? "Close menu" : "Open quick menu"}
            aria-expanded={!!menuAt}
            data-cursor
          >
            <MenuToggleIcon open={!!menuAt} />
          </button>

          <button
            className="nav-burger"
            onClick={() => setSheet((o) => !o)}
            aria-label={sheet ? "Close menu" : "Open menu"}
            aria-expanded={sheet}
            aria-controls="ng-menu"
          >
            <MenuToggleIcon open={sheet} />
          </button>
        </div>

        <nav id="ng-menu" className={cn("nav-sheet", sheet && "is-open")} aria-label="Menu">
          <div className="nav-sheet-in" {...({ inert: sheet ? undefined : "" } as Record<string, unknown>)}>
            {navRoutes.map((r) => (
              <Link key={r.href} href={r.href} onClick={() => setSheet(false)}>
                {r.label}
              </Link>
            ))}
            <Link className="nav-sheet-cta" href="/water-test/" onClick={() => setSheet(false)}>
              Book your free water test
            </Link>
          </div>
        </nav>
      </header>

      <RadialMenu items={RADIAL_ITEMS} open={!!menuAt} at={menuAt} onClose={() => setMenuAt(null)} />
    </>
  );
}
