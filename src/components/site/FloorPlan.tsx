"use client";

import { useEffect, useRef, useState } from "react";
import { SheetStrip } from "@/components/site/SheetStrip";
import Link from "next/link";

/**
 * THE PLAN — the water run through a house, advancing as you scroll.
 *
 * Rebuilt. The previous version was a wireframe: hairline walls with no
 * thickness, no doors, no windows, labels floating in empty rooms, and a single
 * trunk that staircased through the living room like a maze. It read as a
 * diagram of an idea, which is what the client said.
 *
 * The reference now is an architect's HYDRAULIC SERVICES PLAN, the sheet a
 * plumber actually receives: walls drawn as bands with real thickness, door
 * swings, window lines, standard fixture symbols, wet areas hatched, a north
 * point, a scale bar, a legend, and the cold-water service drawn as the line it
 * is. Same drawing-set language as the rest of the site, made real.
 *
 * The run is TWO paths from a manifold at the filter, not one snake: a front
 * run to the laundry and kitchen, a back run to the bathroom. That is how a
 * real system works (pressure everywhere at once) and it is what stops the
 * route reading as a maze. Both fill on the same scroll scalar. Each fitting
 * lights the moment the water reaches it on its own run, measured with
 * getPointAtLength rather than guessed, so moving a pipe cannot silently
 * desynchronise the lights.
 *
 * Nothing here is a real house. It says so on the sheet.
 */

/* ── geometry, in plan units ─────────────────────────────────────────── */
const OUT = { x: 100, y: 70, w: 800, h: 480 }; // outer face of the external wall
const EXT = 8; // external wall thickness
const INT = 5; // internal wall thickness

/** Interior walls as bands, with door openings punched out of them. */
const INT_WALLS: Array<{ x: number; y: number; w: number; h: number }> = [
  { x: 340, y: 70, w: INT, h: 300 }, // garage + laundry, east wall (upper part)
  { x: 340, y: 430, w: INT, h: 120 }, // ... lower part, past the laundry door
  { x: 100, y: 300, w: 240, h: INT }, // garage / laundry
  { x: 340, y: 260, w: 140, h: INT }, // back band, west of bedroom door
  { x: 530, y: 260, w: 250, h: INT }, // ... between bedroom door and bath door
  { x: 830, y: 260, w: 70, h: INT }, // ... east of bath door
  { x: 720, y: 70, w: INT, h: 190 }, // bedrooms / bath
  { x: 620, y: 260, w: INT, h: 70 }, // kitchen / living nib (open plan beyond)
];

/** Door swings: hinge point, radius, and the quadrant the leaf sweeps. */
const DOORS: Array<{ hx: number; hy: number; r: number; from: number; to: number }> = [
  { hx: 340, hy: 370, r: 60, from: 90, to: 180 }, // laundry: closed down the wall, opens into the laundry
  { hx: 530, hy: 262, r: 50, from: 180, to: 270 }, // bedrooms: hinged east jamb, opens up into the bedrooms
  { hx: 830, hy: 262, r: 50, from: 180, to: 270 }, // bath: hinged east jamb, opens up into the bath
  { hx: 760, hy: 550, r: 60, from: 180, to: 270 }, // front entry: opens up into the living room
];

/** Windows: a pair of lines in the wall band, with the sill shown. */
const WINDOWS: Array<{ x: number; y: number; w: number; h: number }> = [
  { x: 400, y: 70, w: 80, h: EXT }, // bedroom, north
  { x: 560, y: 70, w: 80, h: EXT }, // bedroom, north
  { x: 900 - EXT, y: 380, w: EXT, h: 80 }, // living, east
  { x: 420, y: 550 - EXT, w: 80, h: EXT }, // kitchen, south
  { x: 150, y: 550 - EXT, w: 60, h: EXT }, // laundry, south
];

/** The garage roller door, shown as a dashed run in the wall line. */
const ROLLER = { x: 150, y: 70, w: 140 };

type Room = { label: string; x: number; y: number; wet?: boolean; box: [number, number, number, number] };
const ROOMS: Room[] = [
  { label: "GARAGE", x: 222, y: 190, box: [104, 74, 236, 226] },
  { label: "LAUNDRY", x: 222, y: 372, wet: true, box: [104, 305, 236, 241] },
  { label: "BEDROOMS", x: 530, y: 170, box: [345, 74, 375, 186] },
  { label: "BATH", x: 762, y: 105, wet: true, box: [725, 74, 171, 186] },
  { label: "KITCHEN", x: 480, y: 308, wet: true, box: [345, 265, 275, 281] },
  { label: "LIVING", x: 800, y: 500, box: [625, 265, 271, 281] },
];

