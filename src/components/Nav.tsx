"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navRoutes, ROUTES } from "@/content/site";
import { MenuToggleIcon } from "@/components/ui/MenuToggleIcon";
import { RadialMenu, type RadialItem } from "@/components/ui/RadialMenu";
import { cn } from "@/lib/cn";

/**
 * THE NAV, IN THREE STATES, AS ONE CONTINUOUS MORPH.
 *
 *   A  at the top of the page      a full-width bar of glass, attached
 *   B  once you start scrolling    detached, a floating pill
 *   C  inside the scroll journey   a single orb: the drawing wants the screen,
 *                                  so the nav gets out of the way and becomes
 *                                  an affordance instead of a menu
 *
 * The previous version flipped a class at a scroll threshold, which is exactly
 * the rigidity being reported: two fixed states with a transition bolted
 * between them. Here width, height, radius, inset and the opacity of every part
 * are INTERPOLATED every frame from two continuous scalars — `t` for the detach and
 * `j` for the journey — so there is no moment where the nav is "in" a state. It
 * is always somewhere on the way between them, and it follows the scroll rather
 * than reacting to it.
 *
 * `j` additionally runs through a spring rather than being read directly, so
 * entering and leaving the journey overshoots and settles instead of snapping.
 *
 * In state C the orb is the menu trigger: click it, or right-click anywhere in
 * the journey, and the radial menu opens at the pointer.
 */

/** scroll distance over which the bar detaches into the pill */
const DETACH = 260;
/** Spring on the journey scalar, integrated against real time rather than per
 *  frame. A per-frame spring runs at half speed on a 30fps device and double on
 *  a 120Hz one; this behaves the same everywhere. Zeta ~0.82, so it overshoots
 *  slightly and settles in about half a second. */
