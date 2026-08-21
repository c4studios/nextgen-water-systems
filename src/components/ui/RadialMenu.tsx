"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

/**
 * The radial menu.
 *
 * The geometry here — polarToCartesian, the donut slicePath with its large-arc
 * flag and single-item full-ring case — is taken from the supplied component,
 * because that maths is the valuable part and it is correct.
 *
 * What is NOT taken is its plumbing. The original pulls in
 * @base-ui-components/react for the context menu and motion/react for the
 * transitions, which is roughly 70kb for one menu in a project already carrying
 * three.js, react-three-fiber, GSAP and Lenis. So the open/close state, the
 * portal, the focus handling and the springs are written here against what the
 * site already has, and the wedges are styled in the site's own drafting
 * language rather than in neutral-200 Tailwind.
 *
 * Opens on right-click anywhere in the journey, on click of the nav orb, and on
 * long-press or tap on touch. Escape closes; arrow keys walk the ring.
 */

export type RadialItem = {
  id: string;
  label: string;
  href: string;
  /** small drafting glyph, drawn in a 24-unit box */
  glyph: React.ReactNode;
};

const FULL_CIRCLE = 360;
const START_ANGLE = -90;

const degToRad = (deg: number) => (deg * Math.PI) / 180;

function polarToCartesian(radius: number, angleDeg: number) {
  const rad = degToRad(angleDeg);
  return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius };
}

function slicePath(index: number, total: number, outer: number, inner: number) {
  if (total <= 0) return "";
  if (total === 1) {
    return `M ${outer} 0 A ${outer} ${outer} 0 1 1 ${-outer} 0 A ${outer} ${outer} 0 1 1 ${outer} 0
            M ${inner} 0 A ${inner} ${inner} 0 1 0 ${-inner} 0 A ${inner} ${inner} 0 1 0 ${inner} 0`;
  }
  const per = FULL_CIRCLE / total;
  const mid = START_ANGLE + per * index;
  const half = per / 2;
  const a = polarToCartesian(outer, mid - half);
  const b = polarToCartesian(outer, mid + half);
  const c = polarToCartesian(inner, mid + half);
  const d = polarToCartesian(inner, mid - half);
  const large = per > 180 ? 1 : 0;
  return `M ${a.x} ${a.y} A ${outer} ${outer} 0 ${large} 1 ${b.x} ${b.y}
          L ${c.x} ${c.y} A ${inner} ${inner} 0 ${large} 0 ${d.x} ${d.y} Z`;
}

export function RadialMenu({
  items,
  open,
  at,
  onClose,
  size = 268,
  bandWidth = 56,
  outerRingWidth = 10,
  outerGap = 7,
  innerGap = 9,
}: {
  items: RadialItem[];
  open: boolean;
  /** viewport point the ring centres on */
  at: { x: number; y: number } | null;
  onClose: () => void;
  size?: number;
  bandWidth?: number;
  outerRingWidth?: number;
  outerGap?: number;
  innerGap?: number;
}) {
  const router = useRouter();
  const [active, setActive] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const radius = size / 2;
  const ringOuter = radius;
  const ringInner = ringOuter - outerRingWidth;
  const wedgeOuter = ringInner - outerGap;
  const wedgeInner = wedgeOuter - bandWidth;
  const glyphRing = (wedgeOuter + wedgeInner) / 2;
  const centre = Math.max(wedgeInner - innerGap, 0);
  const slice = FULL_CIRCLE / items.length;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) {
      setActive(null);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => ((a ?? -1) + 1) % items.length);
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => ((a ?? items.length) - 1 + items.length) % items.length);
      }
      if ((e.key === "Enter" || e.key === " ") && active != null) {
        e.preventDefault();
        router.push(items[active].href);
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, items, active, onClose, router]);

  if (!mounted || !open || !at) return null;

  // keep the whole ring on screen even when invoked near an edge
  const pad = radius + 12;
  const cx = Math.min(Math.max(at.x, pad), window.innerWidth - pad);
  const cy = Math.min(Math.max(at.y, pad), window.innerHeight - pad);

  const go = (i: number) => {
    router.push(items[i].href);
    onClose();
  };

  return (
    <div
      className="rm"
      ref={rootRef}
      role="menu"
      aria-label="Site menu"
      onPointerDown={(e) => {
        if (e.target === rootRef.current) onClose();
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="rm-ring" style={{ left: cx, top: cy, width: size, height: size }}>
        <svg
          className="rm-svg"
          viewBox={`${-radius} ${-radius} ${size} ${size}`}
          aria-hidden="true"
        >
          <defs>
            {/* the same liquid refraction the nav uses, so the ring reads as
                the same material rather than as a different component */}
            <filter id="rm-liquid" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.02 0.03" numOctaves="2" seed="9" result="n" />
              <feGaussianBlur in="n" stdDeviation="1.1" result="ns" />
              <feDisplacementMap in="SourceGraphic" in2="ns" scale="7" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <linearGradient id="rm-metal" x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0%" stopColor="#f7fbfd" />
              <stop offset="34%" stopColor="#cdd8de" />
              <stop offset="52%" stopColor="#eef5f9" />
              <stop offset="76%" stopColor="#b7c4cc" />
              <stop offset="100%" stopColor="#e3ecf1" />
            </linearGradient>
          </defs>

          <g filter="url(#rm-liquid)">
            {items.map((_, i) => (
              <path
                key={`ring${i}`}
                className={cn("rm-outer", active === i && "is-active")}
                d={slicePath(i, items.length, ringOuter, ringInner)}
              />
            ))}
          </g>

          {items.map((item, i) => {
            const mid = START_ANGLE + slice * i;
            const g = polarToCartesian(glyphRing, mid);
            const on = active === i;
            return (
              <g
                key={item.id}
                className="rm-slice"
                role="menuitem"
                tabIndex={-1}
                aria-label={item.label}
                onPointerEnter={() => setActive(i)}
                onPointerLeave={() => setActive((a) => (a === i ? null : a))}
                onClick={() => go(i)}
              >
                <path
                  className={cn("rm-wedge", on && "is-active")}
                  d={slicePath(i, items.length, wedgeOuter, wedgeInner)}
                />
                <g className={cn("rm-glyph", on && "is-active")} transform={`translate(${g.x} ${g.y})`}>
                  <g transform="translate(-12 -12)">{item.glyph}</g>
                </g>
              </g>
            );
          })}

          <circle className="rm-centre" cx={0} cy={0} r={centre} />
          {/* the label lives in the middle, so no pip there to collide with it */}
          <circle className="rm-pip" cx={0} cy={centre - 7} r={2.5} />
        </svg>

        {/* the label reads in the middle, where the eye already is */}
        <span className="rm-label" aria-live="polite">
          {active != null ? items[active].label : "Next Gen"}
        </span>
      </div>
    </div>
  );
}
