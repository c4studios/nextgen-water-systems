"use client";

import { useCallback, useRef } from "react";
import { journeyY } from "@/components/blueprint/journeyMap";
import { scrollToY } from "@/lib/providers/SmoothScroll";
import { useCoverOpened, useDragHint, useHeroAnchor, useHeroDrag } from "./heroes/useHeroMachine";
import { HeroProof } from "./heroes/HeroProof";
import { HeroPoster } from "./heroes/HeroPoster";

/**
 * THE HERO.
 *
 * The product, at the scale a launch page gives it: the closed Next Gen cover
 * fills the right half of the first viewport, live, and the outcome line and
 * the one action sit beside it. The machine anchor is a box this section
 * lays out; the page's one WebGL scene fits the cover into that box every
 * frame while it is on screen (MachineStage.tsx reads HERO). Drag turns it;
 * a tap lifts the cover the way it really comes off.
 *
 * The still image is the poster until the scene is live, and the whole
 * picture for anyone without WebGL.
 */
export function Opening() {
  const stageRef = useRef<HTMLDivElement>(null);
  const coverOpen = useCoverOpened();
  const [hintOn, setHintOn] = useDragHint();
  const hideHint = useCallback(() => setHintOn(false), [setHintOn]);
  useHeroAnchor(stageRef);
  useHeroDrag(stageRef, hideHint);

  const goSection = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToY(journeyY(0.02));
  };

  return (
    <section className="hero" aria-labelledby="hero-h">
      <div className="hero-copy">
        <h1 id="hero-h" className="hero-h">
          Water that tastes
          <br />
          of nothing.
        </h1>
        <p className="hero-p">
          Perth scheme water arrives safe. It also arrives tasting of chlorine, and it leaves scale
          on the kettle and the shower screen. One system at the mains puts the water for every tap in
          the house through three filter stages.
        </p>
        <div className="hero-act">
          <a className="lm hero-cta" href="#book">
            <span>Book a free water test</span>
          </a>
          <a className="hero-more" href="#journey" onClick={goSection} data-own-scroll>
            See inside it
            <i aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="hero-stage" ref={stageRef} aria-hidden="true">
        <HeroPoster />
        <span className={`hero-drag${hintOn ? " is-on" : ""}`}>
          <i aria-hidden="true" />
          Drag to turn · {coverOpen ? "tap a housing" : "tap to open"}
        </span>
      </div>

      <HeroProof />
    </section>
  );
}
