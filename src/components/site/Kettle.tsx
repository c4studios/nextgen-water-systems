"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import { SIGNS, SIGNS_KEY, STAGE_JOB, type Sign } from "@/content/signs";

/**
 * THE KETTLE: the problem, pointed at, then the rest of the house.
 *
 * The one place on the page that is a real kitchen rather than the machine. A
 * scaled kettle with three numbered marks on it, each leading to a short note:
 * where the minerals built up, the clean steel above the water line, and the
 * furred element. The argument is the one the site rests on: there is nothing
 * wrong with the kettle, it is what is in the water.
 *
 * It no longer holds the scroll. The page used to stick the photograph under
 * the nav and make the visitor scroll through a runway to draw the notes in,
 * which read as the page stopping. Now the notes draw themselves in, one after
 * another, once the photograph is on screen, and the scroll never waits. A
 * hover or a tap on a mark (or its note) still brings that one forward. On a
 * phone the leaders drop away and the notes become a list under the picture.
 *
 * Under the photograph, the same water everywhere else: a short checklist of
 * signs around the house, each naming the stage that is there for it, and the
 * test to book. What is ticked rides into the booking form.
 *
 * It also does a structural job. It stands opaque, at least a screen tall,
 * between the hero and the journey, so the machine in the hero's box and the
 * machine in the journey's set are never on screen together.
 */

const IMG_W = 1600;
const IMG_H = 1073;
/** a note's width and the height its leader meets, in the photograph's own pixels */
const NOTE_W = 352;
const NOTE_JOIN = 46;
/** seconds between one note drawing in and the next */
const STEP_S = 0.55;

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

/** "Spots on the shower screen and cloudy glasses from the dishwasher" */
function sentence(signs: Sign[]): string {
  const words = signs.map((s) => s.plain);
  const list = words.length > 1 ? `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}` : words[0];
  return list.charAt(0).toUpperCase() + list.slice(1);
}

export function Kettle() {
  const figRef = useRef<HTMLElement>(null);
  // 0 not yet seen, 1 drawing in (each part on its own delay), 2 settled: the
  // delays come off once it has drawn, or a hover would wait for them
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const drawn = phase > 0;
  const drawing = phase === 1;
  const [held, setHeld] = useState<string | null>(null);
  const [picked, setPicked] = useState<string[]>([]);

  // the notes draw in once, when most of the photograph is on screen
  useEffect(() => {
    const fig = figRef.current;
    if (!fig) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      setPhase(2);
      return;
    }
    let settle = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPhase(1);
          settle = window.setTimeout(() => setPhase(2), (0.35 + MARKS.length * STEP_S + 0.6) * 1000);
          io.disconnect();
        }
      },
      { threshold: 0.45 },
    );
    io.observe(fig);
    return () => {
      io.disconnect();
      window.clearTimeout(settle);
    };
  }, []);

  const toggle = useCallback(
    (id: string) => {
      const on = picked.includes(id);
      const next = on ? picked.filter((p) => p !== id) : [...picked, id];
      setPicked(next);
      const plain = SIGNS.filter((s) => next.includes(s.id))
        .map((s) => s.plain)
        .join(", ");
      try {
        if (plain) sessionStorage.setItem(SIGNS_KEY, plain);
        else sessionStorage.removeItem(SIGNS_KEY);
        window.dispatchEvent(new CustomEvent(SIGNS_KEY, { detail: plain }));
      } catch {
        /* private mode: the list still works, the hand-over just doesn't */
      }
    },
    [picked],
  );

  const focus = (id: string | null) => setHeld(id);
  // every ticked sign's stage, the signs that share one stage together
  const groups = ([1, 2, 3] as const)
    .map((stage) => ({ stage, signs: SIGNS.filter((s) => s.stage === stage && picked.includes(s.id)) }))
    .filter((g) => g.signs.length > 0);

  return (
    <section className="kt" id="your-water" aria-labelledby="kt-h">
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
          <figure ref={figRef} className={`kt-fig${held ? " has-held" : ""}${drawn ? " is-drawn" : ""}`}>
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
                const len = leaderLength(m);
                return (
                  <line
                    key={m.id}
                    className={`kt-line${held && held !== m.id ? " is-dim" : ""}`}
                    style={{
                      strokeDasharray: len,
                      strokeDashoffset: drawn ? 0 : len,
                      transitionDelay: drawing ? `${0.1 + i * STEP_S}s, 0s` : undefined,
                    }}
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
                className={`kt-mark${drawn ? " is-on" : ""}${held === m.id ? " is-held" : ""}`}
                style={{ left: pct(m.at[0], IMG_W), top: pct(m.at[1], IMG_H), transitionDelay: drawing ? `${i * STEP_S}s, ${i * STEP_S}s, 0s, 0s` : undefined }}
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
                className={`kt-note${drawn ? " is-on" : ""}${held && held !== m.id ? " is-dim" : ""}${held === m.id ? " is-held" : ""}`}
                style={{
                  left: pct(m.label[0], IMG_W),
                  top: pct(m.label[1], IMG_H),
                  width: pct(NOTE_W, IMG_W),
                  transitionDelay: drawing ? `${0.35 + i * STEP_S}s` : undefined,
                }}
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
          <p className="kt-cap">A visualisation.</p>

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

        {/* the rest of the house: tick what you have seen, see which stage is
            there for it, and take it to the booking */}
        <div className="kt-signs">
          <div className="kt-signs-head">
            <h3 className="kt-signs-h" id="kt-signs-h">
              The same water runs to every tap.
            </h3>
            <p className="kt-signs-p">
              Tick anything you&rsquo;ve noticed at home. It goes with your booking, so the plumber knows what to
              look at.
            </p>
          </div>
          <div className="kt-signs-body">
            <div className="kt-chips" role="group" aria-labelledby="kt-signs-h">
              {SIGNS.map((s) => {
                const on = picked.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    className={`oc-chip${on ? " is-on" : ""}`}
                    aria-pressed={on}
                    onClick={() => toggle(s.id)}
                  >
                    <i aria-hidden="true" />
                    {s.label}
                  </button>
                );
              })}
            </div>
            <div className="kt-answer" aria-live="polite">
              {groups.length ? (
                groups.map((g) => (
                  <p key={g.stage}>
                    {sentence(g.signs)} {g.signs.length > 1 || g.signs[0].plural ? "are" : "is"} <b>Stage {g.stage}</b>&rsquo;s job: {STAGE_JOB[g.stage]}
                    {g.signs.map((s) => (s.aside ? ` ${s.aside}` : "")).join("")}
                  </p>
                ))
              ) : (
                <p className="kt-idle">Tick one to see which of the three stages is there for it.</p>
              )}
            </div>
            <div className="kt-act">
              <a className="lm kt-cta" href="#book">
                <span>{picked.length > 1 ? "Book a free test for these" : picked.length ? "Book a free test for this" : "Book a free water test"}</span>
              </a>
              <a className="kt-more" href="#stages">
                See the three stages
                <i aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