const STIFF = 120;
const DAMP = 18;

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
  const [hintSpent, setHintSpent] = useState(true);
  const pathname = usePathname();
  const here = (href: string) => pathname === href || pathname === href.replace(/\/$/, "");

  const headRef = useRef<HTMLElement>(null);
  const orbRef = useRef<HTMLButtonElement>(null);
  const jRef = useRef(0);
  const vRef = useRef(0);
  const [inJourney, setInJourney] = useState(false);

  /* ---- the morph ---- */
  useEffect(() => {
    const head = headRef.current;
    if (!head) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let plate: HTMLElement | null = null;
    let last = performance.now();

    const frame = (now: number) => {
      // clamped so a stalled tab does not fling the spring across on resume
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!plate) plate = document.getElementById("drawing");
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const y = window.scrollY;

      const t = clamp01(y / DETACH);

      // the journey owns the screen once its pin is engaged and the plate has
      // not yet handed back
      let target = 0;
      if (plate) {
        const b = plate.getBoundingClientRect();
        target = b.top <= vh * 0.12 && b.bottom > vh * 0.9 ? 1 : 0;
      }
      if (reduced) {
        jRef.current = target;
      } else {
        vRef.current += (STIFF * (target - jRef.current) - DAMP * vRef.current) * dt;
        jRef.current += vRef.current * dt;
        if (Math.abs(target - jRef.current) < 0.0004 && Math.abs(vRef.current) < 0.004) {
          jRef.current = target;
          vRef.current = 0;
        }
      }
      const j = clamp01(jRef.current);

      const full = Math.min(vw, 1240);
      const pill = Math.min(760, vw - 28);
      const orb = 62;

      const w = lerp(lerp(full, pill, t), orb, j);
      const h = lerp(lerp(72, 56, t), orb, j);
      const r = lerp(lerp(0, 999, t), 999, j);
      const top = lerp(lerp(0, 10, t), 16, j);

      head.style.setProperty("--nw", `${w}px`);
      head.style.setProperty("--nh", `${h}px`);
      head.style.setProperty("--nr", `${r}px`);
      head.style.setProperty("--nt", `${top}px`);
      // the bar's contents fade out as the orb takes over, and the orb fades in
      head.style.setProperty("--bar-o", String(clamp01(1 - j * 2.1)));
      head.style.setProperty("--orb-o", String(clamp01((j - 0.55) * 2.6)));
      head.style.setProperty("--edge-o", String(1 - t));
      head.dataset.j = j > 0.5 ? "1" : "0";

      const nowIn = j > 0.5;
      setInJourney((prev) => (prev === nowIn ? prev : nowIn));
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ---- the hint is a teaching aid, not furniture ----
     It says its piece once. It shows the first time the nav becomes an orb,
     retires after seven seconds, and never comes back once the menu has
     actually been opened. A permanent label sitting over the drawing would be
     the same nagging tooltip the orb exists to avoid. */
  useEffect(() => {
    try {
      if (sessionStorage.getItem("ngw:ring") === "1") return;
    } catch {
      /* private mode: just show it */
    }
    setHintSpent(false);
  }, []);
  useEffect(() => {
    if (!inJourney || hintSpent) return;
    const id = window.setTimeout(() => setHintSpent(true), 7000);
    return () => window.clearTimeout(id);
  }, [inJourney, hintSpent]);
  useEffect(() => {
    if (!menuAt) return;
    setHintSpent(true);
    try {
      sessionStorage.setItem("ngw:ring", "1");
    } catch {
      /* nothing to remember it with; the timeout still retires it */
    }
  }, [menuAt]);

  /* ---- right-click anywhere in the journey opens the ring ---- */
  const openAt = useCallback((x: number, y: number) => setMenuAt({ x, y }), []);
  useEffect(() => {
    const onCtx = (e: MouseEvent) => {
      const plate = document.getElementById("drawing");
      if (!plate) return;
      const b = plate.getBoundingClientRect();
      if (b.top > window.innerHeight * 0.2 || b.bottom < window.innerHeight * 0.8) return;
      e.preventDefault();
      openAt(e.clientX, e.clientY);
    };
    window.addEventListener("contextmenu", onCtx);
    return () => window.removeEventListener("contextmenu", onCtx);
  }, [openAt]);

  const orbClick = () => {
    if (menuAt) {
      setMenuAt(null);
      return;
    }
    const b = orbRef.current?.getBoundingClientRect();
    if (!b) return;
    // On a phone the orb sits at the top of the screen, and a ring opened just
    // below it lands where no thumb reaches. So on narrow viewports the ring
    // opens low, in the thumb arc, rather than under the button that summoned
    // it. On desktop the pointer is already at the orb, so it opens there.
    const touch = window.innerWidth < 768;
    openAt(
      b.left + b.width / 2,
      touch ? window.innerHeight * 0.58 : b.top + b.height / 2 + 150,
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
          <Link className="brand" href="/" data-cursor onClick={() => setSheet(false)}>
            <svg className="mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="ngmark" x1="20" y1="6" x2="20" y2="34" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#29c2ee" />
                  <stop offset="1" stopColor="#0f6fb0" />
                </linearGradient>
              </defs>
              <path d="M20 6s10 11 10 18a10 10 0 1 1-20 0C10 17 20 6 20 6Z" fill="url(#ngmark)" />
            </svg>
            Next&nbsp;Gen
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
            <Link className="nav-cta" href="/water-test/" data-cursor>
              Book water test
            </Link>
          </nav>

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

        {/* state C: the whole nav has become this */}
        <button
          ref={orbRef}
          className="nav-orb"
          onClick={orbClick}
          aria-label="Open menu"
          aria-expanded={!!menuAt}
          tabIndex={inJourney ? 0 : -1}
        >
          <MenuToggleIcon open={!!menuAt} />
        </button>

        <nav id="ng-menu" className={cn("nav-sheet", sheet && "is-open")} aria-label="Menu">
          <div className="nav-sheet-in" {...({ inert: sheet ? undefined : "" } as Record<string, unknown>)}>
            {navRoutes.map((r) => (
              <Link key={r.href} href={r.href} onClick={() => setSheet(false)}>
                <b>{r.sheet}</b>
                {r.label}
              </Link>
            ))}
            <Link className="nav-sheet-cta" href="/water-test/" onClick={() => setSheet(false)}>
              Book your free water test
            </Link>
          </div>
        </nav>
      </header>

      {/* the hint, only while the nav is an orb and only until it is used */}
      <span className={cn("nav-hint", inJourney && !menuAt && !hintSpent && "is-on")} aria-hidden="true">
        <i />
        <span className="nav-hint-desk">Right-click anywhere for the menu</span>
        <span className="nav-hint-touch">Tap for the menu</span>
      </span>

      <RadialMenu items={RADIAL_ITEMS} open={!!menuAt} at={menuAt} onClose={() => setMenuAt(null)} />
    </>
  );
}
