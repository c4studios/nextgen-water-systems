"use client";

import { useEffect, useRef } from "react";

/**
 * Titles that form out of water.
 *
 * Same mechanism as the water section on the Aqua-Safe site: two overlapping
 * spans are blurred into each other and then passed through an SVG alpha
 * THRESHOLD, which is what turns a soft blur into liquid. Below the threshold
 * the blurred alpha is cut to nothing and above it to solid, so the letters
 * bleed together into blobs, separate, and re-form with surface tension rather
 * than simply cross-fading.
 *
 * Here it is scroll-driven rather than timed: `t` is the beat's own fade
 * scalar, so the heading is liquid on the way in, sharp while the beat holds,
 * and dissolves again on the way out. The plain text stays in the DOM for
 * screen readers, unfiltered.
 */
export function WaterText({ text, t, className }: { text: string; t: number; className?: string }) {
  const aRef = useRef<HTMLSpanElement>(null);
  const bRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b) return;
    // t: 0 fully dissolved, 1 fully formed. The blur runs 1/f so it grows
    // without limit as the text dissolves, which is what lets the letters melt
    // into each other instead of just fading.
    const f = Math.max(t, 0.0001);
    const blur = Math.min(9 / f - 9, 42);
    a.style.filter = `blur(${blur}px)`;
    a.style.opacity = String(Math.pow(f, 0.42));
    // the second span trails slightly, so the mass moves rather than pulsing
    const g = Math.max(Math.min(t * 1.18, 1), 0.0001);
    b.style.filter = `blur(${Math.min(11 / g - 11, 48)}px)`;
    b.style.opacity = String(Math.pow(g, 0.6) * 0.55);
  }, [t]);

  return (
    <span className={`wt ${className || ""}`.trim()}>
      <span className="wt-stage" aria-hidden="true">
        <span ref={aRef} className="wt-layer">
          {text}
        </span>
        <span ref={bRef} className="wt-layer wt-layer--b">
          {text}
        </span>
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}

/** The threshold filter, mounted once per page. */
export function WaterTextDefs() {
  return (
    <svg className="wt-defs" aria-hidden="true" focusable="false">
      <defs>
        {/* alpha threshold: everything under the cut disappears, everything
            over it goes solid. This is the step that makes blur read as
            liquid rather than as fog. */}
        <filter id="ng-water-text">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 26 -11"
          />
        </filter>
      </defs>
    </svg>
  );
}
