"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";

/**
 * THE KETTLE: the problem, pointed at.
 *
 * The one place on the page that is a real kitchen rather than the machine. A
 * scaled kettle with three numbered marks on it, each leading to a short note:
 * where the minerals built up, the clean steel above the water line, and the
 * furred element. The argument is the one the site rests on: there is nothing
 * wrong with the kettle, it is what is in the water.
 *
 * The photograph holds still while the notes draw in one at a time; a hover
 * or a tap on a mark (or its note) brings that one forward. On a phone the
 * leaders drop away and the notes become a list under the picture.
 *
 * It also does a structural job. It stands opaque between the hero and the
 * journey, so the machine in the hero's box and the machine in the journey's
 * set are never on screen together, and the scene can change hands unseen.
 */

const IMG_W = 1600;
const IMG_H = 1073;
/** a note's width and the height its leader meets, in the photograph's own pixels */
const NOTE_W = 352;
const NOTE_JOIN = 46;

type Mark = {
  id: string;
  n: string;
  /** the thing being pointed at */
  at: [number, number];
  /** the note's top-left corner */
  label: [number, number];
  /** which side of the note the leader leaves from */
  side: "left" | "right";
  title: string;
  body: string;
};

/* The notes sit over the quiet parts of the photograph (the windowsill, the
   benchtop, the chopping board), never over the kettle. */
const MARKS: Mark[] = [
  {
    id: "tide",
    n: "1",
    at: [604, 436],
    label: [26, 104],
    side: "right",
    title: "The tide mark",
    body: "Every boil takes the water and leaves the minerals behind. They build up along the line the water sits at.",
  },
  {
    id: "clean",
    n: "2",
    at: [952, 244],
    label: [1178, 58],
    side: "left",
    title: "Above the line",
    body: "Still clean steel. The scale sits only where the water did.",
  },
  {
    id: "element",
    n: "3",
    at: [836, 652],
    label: [1178, 792],
    side: "left",
    title: "The element",
    body: "Furred over. It still boils. It just has to push the heat through that first.",
  },
];

const pct = (v: number, total: number) => `${(v / total) * 100}%`;
const join = (m: Mark): [number, number] => [m.side === "right" ? m.label[0] + NOTE_W : m.label[0], m.label[1] + NOTE_JOIN];
/* measured from the coordinates, never from the element: on a phone the
   drawing is display:none and asking a hidden line for its length throws */
const leaderLength = (m: Mark) => {
  const [jx, jy] = join(m);
  return Math.hypot(m.at[0] - jx, m.at[1] - jy);
};

