"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/**
 * THE PLAN — the water run through an actual house, advancing as you scroll.
 *
 * Replaces the abstract hydraulic set-out, which was a diagram of an idea. This
 * is a floor plan you can recognise: meter at the boundary, machine on the
 * garage wall, and the run threading through the walls to every fixture. It
 * answers "how much good does it do" with coverage rather than a percentage,
 * and it is the section that makes a jug on the bench look like what it is.
 *
 * The scroll mechanic is the point, not decoration: the water ADVANCES along
 * the trunk as the section passes through the viewport, and each fixture lights
 * the moment the water reaches it. Scrub back and it recedes. That is a
 * mechanism you can read, so it earns the scroll it takes.
 *
 * Geometry is hand-authored. Rooms are a real 4x2 footprint rather than a grid,
 * and the trunk turns where a real run would turn.
 */

/* ---- the house ---- */
const WALLS = [
  "M200 120 H1000 V620 H200 Z", // outer
  "M420 120 V430", // garage / rest
  "M200 430 H420", // garage / laundry
  "M420 300 H1000", // bedrooms / living
  "M680 300 V620", // kitchen / living
  "M820 120 V300", // bed / bath
];

/** Room labels are placed to clear both the trunk and the fixture labels.
 *  Move a fixture and check these again. */
const ROOMS = [
  { x: 310, y: 250, label: "GARAGE" },
  { x: 300, y: 590, label: "LAUNDRY" },
  { x: 490, y: 600, label: "KITCHEN" },
  { x: 900, y: 580, label: "LIVING" },
  { x: 620, y: 215, label: "BEDROOMS" },
  { x: 856, y: 150, label: "BATH" },
];

/**
 * The trunk, as one path. `at` on each fixture is how far along that path the
 * water has to travel before it reaches the branch — measured with
 * getPointAtLength at runtime, not guessed, so moving the trunk cannot silently
 * desynchronise the lights.
 */
const TRUNK = "M296 372 H452 V560 H700 V470 H860 V196";

type Fixture = {
  /** where the branch leaves the trunk */
  bx: number;
  by: number;
  /** the fitting itself */
  fx: number;
  fy: number;
  label: string;
  anchor?: "end";
};

const FIXTURES: Fixture[] = [
  { bx: 452, by: 500, fx: 322, fy: 500, label: "TROUGH", anchor: "end" },
  { bx: 560, by: 560, fx: 560, fy: 468, label: "KITCHEN SINK" },
  { bx: 612, by: 560, fx: 612, fy: 404, label: "FRIDGE / ICE" },
  { bx: 660, by: 560, fx: 660, fy: 606, label: "DISHWASHER", anchor: "end" },
  { bx: 860, by: 300, fx: 916, fy: 300, label: "SHOWER" },
  { bx: 860, by: 214, fx: 916, fy: 214, label: "BASIN" },
];

