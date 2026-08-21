"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navRoutes } from "@/content/site";

/**
 * Slim premium nav: monogram, the pages, the one CTA.
 *
 * It used to hold a single "The drawing" anchor, because the whole site was one
 * page. Now that there is a drawing set behind it, the nav is the way into it,
 * and the current sheet is marked rather than merely coloured.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  // collapses to a floating pill once you are into the page
  const [shrunk, setShrunk] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setShrunk(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const here = (href: string) => pathname === href || pathname === href.replace(/\/$/, "");

  return (
    <header className={`site-nav${open ? " is-open" : ""}${shrunk && !open ? " is-shrunk" : ""}`}>
      {/* The liquid-glass refraction. The bar is a translucent pane; this
          filter bends what passes under it at the edges, which is what makes
          glass read as glass rather than as a blurred rectangle. Kept to a low
          displacement — past about 20 the text under it tears. */}
      <svg className="nav-defs" aria-hidden="true" focusable="false">
        <filter id="ng-liquid" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.014" numOctaves="2" seed="4" result="n" />
          <feGaussianBlur in="n" stdDeviation="1.4" result="ns" />
          <feDisplacementMap in="SourceGraphic" in2="ns" scale="12" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div className="nav-pane" aria-hidden="true" />
      <div className="wrap">
        <Link className="brand" href="/" data-cursor onClick={() => setOpen(false)}>
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
              className={`navlink${here(r.href) ? " is-here" : ""}`}
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
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="ng-menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </div>

      <nav id="ng-menu" className={`nav-sheet${open ? " is-open" : ""}`} aria-label="Menu">
        {/* single grid child: the 0fr collapse only sizes the first row, so the
            links have to share one wrapper or the menu ships open */}
        {/* inert as a STRING: React 18 has no boolean `inert` prop and warns
            about one. Without it the collapsed menu is still keyboard
            reachable, which is a focus trap you cannot see. */}
        <div className="nav-sheet-in" {...({ inert: open ? undefined : "" } as Record<string, unknown>)}>
          {navRoutes.map((r) => (
            <Link key={r.href} href={r.href} onClick={() => setOpen(false)}>
              <b>{r.sheet}</b>
              {r.label}
            </Link>
          ))}
          <Link className="nav-sheet-cta" href="/water-test/" onClick={() => setOpen(false)}>
            Book your free water test
          </Link>
        </div>
      </nav>
    </header>
  );
}
