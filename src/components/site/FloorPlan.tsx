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

/* ---- the house ----
 * Redrawn tighter. The previous set-out put the house at x200-1000 inside a
 * 1120 box, so it sat right of centre with a dead column down the left, and
 * several labels landed on top of walls: SHOWER sat exactly on the y=300
 * divider, FRIDGE / ICE ran across the kitchen wall into the living room, and
 * KITCHEN sat below its own room. Every label below is placed against the room
 * it names AND checked against the trunk and the fixture leaders.
 */
const WALLS = [
  "M150 90 H950 V590 H150 Z", // outer
  "M390 90 V400", // garage / rest
  "M150 400 H390", // garage / laundry
  "M390 280 H950", // sleeping side / living side
  "M650 280 V590", // kitchen / living
  "M760 90 V280", // bedrooms / bath
];

/** Room labels sit inside the room they name, clear of every wall, the trunk
 *  and the fixture leaders. Move a fixture and check these again. */
const ROOMS = [
  { x: 270, y: 150, label: "GARAGE" },
  { x: 270, y: 555, label: "LAUNDRY" },
  { x: 440, y: 315, label: "KITCHEN" },
  { x: 880, y: 560, label: "LIVING" },
  { x: 575, y: 185, label: "BEDROOMS" },
  { x: 855, y: 125, label: "BATH" },
];

/**
 * The trunk, as one path. `at` on each fixture is how far along that path the
 * water has to travel before it reaches the branch — measured with
 * getPointAtLength at runtime, not guessed, so moving the trunk cannot silently
 * desynchronise the lights.
 */
const TRUNK = "M330 326 H420 V520 H690 V430 H800 V165";

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

/* Every branch point lies ON the trunk, and every label is anchored so its
   text runs INTO the room the fitting belongs to rather than across a wall. */
const FIXTURES: Fixture[] = [
  { bx: 420, by: 470, fx: 300, fy: 470, label: "TROUGH", anchor: "end" },
  { bx: 500, by: 520, fx: 500, fy: 430, label: "KITCHEN SINK" },
  { bx: 580, by: 520, fx: 580, fy: 560, label: "DISHWASHER", anchor: "end" },
  { bx: 620, by: 520, fx: 620, fy: 370, label: "FRIDGE / ICE", anchor: "end" },
  // the riser sits at x800 and these run right of it: anchoring these "end"
  // put the label text straight through the pipe that feeds them
  { bx: 800, by: 250, fx: 880, fy: 250, label: "SHOWER" },
  { bx: 800, by: 172, fx: 880, fy: 172, label: "BASIN" },
];

export function FloorPlan() {
  const rootRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
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
      // The run does not start until the WHOLE plan is on screen. Keying it to
      // the section's top meant the water was already a third of the way down
      // the house before the reader could see the house, so the one thing the
      // section exists to show had partly happened off-screen. Now it waits for
      // the map, then runs over about two thirds of a screen of scroll.
      const plateEl = plateRef.current;
      const plate = plateEl?.getBoundingClientRect();
      let t: number;
      // Ask the stylesheet whether the plan is actually being held, rather than
      // guessing from its height. A height test picked the wrong branch by a
      // single pixel here (775 tall against a 774 threshold) and silently fell
      // back to the old mapping; this cannot drift out of step with the CSS.
      const isHeld = plateEl ? getComputedStyle(plateEl).position === "sticky" : false;
      if (plate && isHeld) {
        // The plan is sticky, so once it has come fully into view it STAYS
        // there and the reader watches the whole run without the top of the
        // house sliding off. Progress is how far into the runway below it we
        // have scrolled, which is exactly how long it is held for.
        // Measured against the RUNWAY, not against the plan. Once an element
        // is stuck its own top stops changing by definition, so anything
        // derived from it is frozen. The runway sits directly below the plan in
        // normal flow, so its top edge is where the plan's flow-bottom would
        // be, and that keeps moving for exactly as long as the plan is held.
        // Everything here is measured off the RUNWAY, which is never sticky and
        // so keeps a stable document position. A stuck element's own rect stops
        // moving by definition, so any progress derived from it freezes.
        const stickyTop = parseFloat(getComputedStyle(plateEl!).top) || 0;
        const runwayEl = root.querySelector(".fp-runway") as HTMLElement | null;
        const runway = Math.max(1, runwayEl?.offsetHeight ?? vh * 0.6);
        const runwayDocTop = (runwayEl?.getBoundingClientRect().top ?? 0) + window.scrollY;
        // the scroll position at which the plan's natural top reaches the
        // sticky line, i.e. the exact moment the whole plan is settled in view
        const start = runwayDocTop - plate.height - stickyTop;
        t = Math.min(1, Math.max(0, (window.scrollY - start) / runway));
      } else {
        // Too tall to hold (narrow screens): sticky is off there, so fall back
        // to the section's top crossing rather than never running at all.
        t = Math.min(1, Math.max(0, (vh * 0.86 - b.top) / (vh * 0.72)));
      }
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
    <section className="fp ground sheet-edge" ref={rootRef} aria-labelledby="fp-h">
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

        <div className="fp-plate" ref={plateRef}>
          <svg
            viewBox="-10 60 1010 570"
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
              <path d="M70 326 H250" />
              <circle cx="70" cy="326" r="5" />
              <text x="70" y="306" className="fp-tag" textAnchor="middle">
                METER
              </text>
            </g>

            {/* the machine on the garage wall */}
            <g className="fp-machine">
              <rect x="250" y="300" width="80" height="52" rx="3" />
              {[0, 1, 2].map((i) => (
                <rect key={i} className="fp-vessel" x={260 + i * 22} y={310} width="14" height="32" rx="2" />
              ))}
              <text x="290" y="286" className="fp-tag" textAnchor="middle">
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
        {/* scroll room for the sticky plan above: the water advances across
            this distance while the house itself stays put */}
        <div className="fp-runway" aria-hidden="true" />

        {/* THE MOBILE VERSION OF THE LABELS.
            At 390px the plan was forced to min-width 720px inside a scroll
            container, so half the house sat off-screen and the water reached
            fittings the reader could not see — which is the one thing the
            section exists to show. The plan now fits the screen and drops its
            own labels, because at that scale they render around 8px. The names
            live here instead, and light up on the same `reached` index the
            drawing uses, so the list IS the legend. Desktop never sees it. */}
        <ol className="fp-list" aria-hidden="true">
          {FIXTURES.map((f, i) => (
            <li key={f.label} className={i <= reached ? "is-served" : undefined}>
              <i />
              {f.label}
            </li>
          ))}
        </ol>

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