/** The filter, on the garage's east wall, where the main comes in. */
const UNIT = { x: 286, y: 190, w: 54, h: 36 };
const METER = { x: 40, y: 208 };

/**
 * The runs. Two paths from the manifold at the unit's outlet.
 *   A — front: down the laundry/kitchen wall, along the kitchen's front wall
 *   B — back: along the back band to the bathroom
 */
const RUN_A = "M346 208 V505 H520";
const RUN_B = "M346 208 V272 H882 V132";

type Sym = "trough" | "sink" | "dishwasher" | "fridge" | "shower" | "basin";
type Fixture = {
  label: string;
  run: "A" | "B";
  /** where the branch leaves the run */
  bx: number;
  by: number;
  /** the fitting's own position (symbol centre) */
  fx: number;
  fy: number;
  sym: Sym;
  /** label placement relative to the symbol */
  lx: number;
  ly: number;
  anchor?: "start" | "middle" | "end";
  /** one drafted line about this fitting, shown on hover/focus and in the list */
  note: string;
  /** where the note sits: the anchor corner of its box */
  nx: number;
  ny: number;
};

const FIXTURES: Fixture[] = [
  { label: "TROUGH", run: "A", bx: 346, by: 450, fx: 214, fy: 450, sym: "trough", lx: 214, ly: 490, anchor: "middle", note: "THE LAUNDRY'S COLD FEED", nx: 124, ny: 402 },
  { label: "FRIDGE / ICE", run: "A", bx: 372, by: 505, fx: 372, fy: 345, sym: "fridge", lx: 400, ly: 349, anchor: "start", note: "ICE AND CHILLED WATER", nx: 400, ny: 356 },
  { label: "KITCHEN SINK", run: "A", bx: 450, by: 505, fx: 450, fy: 515, sym: "sink", lx: 450, ly: 483, anchor: "middle", note: "THE TAP YOU DRINK FROM", nx: 372, ny: 436 },
  { label: "DISHWASHER", run: "A", bx: 510, by: 505, fx: 520, fy: 516, sym: "dishwasher", lx: 548, ly: 520, anchor: "start", note: "FILLS FROM THE SAME LINE", nx: 548, ny: 528 },
  { label: "SHOWER", run: "B", bx: 882, by: 200, fx: 764, fy: 200, sym: "shower", lx: 764, ly: 242, anchor: "middle", note: "THE SCREEN THAT SCALES", nx: 700, ny: 250 },
  { label: "BASIN", run: "B", bx: 882, by: 132, fx: 850, fy: 118, sym: "basin", lx: 846, ly: 152, anchor: "middle", note: "THE FIRST TAP OF THE DAY", nx: 738, ny: 158 },
];

const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  return `M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}`;
};

function Symbol({ f }: { f: Fixture }) {
  const { fx: x, fy: y } = f;
  switch (f.sym) {
    case "trough":
      return (
        <g className="fp-sym">
          <rect x={x - 22} y={y - 14} width={44} height={28} rx={2} />
          <rect x={x - 17} y={y - 9} width={34} height={18} rx={1.5} />
          <circle cx={x + 10} cy={y} r={2} />
        </g>
      );
    case "sink":
      return (
        <g className="fp-sym">
          <rect x={x - 24} y={y - 12} width={48} height={24} rx={2} />
          <rect x={x - 20} y={y - 8} width={18} height={16} rx={2} />
          <rect x={x + 2} y={y - 8} width={18} height={16} rx={2} />
          <circle cx={x} cy={y - 8} r={1.8} />
        </g>
      );
    case "dishwasher":
      return (
        <g className="fp-sym">
          <rect x={x - 15} y={y - 15} width={30} height={30} rx={1.5} />
          <path d={`M${x - 15} ${y - 15} L${x + 15} ${y + 15}`} />
          <text className="fp-symtxt" x={x} y={y + 4} textAnchor="middle">
            DW
          </text>
        </g>
      );
    case "fridge":
      return (
        <g className="fp-sym">
          <rect x={x - 17} y={y - 21} width={34} height={42} rx={1.5} />
          <path d={`M${x - 17} ${y - 4} H${x + 17}`} />
          <text className="fp-symtxt" x={x} y={y + 12} textAnchor="middle">
            F
          </text>
        </g>
      );
    case "shower":
      return (
        <g className="fp-sym">
          <rect x={x - 22} y={y - 22} width={44} height={44} rx={1.5} />
          <path d={`M${x - 22} ${y - 22} L${x + 22} ${y + 22} M${x + 22} ${y - 22} L${x - 22} ${y + 22}`} className="fp-sym-thin" />
          <circle cx={x} cy={y} r={4} />
        </g>
      );
    case "basin":
      return (
        <g className="fp-sym">
          <ellipse cx={x} cy={y} rx={16} ry={11} />
          <ellipse cx={x} cy={y + 1} rx={11} ry={7} />
          <circle cx={x} cy={y - 7} r={1.6} />
        </g>
      );
  }
}

