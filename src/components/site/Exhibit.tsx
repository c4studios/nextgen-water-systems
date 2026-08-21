"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import { scrollToEl } from "@/lib/providers/SmoothScroll";

/**
 * EXHIBIT A — the photograph, marked up.
 *
 * This used to be a full-bleed photo of a scaled kettle with a caption under
 * it, and the client's note on it was exactly right: it sat there doing
 * nothing. It was also the point where scrolling felt like it stopped, because
 * a dead screen sits between the reader and the pinned journey, and a dead
 * screen followed by a pin reads as the page having jammed. Measured: no scroll
 * input is actually lost there, so this was never a performance bug. It was a
 * screen with nothing happening on it.
 *
 * So the photo now does the arguing. It is treated the way a building inspector
 * treats a site photograph: leader lines drawn onto the evidence, a numbered
 * key, and a note against each thing worth pointing at. The argument it makes
 * is the one the whole site rests on and had never actually stated:
 *
 *   above the water line the steel is still clean.
 *   so there is nothing wrong with the kettle.
 *   it is what is in the water.
 *
 * Coordinates are in the photograph's own pixel space (1600x1073) and both the
 * leaders and the labels are placed from it, so the annotation stays registered
 * to the image at every width. Below 860px the leaders are dropped and the key
 * becomes a plain list, because hairlines over a phone-sized photo are noise.
 *
 * The last beat hands off into the drawing rather than stopping, which is the
 * join the page was missing.
 */

const IMG_W = 1600;
const IMG_H = 1073;

type Mark = {
  id: string;
  n: string;
  /** the thing being pointed at, in image pixels */
  at: [number, number];
  /** where the note sits, in image pixels */
  label: [number, number];
  /** which side the leader leaves the note from */
  side: "left" | "right";
  title: string;
  body: string;
};

/* Label anchors sit over the quiet parts of the photograph (the windowsill,
   the benchtop, the chopping board) rather than over the kettle, so nothing
   worth looking at is covered by a note about it. */
const MARKS: Mark[] = [
  {
    id: "tide",
    n: "01",
    at: [604, 436],
    label: [26, 104],
    side: "right",
    title: "The tide mark",
    body: "Every boil takes the water and leaves the minerals behind. They build up along the line the water sits at.",
  },
  {
    id: "clean",
    n: "02",
    at: [952, 244],
    label: [1178, 58],
    side: "left",
    title: "Above the line",
    body: "Still clean steel. There is nothing wrong with this kettle. The difference is the water it was filled with.",
  },
  {
    id: "element",
    n: "03",
    at: [836, 652],
    label: [1178, 792],
    side: "left",
    title: "The element",
    body: "Furred over. It still boils. It just has to push the heat through that first.",
  },
];

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

