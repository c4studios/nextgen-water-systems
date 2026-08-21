"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

/**
 * THE SET-OUT — where the filtered water actually goes.
 *
 * This is the answer to "can you show how much good it does" that does not
 * require a single performance figure. The magnitude here is COVERAGE, which is
 * checkable and is the real difference between this and a jug on the bench: one
 * machine at the point of entry, and everything downstream of it.
 *
 * Drawn as a hydraulic set-out in the site's own line language — a main run with
 * elbows and unequal branch drops, not a radial fan of icons. The geometry is
 * hand-authored below; it must never come from a spacing loop, because evenly
 * spaced branches are what makes a diagram look generated.
 *
 * ⚠️ Copy rule: each terminus describes THE WATER AT THAT OUTLET, never what the
 * appliance will then do for you. "Fed filtered, same as the tap" is fine.
 * "No more cloudy glasses" is a performance claim and is not.
 */

type Branch = { x: number; y: number; label: string; note: string };

/** Hand-placed and deliberately uneven. The depths DECREASE left to right for
 *  a geometric reason, not an aesthetic one: each drop then stops short of the
 *  label to its left, so no branch line is ever ruled through someone else's
 *  text. Change a depth and check that still holds. */
const BRANCHES: Branch[] = [
  { x: 452, y: 470, label: "KITCHEN TAP", note: "the one you drink from" },
  { x: 548, y: 434, label: "DISHWASHER", note: "same water as the tap" },
  { x: 634, y: 404, label: "ICE MAKER", note: "ice is water too" },
  { x: 726, y: 362, label: "BATHROOM", note: "basin, bath, brushing" },
  { x: 818, y: 332, label: "SHOWER", note: "the water you stand in" },
  { x: 906, y: 296, label: "LAUNDRY", note: "washer and trough" },
];

/** the dashed maybe-branch sits well clear of the last label */
const MAYBE_X = BRANCHES[BRANCHES.length - 1].x + 230;
const MAYBE_Y = 540;

/** the main run's height, and where the machine sits on it */
const RUN_Y = 200;
const MACHINE = { x: 250, y: 154, w: 142, h: 92 };

export function SetOut() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    // Opt IN to the hidden start state only once JS is running. Without this
    // the whole diagram would be invisible to anyone whose observer never
    // fires, which is the reveal-animation trap.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.dataset.anim = "on";
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          root.classList.add("is-drawn");
          io.disconnect(); // draws once; it must never re-stagger on re-entry
        }
      },
      { threshold: 0.18 },
    );
    io.observe(root);
    // failsafe: if the observer never fires, show it anyway
    const t = window.setTimeout(() => root.classList.add("is-drawn"), 2500);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return (
    <section className="so" ref={rootRef} aria-labelledby="so-h">
      <div className="so-inner">
        <header className="so-head">
          <h2 className="so-h" id="so-h">
            One machine.
            <br />
            Every tap behind it.
          </h2>
          <p className="so-lead">
            It goes in where the water comes into the property, so everything drawn below it runs
            through it. A jug on the bench does the one tap you fill it from.
          </p>
        </header>

        <div className="so-plate">
          <svg viewBox="0 0 1400 620" role="img" aria-labelledby="so-svg-t" className="so-svg">
            <title id="so-svg-t">
              A hydraulic set-out: the water main enters the property, passes through the filter, and
              continues to the kitchen tap, dishwasher, ice maker, bathroom, shower and laundry. A
              dashed branch to the garden and reticulation is marked as depending on the house.
            </title>

            {/* mains in, from the meter */}
            <g className="so-in">
              <path className="so-line so-line--main" d="M56 96 H300 V154" pathLength={1} />
              <circle className="so-dot" cx="56" cy="96" r="4" />
              <text className="so-tag" x="56" y="76">
                MAINS IN
              </text>
              <text className="so-note" x="56" y="60">
                from the meter
              </text>
            </g>

            {/* the machine */}
            <g className="so-machine">
              <rect
                className="so-box"
                x={MACHINE.x}
                y={MACHINE.y}
                width={MACHINE.w}
                height={MACHINE.h}
                rx="4"
              />
              {[0, 1, 2].map((i) => (
                <rect
                  key={i}
                  className="so-vessel"
                  x={MACHINE.x + 18 + i * 38}
                  y={MACHINE.y + 20}
                  width="24"
                  height="52"
                  rx="3"
                />
              ))}
              <text className="so-tag so-tag--mid" x={MACHINE.x + MACHINE.w / 2} y={MACHINE.y - 14}>
                NGW-01
              </text>
            </g>

            {/* the house run, and its branches */}
            <path
              className="so-line so-line--main"
              d={`M${MACHINE.x + MACHINE.w} ${RUN_Y} H${MAYBE_X}`}
              pathLength={1}
              style={{ ["--i" as string]: 1 }}
            />

            {BRANCHES.map((b, i) => (
              <g className="so-branch" key={b.label} style={{ ["--i" as string]: i + 2 }}>
                {/* down off the main, then a short elbow out to the fitting */}
                <path
                  className="so-line"
                  d={`M${b.x} ${RUN_Y} V${b.y - 16} q0 16 16 16 h10`}
                  pathLength={1}
                />
                <circle className="so-dot" cx={b.x + 26} cy={b.y} r="3.5" />
                <text className="so-tag" x={b.x + 38} y={b.y + 3}>
                  {b.label}
                </text>
                <text className="so-note" x={b.x + 38} y={b.y + 19}>
                  {b.note}
                </text>
              </g>
            ))}

            {/* the honest unknown */}
            <g className="so-branch so-branch--maybe" style={{ ["--i" as string]: BRANCHES.length + 2 }}>
              {/* not dash-drawn: the draw uses stroke-dasharray, which would
                  eat this line's dashes. It fades instead. */}
              <path
                className="so-line so-line--dashed"
                d={`M${MAYBE_X} ${RUN_Y} V${MAYBE_Y - 16} q0 16 16 16 h10`}
              />
              <circle className="so-dot so-dot--hollow" cx={MAYBE_X + 26} cy={MAYBE_Y} r="3.5" />
              <text className="so-tag" x={MAYBE_X + 38} y={MAYBE_Y + 3}>
                GARDEN &amp; RETIC
              </text>
              <text className="so-note" x={MAYBE_X + 38} y={MAYBE_Y + 19}>
                depends on the house
              </text>
            </g>
          </svg>
        </div>

        <p className="so-foot">
          It is not a water softener and it is not reverse osmosis.{" "}
          <Link className="so-inline" href="/system/">
            What it does and does not do
          </Link>{" "}
          is set out in full on the system sheet. Whether the garden taps sit downstream is a
          question about your own plumbing, and it gets answered at the test.
        </p>
      </div>
    </section>
  );
}