export function FloorPlan() {
  const rootRef = useRef<HTMLElement>(null);
  const trunkRef = useRef<SVGPathElement>(null);
  const waterRef = useRef<SVGPathElement>(null);
  const [reached, setReached] = useState<number>(-1);

  useEffect(() => {
    const root = rootRef.current;
    const trunk = trunkRef.current;
    const water = waterRef.current;
    if (!root || !trunk || !water) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const total = trunk.getTotalLength();

    if (reduced) {
      // no scroll mechanic: show the finished run, everything served
      water.style.strokeDasharray = "none";
      water.style.strokeDashoffset = "0";
      setReached(FIXTURES.length - 1);
      return;
    }

    root.dataset.anim = "on";
    water.style.strokeDasharray = String(total);

    // Where each fixture sits along the trunk, measured rather than assumed.
    const marks = FIXTURES.map((f) => {
      let best = 0;
      let bestD = Infinity;
      for (let l = 0; l <= total; l += 4) {
        const p = trunk.getPointAtLength(l);
        const d = (p.x - f.bx) ** 2 + (p.y - f.by) ** 2;
        if (d < bestD) {
          bestD = d;
          best = l;
        }
      }
      return best / total;
    });

    let raf = 0;
    const frame = () => {
      raf = 0;
      const b = root.getBoundingClientRect();
      const vh = window.innerHeight;
      // Keyed to the section's TOP crossing the viewport, over about three
      // quarters of a screen. Spreading it over the section's full height meant
      // the run was still a sixth full by the time it left the screen.
      const t = Math.min(1, Math.max(0, (vh * 0.86 - b.top) / (vh * 0.72)));
      // ease so the water arrives with some weight rather than linearly
      const e = t * t * (3 - 2 * t);
      water.style.strokeDashoffset = String(total * (1 - e));
      let n = -1;
      for (let i = 0; i < marks.length; i++) if (e >= marks[i]) n = i;
      setReached((prev) => (prev === n ? prev : n));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    frame();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="fp" ref={rootRef} aria-labelledby="fp-h">
      <div className="fp-inner">
        <header className="fp-head">
          <h2 className="fp-h" id="fp-h">
            One machine.
            <br />
            Every tap behind it.
          </h2>
          <p className="fp-lead">
            It goes in where the water enters the property, so everything past it runs through it.
            A jug on the bench does the one tap you fill it from.
          </p>
        </header>

        <div className="fp-plate">
          <svg
            viewBox="0 0 1120 700"
            className="fp-svg"
            role="img"
            aria-label="A house floor plan. The water main enters at the meter, passes through the filter on the garage wall, and runs on to the laundry trough, kitchen sink, dishwasher, fridge, shower, basin and ensuite."
          >
            {/* the house */}
            <g className="fp-walls">
              {WALLS.map((d) => (
                <path key={d} d={d} />
              ))}
            </g>
            {ROOMS.map((r) => (
              <text key={r.label} className="fp-room" x={r.x} y={r.y} textAnchor="middle">
                {r.label}
              </text>
            ))}

            {/* the meter, out at the boundary */}
            <g className="fp-meter">
              <path d="M96 372 H200" />
              <circle cx="96" cy="372" r="5" />
              <text x="96" y="350" className="fp-tag">
                METER
              </text>
            </g>

            {/* the machine on the garage wall */}
            <g className="fp-machine">
              <rect x="216" y="336" width="80" height="52" rx="3" />
              {[0, 1, 2].map((i) => (
                <rect key={i} className="fp-vessel" x={226 + i * 22} y={346} width="14" height="32" rx="2" />
              ))}
              <text x="256" y="322" className="fp-tag" textAnchor="middle">
                NGW-01
              </text>
            </g>

            {/* branches, drawn under the trunk so the water reads as on top */}
            {FIXTURES.map((f, i) => (
              <g key={f.label} className={`fp-fix${i <= reached ? " is-served" : ""}`}>
                <path className="fp-branch" d={`M${f.bx} ${f.by} L${f.fx} ${f.fy}`} />
                <circle className="fp-fitting" cx={f.fx} cy={f.fy} r="5" />
                <text
                  className="fp-fixlabel"
                  x={f.anchor === "end" ? f.fx - 12 : f.fx + 12}
                  y={f.fy + 4}
                  textAnchor={f.anchor === "end" ? "end" : "start"}
                >
                  {f.label}
                </text>
              </g>
            ))}

            {/* the run: a dark bed, with the water advancing along it */}
            <path ref={trunkRef} className="fp-trunk" d={TRUNK} />
            <path ref={waterRef} className="fp-water" d={TRUNK} />
          </svg>
        </div>

        <p className="fp-foot">
          <span className="fp-count">
            {Math.max(0, reached + 1)} of {FIXTURES.length}
          </span>
          fittings past the filter. Garden taps and reticulation depend on how the house was
          plumbed, and that gets answered at the test. It is not a water softener and it is not
          reverse osmosis:{" "}
          <Link className="fp-inline" href="/system/">
            what it does and does not do
          </Link>{" "}
          is set out in full on the system sheet.
        </p>
      </div>
    </section>
  );
}
