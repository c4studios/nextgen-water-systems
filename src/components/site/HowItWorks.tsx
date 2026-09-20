"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { asset } from "@/lib/asset";
import { VESSEL_BEAT_P } from "@/content/journeyStory";
import { journeyY } from "@/components/blueprint/journeyMap";
import { scrollToY } from "@/lib/providers/SmoothScroll";

/**
 * THE THREE STAGES, STANDING STILL.
 *
 * The journey above shows each stage open for as long as the scroll allows.
 * Here the visitor holds it: three tabs, one render of that housing cut open,
 * and what the stage is in the datasheet's own words. "Watch it open" goes
 * back up into the journey at that stage.
 *
 * Mechanism only. No figures, no outcomes at the tap (see docs/sources.md).
 */
type Stage = {
  n: string;
  name: string;
  goesIn: string;
  happens: string;
  comesOut: string;
  media: string;
  img: string;
  alt: string;
};

const STAGES: Stage[] = [
  {
    n: "Stage 1",
    name: "Graded sediment",
    goesIn: "Sand, rust flakes and silt the pipes carry",
    happens:
      "One cartridge with three layers in it, coarse on the outside and fine at the core. Big particles stop at the surface and fine ones lodge deeper, so the whole cartridge works instead of blocking at the face.",
    comesOut: "Water clear enough for the finer media behind it",
    media: "Three-layer sediment cartridge, filtration to 1 micron",
    img: "/photos/stage-1.jpg",
    alt: "The first housing cut open in section: a white three-layer sediment cartridge, with water rising up its core",
  },
  {
    n: "Stage 2",
    name: "Copper-zinc and carbon",
    goesIn: "Chlorine, and dissolved metal picked up on the way",
    happens:
      "Copper-zinc granules change chlorine on contact and hold dissolved metal on their own surface. Coconut carbon behind them adsorbs what is left. The manufacturer calls it the taste improvement cartridge.",
    comesOut: "Water off the copper-zinc and the carbon, on to the last stage",
    media: "KDF 55 and KDF 85 granules, then coconut carbon",
    img: "/photos/stage-2.jpg",
    alt: "The second housing cut open in section: a bed of copper-zinc granules around a core of black coconut carbon",
  },
  {
    n: "Stage 3",
    name: "Limescale reduction and carbon",
    goesIn: "The minerals that build scale on hot surfaces",
    happens:
      "The last cartridge carries limescale-reduction media ahead of a second bed of coconut carbon, and filters to one micron on the way out.",
    comesOut: "Water that has been through all three stages, on its way to every tap",
    media: "Limescale-reduction media and coconut carbon, to 1 micron",
    img: "/photos/stage-3.jpg",
    alt: "The third housing cut open in section: white limescale-reduction media around a core of coconut carbon",
  },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!dir && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const next = e.key === "Home" ? 0 : e.key === "End" ? STAGES.length - 1 : (active + dir + STAGES.length) % STAGES.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section className="se" id="stages" aria-labelledby="se-h">
      <div className="se-inner">
        <header className="se-head">
          <h2 className="se-h" id="se-h">
            The three stages,
            <br />
            standing still.
          </h2>
          <p className="se-lead">
            The same three stages the film above opens up, side by side. Pick one to see it in section and
            read what it does to the water on its way through.
          </p>
        </header>

        <div className="se-body">
          <div className="se-tabs" role="tablist" aria-label="The three stages" aria-orientation="vertical">
            {STAGES.map((s, i) => (
              <button
                key={s.n}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`se-tab-${i}`}
                aria-controls={`se-panel-${i}`}
                aria-selected={active === i}
                tabIndex={active === i ? 0 : -1}
                className={`se-tab${active === i ? " is-on" : ""}`}
                onClick={() => setActive(i)}
                onKeyDown={onKey}
              >
                <span className="se-name">
                  <span className="se-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="sr-only">{s.n}: </span>
                  {s.name}
                </span>
                <span className="se-in">{s.goesIn}</span>
              </button>
            ))}
          </div>

          <div className="se-view">
            <div className="se-frame">
              {STAGES.map((s, i) => (
                <img
                  key={s.img}
                  className={`se-img${active === i ? " is-on" : ""}`}
                  src={asset(s.img)}
                  alt={active === i ? s.alt : ""}
                  aria-hidden={active !== i}
                  width={1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
            {STAGES.map((s, i) => (
              <div
                key={s.n}
                role="tabpanel"
                id={`se-panel-${i}`}
                aria-labelledby={`se-tab-${i}`}
                className="se-panel"
                hidden={active !== i}
              >
                <p className="se-happens">{s.happens}</p>
                <dl className="se-facts">
                  <div>
                    <dt>In the cartridge</dt>
                    <dd>{s.media}</dd>
                  </div>
                  <div>
                    <dt>What comes out</dt>
                    <dd>{s.comesOut}</dd>
                  </div>
                  <div>
                    <dt>Cartridge change</dt>
                    <dd>Every 12 months as the manufacturer recommends, 18 months at most</dd>
                  </div>
                </dl>
                <button type="button" className="se-jump" onClick={() => scrollToY(journeyY(VESSEL_BEAT_P[i] ?? 0.5))}>
                  Watch it open in the machine
                  <i aria-hidden="true" />
                </button>
              </div>
            ))}
            <p className="se-cap">Renders of the system, in section.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