export function Exhibit() {
  const rootRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const runwayRef = useRef<HTMLDivElement>(null);
  const leaderRefs = useRef<Array<SVGPathElement | null>>([]);
  const [step, setStep] = useState(-1);
  /** hover/tap focus, which is independent of how far you have scrolled */
  const [held, setHeld] = useState<string | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const plate = plateRef.current;
    const runway = runwayRef.current;
    if (!root || !plate) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setStep(MARKS.length);
      leaderRefs.current.forEach((p) => p && (p.style.strokeDashoffset = "0"));
      return;
    }

    let raf = 0;
    const frame = () => {
      raf = 0;
      const vh = window.innerHeight;
      let t: number;
      // Same measurement as the floor plan: a stuck element's own rect stops
      // moving, so progress is taken from the runway, which never sticks.
      const held0 = getComputedStyle(plate).position === "sticky";
      if (held0 && runway) {
        const stickyTop = parseFloat(getComputedStyle(plate).top) || 0;
        const h = plate.getBoundingClientRect().height;
        const runwayDocTop = runway.getBoundingClientRect().top + window.scrollY;
        const start = runwayDocTop - h - stickyTop;
        t = Math.min(1, Math.max(0, (window.scrollY - start) / Math.max(1, runway.offsetHeight)));
      } else {
        const b = root.getBoundingClientRect();
        t = Math.min(1, Math.max(0, (vh * 0.8 - b.top) / (vh * 0.9)));
      }

      // each mark gets a window; the leader draws across the first half of it
      const per = 0.84 / MARKS.length;
      let active = -1;
      leaderRefs.current.forEach((path, i) => {
        if (!path) return;
        const local = Math.min(1, Math.max(0, (t - 0.02 - i * per) / (per * 0.6)));
        const len = path.getTotalLength();
        path.style.strokeDashoffset = String(len * (1 - local));
        if (local > 0.55) active = i;
      });
      setStep((prev) => (prev === active ? prev : active));
      };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    // seed the dash lengths before the first frame so nothing flashes whole
    leaderRefs.current.forEach((p) => {
      if (!p) return;
      const len = p.getTotalLength();
      p.style.strokeDasharray = String(len);
      p.style.strokeDashoffset = String(len);
    });
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

  return (
    <section className="ex ground sheet-edge" ref={rootRef} aria-labelledby="ex-h">
      <div className="ex-inner">
        <header className="ex-head">
          <span className="ex-stamp">
            <b>EXHIBIT A</b>
            <span>SCALE · DOMESTIC SUPPLY</span>
          </span>
          <h2 className="ex-h" id="ex-h">
            The kettle tells you
            <br />
            what is in the water.
          </h2>
          <p className="ex-lead">
            This is the thing people put up with for years without ever deciding to. Look at where the
            water sat.
          </p>
        </header>

        {/* The stage bounds the sticky. Without it the plate keeps sticking
            through the rest of the section and paints straight over the
            hand-off underneath it, which is exactly what it was doing. A
            sticky element is bounded by its containing block, so the fix is to
            give it one that ends where the holding should end. */}
        <div className="ex-stage">
          <div className="ex-plate" ref={plateRef}>
            {/* The plate was a bordered photograph sitting on black, which the
                client read as a floating image. It is bound into the page now
                the way a plate is bound into a drawing set: a title strip
                across the head, registration marks at the corners, and rules
                running off both edges out to the sheet margin so the plate is
                clearly part of the document rather than dropped onto it. */}
            <div className="ex-tb">
              <span className="ex-tb-c">
                <i>SHEET</i>A
              </span>
              <span className="ex-tb-c">
                <i>SUBJECT</i>SCALE, DOMESTIC SUPPLY
              </span>
              <span className="ex-tb-c ex-tb-c--wide">
                <i>SCALE</i>NTS
              </span>
              <span className="ex-tb-c">
                <i>NOTES</i>3
              </span>
            </div>
            <figure className="ex-fig">
              <span className="ex-reg" aria-hidden="true" />
              <img
                src={asset("/photos/kettle-scale.jpg")}
                alt="Looking down into an open stainless kettle. A crusted ring of white limescale marks the water line and the element below it is furred over, while the steel above the line is still clean."
                width={IMG_W}
                height={IMG_H}
                loading="lazy"
                decoding="async"
              />

              <svg
                className="ex-svg"
                viewBox={`0 0 ${IMG_W} ${IMG_H}`}
                preserveAspectRatio="none"
                aria-hidden="true"
                focusable="false"
              >
                {MARKS.map((m, i) => {
                  // the leader leaves the note horizontally, then turns once and
                  // runs to the target, which is how a real callout is drawn
                  const [lx, ly] = m.label;
                  const [ax, ay] = m.at;
                  const startX = m.side === "right" ? lx + 250 : lx - 18;
                  const elbowX = m.side === "right" ? startX + 84 : startX - 84;
                  const d = `M ${startX} ${ly} L ${elbowX} ${ly} L ${ax} ${ay}`;
                  const on = shown(i) || held === m.id;
                  return (
                    <g key={m.id} className={`ex-leader${on ? " is-on" : ""}${held === m.id ? " is-held" : ""}`}>
                      <path
                        ref={(el) => {
                          leaderRefs.current[i] = el;
                        }}
                        className="ex-line"
                        d={d}
                      />
                      <circle className="ex-ring" cx={ax} cy={ay} r={46} />
                      <circle className="ex-dot" cx={ax} cy={ay} r={5} />
                    </g>
                  );
                })}
              </svg>

              {MARKS.map((m, i) => (
                <div
                  key={m.id}
                  className={`ex-note ex-note--${m.side}${shown(i) ? " is-on" : ""}${
                    held === m.id ? " is-held" : ""
                  }`}
                  style={{ left: pct(m.label[0], IMG_W), top: pct(m.label[1], IMG_H) }}
                  onMouseEnter={() => setHeld(m.id)}
                  onMouseLeave={() => setHeld((h) => (h === m.id ? null : h))}
                >
                  <b className="ex-n">{m.n}</b>
                  <b className="ex-note-t">{m.title}</b>
                  <span className="ex-note-b">{m.body}</span>
                </div>
              ))}

              <figcaption className="ex-cap">
                <span>ILLUSTRATION · NOT A CUSTOMER&rsquo;S KETTLE</span>
              </figcaption>
            </figure>

            {/* the same key, as a list, for narrow screens and for anyone who
                would rather read it than scrub through it */}
            <ol className="ex-key">
              {MARKS.map((m) => (
                <li
                  key={m.id}
                  className={held === m.id ? "is-held" : undefined}
                  onMouseEnter={() => setHeld(m.id)}
                  onMouseLeave={() => setHeld((h) => (h === m.id ? null : h))}
                >
                  <b>{m.n}</b>
                  <span>
                    <b>{m.title}.</b> {m.body}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="ex-runway" ref={runwayRef} aria-hidden="true" />
        </div>

        <div className={`ex-hand${step >= MARKS.length - 1 ? " is-on" : ""}`}>
          <p>
            Scale does the same thing to the shower screen, the glassware and the hot water system. It
            is not the appliances. It is the supply they all run on.
          </p>
          <button
            type="button"
            className="ex-go lm"
            onClick={() => scrollToEl(document.getElementById("drawing"), 0)}
          >
            <span>See what we put in front of it</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4v15m0 0 6-6m-6 6-6-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
