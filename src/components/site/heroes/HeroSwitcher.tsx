"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DEFAULT_HERO, HERO_OPTIONS, type HeroKey } from "./options";

/** The review tool on the preview routes: one pill per hero option. It is not
 *  part of the site a visitor sees; the home page has no switcher. It steps
 *  aside once the hero has scrolled by. */
export function HeroSwitcher({ current }: { current: HeroKey }) {
  const [away, setAway] = useState(false);
  useEffect(() => {
    const on = () => setAway(window.scrollY > window.innerHeight * 0.6);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <nav className={`hero-switch${away ? " is-away" : ""}`} aria-label="Home page options">
      <span className="hero-switch-t">Hero options</span>
      {HERO_OPTIONS.map((o, i) => (
        <Link
          key={o.key}
          href={`/preview/${o.key}/`}
          className={o.key === current ? "is-on" : undefined}
          aria-current={o.key === current ? "page" : undefined}
          title={o.idea}
        >
          <i aria-hidden="true">{String.fromCharCode(65 + i)}</i>
          {o.name}
          {o.key === DEFAULT_HERO && <em> (home)</em>}
        </Link>
      ))}
    </nav>
  );
}
