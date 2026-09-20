"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HERO } from "@/components/blueprint/heroState";
import { journeyY } from "@/components/blueprint/journeyMap";
import { scrollToY } from "@/lib/providers/SmoothScroll";
import { VESSEL_BEAT_P } from "@/content/journeyStory";
import { HeroProof } from "./HeroProof";
import { lightHousing, useHeroAnchor, useHeroDrag } from "./useHeroMachine";
import { HeroPoster } from "./HeroPoster";

/**
 * HERO OPTION: THE MACHINE, OPEN.
 *
 * The product demonstration. The cover comes off by itself a moment after
 * the page opens, and each of the three housings carries a label pinned to it
 * (the scene reports where each housing sits on screen every frame: HERO.slots
 * in heroState.ts). Tap a label, or its row on a phone, and that housing is
 * cut open in section with its water running, while the copy column says what
 * its cartridge does in the datasheet's terms and offers the walkthrough of
 * that stage further down. The first screen shows what is being sold before
 * it asks for anything.
 */
type Stage = { n: number; name: string; media: string; job: string };

const STAGES: Stage[] = [
  { n: 1, name: "Sediment", media: "3-layer fibre, to 1 micron", job: "Sand, rust and silt stop here, before the finer stages." },
  { n: 2, name: "Taste and smell", media: "KDF 55 and 85, coconut carbon", job: "Copper-zinc granules change chlorine on contact, and the carbon behind them holds what is left." },
  { n: 3, name: "Scale", media: "Limescale reduction, carbon, to 1 micron", job: "Limescale-reduction media works on how the minerals behave. The hardness stays in the water." },
];

/** how long after the scene is live the cover lifts by itself */
const AUTO_OPEN_MS = 1400;

export function HeroOpen() {
  const stageRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const noop = useCallback(() => {}, []);
  useHeroAnchor(stageRef);
  useHeroDrag(stageRef, noop);
  const [lit, setLit] = useState<number | null>(null);

  // the cover lifts itself once the live scene is up (the still has no cover to lift)
  useEffect(() => {
    let t = 0;
    const tryOpen = () => {
      if (document.documentElement.dataset.nggl === "1") {
        t = window.setTimeout(() => lightHousing(null, true), AUTO_OPEN_MS);
        return true;
      }
      return false;
    };
    if (tryOpen()) return () => window.clearTimeout(t);
    const mo = new MutationObserver(() => {
      if (tryOpen()) mo.disconnect();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-nggl"] });
    return () => {
      mo.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  // the labels ride on the housings: positions come from the scene every frame
  useEffect(() => {
    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const show = HERO.open > 0.85 && HERO.mix > 0.9;
      HERO.slots.forEach((s, k) => {
        const el = tagRefs.current[k];
        if (!el) return;
        const on = show && s.on;
        el.style.opacity = on ? "1" : "0";
        el.style.pointerEvents = on ? "auto" : "none";
        if (on) el.style.transform = `translate3d(${(s.x * vw).toFixed(1)}px, ${(s.y * vh).toFixed(1)}px, 0)`;
      });
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  const choose = (k: number) => {
    const next = lit === k ? null : k;
    setLit(next);
    lightHousing(next, true);
  };
  const shown = lit === null ? null : STAGES[lit];

  const goStage = (k: number) => scrollToY(journeyY(VESSEL_BEAT_P[k]));
  const goSection = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToY(journeyY(0.02));
  };

  return (
    <section className="hero hero--open" aria-labelledby="hero-h">
      <div className="hero-copy">
        <h1 id="hero-h" className="hero-h">
          See what&rsquo;s under
          <br />
          the cover.
        </h1>
        <p className="hero-p">
          Three cartridges at the mains, one job each, and every tap in the house runs through them. Tap a
          stage to open its housing.
        </p>
        <div className="open-list" role="group" aria-label="The three stages">
          {STAGES.map((st, k) => (
            <button key={st.n} type="button" className={`open-row${lit === k ? " is-on" : ""}`} aria-pressed={lit === k} onClick={() => choose(k)}>
              <i aria-hidden="true">{st.n}</i>
              <span>
                <b>{st.name}</b>
                {st.media}
              </span>
            </button>
          ))}
        </div>
        <p className="open-job" aria-live="polite">
          {shown ? (
            <>
              {shown.job}{" "}
              <button type="button" className="open-go" onClick={() => goStage(shown.n - 1)}>
                Watch stage {shown.n} work
                <i aria-hidden="true" />
              </button>
            </>
          ) : (
            <span className="open-idle">Pick a stage to open its housing.</span>
          )}
        </p>
        <div className="hero-act">
          <a className="lm hero-cta" href="#book">
            <span>Book a free water test</span>
          </a>
          <a className="hero-more" href="#journey" onClick={goSection} data-own-scroll>
            The full walkthrough
            <i aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="hero-stage" ref={stageRef} aria-hidden="true">
        <HeroPoster />
      </div>

      {/* a numbered mark on each bowl, pinned to it by the scene (pointer
          screens; a phone uses the rows) */}
      <div className="open-tags" aria-hidden="true">
        {STAGES.map((st, k) => (
          <button
            key={st.n}
            type="button"
            tabIndex={-1}
            ref={(el) => {
              tagRefs.current[k] = el;
            }}
            className={`open-tag${lit === k ? " is-on" : ""}`}
            onClick={() => choose(k)}
          >
            {st.n}
          </button>
        ))}
      </div>

      <HeroProof />
    </section>
  );
}