export function FloorPlan() {
  const rootRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const runA = useRef<SVGPathElement>(null);
  const runB = useRef<SVGPathElement>(null);
  const waterA = useRef<SVGPathElement>(null);
  const waterB = useRef<SVGPathElement>(null);
  /** which fittings the water has reached, by index */
  const [served, setServed] = useState<boolean[]>(() => FIXTURES.map(() => false));
  /** Below 900px the sheet furniture is off, so the viewBox closes in on the
   *  house itself rather than keeping the margins that furniture needed. */
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const ra = runA.current, rb = runB.current, wa = waterA.current, wb = waterB.current;
    if (!root || !ra || !rb || !wa || !wb) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenA = ra.getTotalLength();
    const lenB = rb.getTotalLength();

    if (reduced) {
      // no scroll mechanic: the finished run, everything served
      for (const w of [wa, wb]) {
        w.style.strokeDasharray = "none";
        w.style.strokeDashoffset = "0";
      }
      setServed(FIXTURES.map(() => true));
      return;
    }

    root.dataset.anim = "on";
    wa.style.strokeDasharray = String(lenA);
    wb.style.strokeDasharray = String(lenB);

    // Where each fitting's branch leaves its run, as a fraction of that run.
    // Measured, not assumed: walk the path and take the nearest sample.
    const frac = FIXTURES.map((f) => {
      const path = f.run === "A" ? ra : rb;
      const total = f.run === "A" ? lenA : lenB;
      let best = 0, bestD = Infinity;
      for (let l = 0; l <= total; l += 3) {
        const p = path.getPointAtLength(l);
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
      const plateEl = plateRef.current;
      const plate = plateEl?.getBoundingClientRect();
      const vh = window.innerHeight;
      let t: number;
      const isHeld = plateEl ? getComputedStyle(plateEl).position === "sticky" : false;
      if (plate && isHeld) {
        // Measured off the RUNWAY, which never sticks and so keeps a stable
        // document position. A stuck element's own rect stops moving by
        // definition, so any progress derived from it freezes.
        const stickyTop = parseFloat(getComputedStyle(plateEl!).top) || 0;
        const runwayEl = root.querySelector(".fp-runway") as HTMLElement | null;
        const runway = Math.max(1, runwayEl?.offsetHeight ?? vh * 0.6);
        const runwayDocTop = (runwayEl?.getBoundingClientRect().top ?? 0) + window.scrollY;
        const start = runwayDocTop - plate.height - stickyTop;
        t = Math.min(1, Math.max(0, (window.scrollY - start) / runway));
      } else {
        const b = root.getBoundingClientRect();
        t = Math.min(1, Math.max(0, (vh * 0.86 - b.top) / (vh * 0.72)));
      }
      // ease so the water arrives with some weight rather than linearly
      const e = t * t * (3 - 2 * t);
      wa.style.strokeDashoffset = String(lenA * (1 - e));
      wb.style.strokeDashoffset = String(lenB * (1 - e));
      const next = frac.map((fr) => e >= fr);
      setServed((prev) => (prev.every((v, i) => v === next[i]) ? prev : next));
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

  const count = served.filter(Boolean).length;
  const inner = { x: OUT.x + EXT, y: OUT.y + EXT, w: OUT.w - 2 * EXT, h: OUT.h - 2 * EXT };

  return (
    <section className="fp ground sheet-edge" id="plan" data-sheet="03" data-rev="C" data-name="WHERE IT GOES · PLAN" ref={rootRef} aria-labelledby="fp-h">
      <div className="fp-inner">
        <SheetStrip n="03" title="Where it goes" note="Hydraulic services plan" />
        <header className="fp-head">
          <h2 className="fp-h" id="fp-h">
            One machine.
            <br />
            Every tap behind it.
          </h2>
          <p className="fp-lead">
            It goes in where the water enters the property, so everything past it runs through it.
            A jug on the bench does the one tap you fill it from. Scroll, and watch the water reach
            each fitting.
          </p>
        </header>

        <div className="fp-hold">
        <div className="fp-plate" ref={plateRef}>
          <svg
            viewBox={narrow ? "30 62 880 496" : "0 0 1000 620"}
            className="fp-svg"
            role="img"
            aria-label="A hydraulic services plan of a typical four-bedroom house. The water main enters at the meter, passes through the filter unit on the garage wall, then runs two ways: along the front of the house to the laundry trough, fridge, kitchen sink and dishwasher, and along the back to the shower and basin."
          >
            <defs>
              {/* wet-area hatch, as a plan shows tiled floors */}
              <pattern id="fp-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="9" className="fp-hatch-line" />
              </pattern>
            </defs>

            {/* sheet furniture: north point, scale bar, the honesty line */}
            <g className="fp-north" transform="translate(944 96)">
              <path d="M0 -22 L7 8 L0 3 L-7 8 Z" />
              <text x="0" y="24" textAnchor="middle" className="fp-furn">
                N
              </text>
            </g>
            <g className="fp-scale" transform="translate(104 570)">
              {[0, 1, 2, 3].map((k) => (
                <rect key={k} x={k * 30} y={0} width={30} height={5} className={k % 2 ? "fp-scale-b" : "fp-scale-a"} />
              ))}
              <text x="0" y="17" className="fp-furn">
                0
              </text>
              <text x="120" y="17" textAnchor="end" className="fp-furn">
                NOMINAL
              </text>
            </g>
            <text x="104" y="606" className="fp-furn fp-furn--note">
              TYPICAL 4 × 2 · SCHEMATIC ONLY · NOT A REAL HOUSE
            </text>

            {/* floors: wet areas hatched */}
            {ROOMS.filter((r) => r.wet).map((r) => (
              <rect key={r.label} x={r.box[0]} y={r.box[1]} width={r.box[2]} height={r.box[3]} className="fp-wet" />
            ))}

            {/* walls: the external band (even-odd), then the interior bands */}
            <path
              className="fp-wall"
              fillRule="evenodd"
              d={`M${OUT.x} ${OUT.y} h${OUT.w} v${OUT.h} h${-OUT.w} Z M${inner.x} ${inner.y} h${inner.w} v${inner.h} h${-inner.w} Z`}
            />
            {INT_WALLS.map((w, i) => (
              <rect key={i} className="fp-wall" x={w.x} y={w.y} width={w.w} height={w.h} />
            ))}

            {/* openings in the external wall: windows and the roller door */}
            {WINDOWS.map((w, i) => (
              <g key={i} className="fp-window">
                <rect x={w.x} y={w.y} width={w.w} height={w.h} className="fp-window-cut" />
                {w.w > w.h ? (
                  <>
                    <line x1={w.x} y1={w.y + w.h * 0.35} x2={w.x + w.w} y2={w.y + w.h * 0.35} />
                    <line x1={w.x} y1={w.y + w.h * 0.65} x2={w.x + w.w} y2={w.y + w.h * 0.65} />
                  </>
                ) : (
                  <>
                    <line x1={w.x + w.w * 0.35} y1={w.y} x2={w.x + w.w * 0.35} y2={w.y + w.h} />
                    <line x1={w.x + w.w * 0.65} y1={w.y} x2={w.x + w.w * 0.65} y2={w.y + w.h} />
                  </>
                )}
              </g>
            ))}
            <g className="fp-roller">
              <rect x={ROLLER.x} y={ROLLER.y} width={ROLLER.w} height={EXT} className="fp-window-cut" />
              <line x1={ROLLER.x} y1={ROLLER.y + EXT / 2} x2={ROLLER.x + ROLLER.w} y2={ROLLER.y + EXT / 2} />
            </g>

            {/* doors: leaf and swing */}
            {DOORS.map((d, i) => {
              const a0 = (d.from * Math.PI) / 180;
              return (
                <g key={i} className="fp-door">
                  <line x1={d.hx} y1={d.hy} x2={d.hx + d.r * Math.cos(a0)} y2={d.hy + d.r * Math.sin(a0)} />
                  <path d={arc(d.hx, d.hy, d.r, d.from, d.to)} />
                </g>
              );
            })}

            {/* room names, centred in their rooms */}
            {ROOMS.map((r) => (
              <text key={r.label} className="fp-room" x={r.x} y={r.y} textAnchor="middle">
                {r.label}
              </text>
            ))}

            {/* the meter, out at the boundary, and the main coming in */}
            <g className="fp-meter">
              <path d={`M${METER.x} ${METER.y} H${UNIT.x}`} />
              <circle cx={METER.x} cy={METER.y} r={6} />
              <text x={METER.x} y={METER.y - 14} className="fp-tag" textAnchor="middle">
                METER
              </text>
            </g>

            {/* the filter unit on the garage wall, and its manifold */}
            <g className="fp-machine">
              <rect x={UNIT.x} y={UNIT.y} width={UNIT.w} height={UNIT.h} rx={2} />
              {[0, 1, 2].map((i) => (
                <rect key={i} className="fp-vessel" x={UNIT.x + 8 + i * 14} y={UNIT.y + 7} width={10} height={22} rx={1.5} />
              ))}
              <text x={UNIT.x + UNIT.w / 2} y={UNIT.y - 10} className="fp-tag" textAnchor="middle">
                NGW-01
              </text>
              {/* the tee where the two runs part */}
              <circle cx={346} cy={208} r={3.5} className="fp-tee" />
            </g>

            {/* branches, drawn under the runs so the water reads as on top */}
            {FIXTURES.map((f, i) => (
              <g
                key={f.label}
                className={`fp-fix${served[i] ? " is-served" : ""}`}
                tabIndex={0}
                role="img"
                aria-label={`${f.label}: ${f.note.toLowerCase()}`}
              >
                <path className="fp-branch" d={`M${f.bx} ${f.by} L${f.fx} ${f.fy}`} />
                <Symbol f={f} />
                <text className="fp-fixlabel" x={f.lx} y={f.ly} textAnchor={f.anchor ?? "start"}>
                  {f.label}
                </text>
                {/* the balloon: phones drop the labels, so the fitting is
                    numbered here and named in the list below, drawing-fashion */}
                <g className="fp-balloon">
                  <circle cx={f.fx + 36} cy={f.fy - 36} r={20} />
                  <text x={f.fx + 36} y={f.fy - 27} textAnchor="middle">
                    {i + 1}
                  </text>
                </g>
                {/* the drafted note, on hover or focus */}
                <g className="fp-tip">
                  <rect x={f.nx} y={f.ny} width={f.note.length * 7.4 + 18} height={20} rx={1.5} />
                  <text x={f.nx + 9} y={f.ny + 13.5}>{f.note}</text>
                </g>
              </g>
            ))}

            {/* the runs: a dark bed each, with the water advancing along both */}
            <path ref={runA} className="fp-trunk" d={RUN_A} />
            <path ref={runB} className="fp-trunk" d={RUN_B} />
            <path ref={waterA} className="fp-water" d={RUN_A} />
            <path ref={waterB} className="fp-water" d={RUN_B} />

            {/* legend */}
            <g className="fp-legend" transform="translate(596 572)">
              <rect x="0" y="-14" width="296" height="46" className="fp-legend-box" />
              <line x1="10" y1="0" x2="34" y2="0" className="fp-legend-run" />
              <text x="42" y="3.5" className="fp-furn">
                COLD WATER SERVICE
              </text>
              <line x1="10" y1="18" x2="34" y2="18" className="fp-legend-water" />
              <text x="42" y="21.5" className="fp-furn">
                FILTERED · FITTING SERVED
              </text>
              <rect x="212" y="-6" width="14" height="9" className="fp-legend-unit" />
              <text x="232" y="3.5" className="fp-furn">
                NGW-01
              </text>
            </g>
          </svg>
        </div>
        {/* scroll room for the sticky plan above: the water advances across
            this distance while the house itself stays put */}
        <div className="fp-runway" aria-hidden="true" />
        </div>

        {/* THE MOBILE VERSION OF THE LABELS. Below 900px the plan fits the
            screen and drops its own labels (they render at ~8px there); the
            names live here and light on the same served state. */}
        <ol className="fp-list" aria-hidden="true">
          {FIXTURES.map((f, i) => (
            <li key={f.label} className={served[i] ? "is-served" : undefined}>
              <i data-n={i + 1} />
              <span>
                {f.label}
                <small>{f.note.toLowerCase()}</small>
              </span>
            </li>
          ))}
        </ol>

        <p className="fp-foot">
          <span className="fp-count">
            {count} of {FIXTURES.length}
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
