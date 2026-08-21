"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { asset } from "@/lib/asset";

/**
 * HOW IT WORKS — the still version of the journey.
 *
 * The feedback that produced this: people don't realise the scroll animation is
 * doing the explaining. They arrive expecting sections that walk them through a
 * process, so they scroll past a pinned 3D sequence without registering that it
 * WAS the process. That is not a bug in the animation, it is a mismatch of
 * expectation, and the fix is not to make the animation louder.
 *
 * So the site now says both. The journey is the experience; this is the
 * explanation, in the shape people are looking for: three numbered stages you
 * can read standing still, each with what goes in, what happens, and what comes
 * out. It sits directly under the journey and opens by naming what just
 * happened, so anyone who scrolled through without following it gets a second,
 * conventional chance.
 *
 * The stages are also clickable: picking one scrolls the journey back to that
 * vessel's beat. That is the join between the two halves — the still section
 * is an index INTO the animation rather than a replacement for it.
 */

import { VESSEL_BEAT_P } from "@/content/journeyStory";

type Stage = {
  n: string;
  name: string;
  goesIn: string;
  happens: string;
  comesOut: string;
};

/* Mechanism only. No figures, no outcomes at the appliance. Same rules as
   content/taste.ts — see the header there. */
const STAGES: Stage[] = [
  {
    n: "01",
    name: "Graded sediment",
    goesIn: "Sand, rust flakes and silt the pipes carry",
    happens:
      "One cartridge with three densities in it, coarse on the outside and fine at the core. Big particles stop at the surface, fine ones lodge deeper, so the whole cartridge works instead of blocking at the face.",
    comesOut: "Water clear enough for the finer media behind it",
  },
  {
    n: "02",
    name: "Copper-zinc and carbon",
    goesIn: "Chlorine, and dissolved metal picked up on the way",
    happens:
      "Copper-zinc granules change chlorine on contact and hold dissolved metal on their own surface. Coconut carbon behind them catches what is left. This is the stage you taste.",
    comesOut: "Water that stops tasting and smelling of the supply",
  },
  {
    n: "03",
    name: "Limescale-reduction carbon",
    goesIn: "The calcium and magnesium that make scale",
    happens:
      "The last stage changes the way those minerals crystallise, so they travel through and rinse away instead of bonding onto hot surfaces. A final one-micron polish on the way out.",
    comesOut: "Water that leaves less behind on the kettle and the screen",
  },
];

export function HowItWorks() {
  const [open, setOpen] = useState(0);
  const rootRef = useRef<HTMLElement>(null);

  // The journey is pinned above this section; jumping to a vessel means
  // scrolling back into that pin at the right fraction.
  const [plate, setPlate] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setPlate(document.getElementById("drawing"));
  }, []);

  const goToVessel = (i: number) => {
    if (!plate) return;
    const p = VESSEL_BEAT_P[i] ?? 0.5;
    const y = plate.offsetTop + (plate.offsetHeight - window.innerHeight) * p;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section className="hiw" ref={rootRef} aria-labelledby="hiw-h">
      <div className="hiw-inner">
        <header className="hiw-head">
          <h2 className="hiw-h" id="hiw-h">
            That was the machine,
            <br />
            in section.
          </h2>
          <p className="hiw-lead">
            If you would rather read it standing still, here is the same thing: three stages, in
            order, and what each one actually does. Open one and the drawing above will go back to
            it.
          </p>
        </header>

        <ol className="hiw-list">
          {STAGES.map((s, i) => {
            const on = open === i;
            return (
              <li key={s.n} className={`hiw-stage${on ? " is-open" : ""}`}>
                <button
                  type="button"
                  className="hiw-bar"
                  aria-expanded={on}
                  onClick={() => setOpen(on ? -1 : i)}
                >
                  <span className="hiw-n">{s.n}</span>
                  <span className="hiw-name">{s.name}</span>
                  <span className="hiw-in">{s.goesIn}</span>
                  <i aria-hidden="true">{on ? "–" : "+"}</i>
                </button>
                <div className="hiw-detail" hidden={!on}>
                  <p>{s.happens}</p>
                  <p className="hiw-out">
                    <b>OUT</b>
                    {s.comesOut}
                  </p>
                  <button type="button" className="hiw-jump" onClick={() => goToVessel(i)}>
                    Watch this stage in the drawing
                  </button>
                </div>
              </li>
            );
          })}
        </ol>

        <figure className="hiw-figure">
          <img
            src={asset("/photos/cartridges.jpg")}
            alt="The three filter cartridges laid out in order on a benchtop: pleated sediment, carbon, and a scale-reduction cartridge with a blue collar"
            loading="lazy"
            decoding="async"
          />
          <figcaption>
            The three cartridges, in the order the water meets them. They are consumables; how long
            a set lasts depends on your supply, which is one of the things{" "}
            <Link className="hiw-inline" href="/water-test/">
              the free test
            </Link>{" "}
            settles.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