export function Kettle() {
  const rootRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const runwayRef = useRef<HTMLDivElement>(null);
  const leaderRefs = useRef<Array<SVGLineElement | null>>([]);
  const [step, setStep] = useState(-1);
  const [held, setHeld] = useState<string | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const plate = plateRef.current;
    const runway = runwayRef.current;
    if (!root || !plate) return;
    const leaders = leaderRefs.current;
    const seed = () =>
      leaders.forEach((l, i) => {
        if (!l) return;
        const len = leaderLength(MARKS[i]);
        l.style.strokeDasharray = String(len);
        l.style.strokeDashoffset = String(len);
      });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(MARKS.length);
      leaders.forEach((l) => l && (l.style.strokeDashoffset = "0"));
      return;
    }

    let raf = 0;
    const frame = () => {
      raf = 0;
      const vh = window.innerHeight;
      let t: number;
      // a stuck element's own rect stops moving, so progress is read from the
      // runway under it, which never sticks
      if (getComputedStyle(plate).position === "sticky" && runway) {
        const stickyTop = parseFloat(getComputedStyle(plate).top) || 0;
        const h = plate.getBoundingClientRect().height;
        const start = runway.getBoundingClientRect().top + window.scrollY - h - stickyTop;
        t = Math.min(1, Math.max(0, (window.scrollY - start + vh * 0.35) / Math.max(1, runway.offsetHeight + vh * 0.35)));
      } else {
        const b = plate.getBoundingClientRect();
        t = Math.min(1, Math.max(0, (vh * 0.85 - b.top) / (b.height * 0.9)));
      }
      const per = 0.8 / MARKS.length;
      let active = -1;
      leaders.forEach((l, i) => {
        if (!l) return;
        const local = Math.min(1, Math.max(0, (t - 0.04 - i * per) / (per * 0.55)));
        l.style.strokeDashoffset = String(leaderLength(MARKS[i]) * (1 - local));
        if (local > 0.6) active = i;
      });
      setStep((prev) => (prev === active ? prev : active));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    seed();
    frame();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const shown = (i: number) => i <= step;
  const focus = (id: string | null) => setHeld(id);

  return (
    <section className="kt" id="your-water" ref={rootRef} aria-labelledby="kt-h">
      <div className="kt-inner">
        <header className="kt-head">
          <h2 id="kt-h" className="kt-h">
            The kettle tells you
            <br />
            what is in the water.
          </h2>
          <p className="kt-lead">
            It is the thing people put up with for years without ever deciding to. Look at where the water
            sat, and then at the steel above it.
          </p>
        </header>

        <div className="kt-stage">
          <div className="kt-plate" ref={plateRef}>
            <figure className={`kt-fig${held ? " has-held" : ""}`}>
              <img
                className="kt-img"
                src={asset("/photos/kettle-scale.jpg")}
                alt="Looking down into an open stainless kettle. A crusted ring of white limescale marks the water line and the element below it is furred over, while the steel above the line is still clean."
                width={IMG_W}
                height={IMG_H}
                loading="lazy"
                decoding="async"
              />
              <svg className="kt-svg" viewBox={`0 0 ${IMG_W} ${IMG_H}`} preserveAspectRatio="none" aria-hidden="true">
                {MARKS.map((m, i) => {
                  const [jx, jy] = join(m);
                  return (
                    <line
                      key={m.id}
                      ref={(el) => {
                        leaderRefs.current[i] = el;
                      }}
                      className={`kt-line${held && held !== m.id ? " is-dim" : ""}`}
                      x1={jx}
                      y1={jy}
                      x2={m.at[0]}
                      y2={m.at[1]}
                    />
                  );
                })}
              </svg>
              {MARKS.map((m, i) => (
                <button
                  key={m.id}
                  type="button"
                  className={`kt-mark${shown(i) ? " is-on" : ""}${held === m.id ? " is-held" : ""}`}
                  style={{ left: pct(m.at[0], IMG_W), top: pct(m.at[1], IMG_H) }}
                  aria-label={`${m.n}. ${m.title}: ${m.body}`}
                  onMouseEnter={() => focus(m.id)}
                  onMouseLeave={() => focus(null)}
                  onFocus={() => focus(m.id)}
                  onBlur={() => focus(null)}
                  onClick={() => focus(held === m.id ? null : m.id)}
                >
                  {m.n}
                </button>
              ))}
              {MARKS.map((m, i) => (
                <div
                  key={m.id}
                  className={`kt-note${shown(i) ? " is-on" : ""}${held && held !== m.id ? " is-dim" : ""}${held === m.id ? " is-held" : ""}`}
                  style={{ left: pct(m.label[0], IMG_W), top: pct(m.label[1], IMG_H), width: pct(NOTE_W, IMG_W) }}
                  onMouseEnter={() => focus(m.id)}
                  onMouseLeave={() => focus(null)}
                  aria-hidden="true"
                >
                  <b className="kt-note-t">
                    <i>{m.n}</i>
                    {m.title}
                  </b>
                  <span className="kt-note-b">{m.body}</span>
                </div>
              ))}
            </figure>
            <p className="kt-cap">Visualisation, not a photograph of a customer&rsquo;s kettle.</p>

            {/* phones: the notes as a list under the picture */}
            <ol className="kt-key">
              {MARKS.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    className={`kt-key-row${held === m.id ? " is-held" : ""}`}
                    onClick={() => focus(held === m.id ? null : m.id)}
                    aria-pressed={held === m.id}
                  >
                    <i>{m.n}</i>
                    <span>
                      <b>{m.title}</b>
                      {m.body}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
          <div className="kt-runway" ref={runwayRef} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
