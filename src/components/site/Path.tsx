"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";

/**
 * FROM A FREE TEST TO FILTERED WATER.
 *
 * The buying path, as the four things that actually happen: the test, a quote
 * for this house, the install at the mains, and the cartridge changes after.
 * A line runs under the four photographs and fills as the section scrolls, and
 * each step lights as the line reaches it, so the order reads as an order.
 *
 * Every step describes what is done and by whom, from the installation page's
 * own account. The price is not on the page because it depends on the house.
 */
const STEPS = [
  {
    t: "Book the free test",
    b: "A licensed plumber tests your own supply at your kitchen tap and tells you what is in it. It costs nothing, and nothing follows unless you ask.",
    img: "/photos/water-test.jpg",
    alt: "A water test kit on a kitchen benchtop beside a glass of tap water",
  },
  {
    t: "Get a quote for your house",
    b: "The price depends on where the water comes in and where the system can go, so the quote comes after the test and is for your house.",
    // a placeholder until Aaron says which real photographs may be published
    // (brain gap 96): the step wants a quote being worked out at a house
    img: "/photos/kitchen-tap.jpg",
    alt: "A kitchen tap running into a glass on a benchtop",
  },
  {
    t: "Installed at the mains",
    b: "Licensed plumbers mount the system where the water enters the house and fit an isolation valve either side.",
    img: "/photos/fitting.jpg",
    alt: "A plumber's hands tightening a brass fitting on a copper pipe",
  },
  {
    t: "Looked after",
    b: "The manufacturer recommends new cartridges every 12 months. Aqua-Safe schedules the change: the bowls unscrew, the old cartridges lift out and new ones drop in.",
    img: "/photos/cartridges.jpg",
    alt: "Three filter cartridges laid out in order on a benchtop",
  },
];

export function Path() {
  const rootRef = useRef<HTMLElement>(null);
  const [fill, setFill] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFill(1);
      return;
    }
    let raf = 0;
    const frame = () => {
      raf = 0;
      const r = root.getBoundingClientRect();
      const vh = window.innerHeight;
      // the line starts as the steps come up the screen and is full a little
      // before they leave the middle of it
      const t = (vh * 0.85 - r.top - r.height * 0.25) / (r.height * 0.55);
      const v = Math.min(1, Math.max(0, t));
      setFill((prev) => (Math.abs(prev - v) < 0.004 ? prev : v));
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
    <section className="pa" id="how-it-works" ref={rootRef} aria-labelledby="pa-h">
      <div className="pa-inner">
        <header className="pa-head">
          <h2 className="pa-h" id="pa-h">
            From a free test
            <br />
            to filtered water.
          </h2>
          <p className="pa-lead">
            Four steps, and the first one costs nothing. You decide after the test, with your own water in
            front of you.
          </p>
        </header>

        <ol className="pa-steps">
          {STEPS.map((s, i) => {
            const lit = fill >= (i + 0.35) / STEPS.length;
            // the stretch of line from this step's dot to the next one
            const seg = Math.min(1, Math.max(0, fill * STEPS.length - (i + 0.35)));
            return (
              <li key={s.t} className={`pa-step${lit ? " is-lit" : ""}`}>
                <figure className="pa-fig">
                  <img src={asset(s.img)} alt={s.alt} width={1600} height={1073} loading="lazy" decoding="async" />
                </figure>
                <div className="pa-mark" aria-hidden="true">
                  <span className="pa-dot">{i + 1}</span>
                  {i < STEPS.length - 1 && (
                    <span className="pa-seg">
                      <i style={{ transform: `scaleX(${seg.toFixed(3)})` }} />
                    </span>
                  )}
                </div>
                <h3 className="pa-t">
                  <span className="sr-only">Step {i + 1}: </span>
                  {s.t}
                </h3>
                <p className="pa-b">{s.b}</p>
              </li>
            );
          })}
        </ol>

        <div className="pa-act">
          <a className="lm pa-cta" href="#book">
            <span>Book a free water test</span>
          </a>
          <a className="pa-quote" href="#quote">
            Or ask for a quote
            <i aria-hidden="true" />
          </a>
          <p className="pa-note">Photographs on this page are visualisations, not Next Gen jobs.</p>
        </div>
      </div>
    </section>
  );
}
