"use client";

import { useCallback, useRef, useState } from "react";
import { journeyY } from "@/components/blueprint/journeyMap";
import { scrollToY } from "@/lib/providers/SmoothScroll";
import { SuburbCheck, type SuburbResult } from "@/components/site/SuburbCheck";
import { HeroProof } from "./HeroProof";
import { useDragHint, useHeroAnchor, useHeroDrag } from "./useHeroMachine";
import { HeroPoster } from "./HeroPoster";

/**
 * HERO OPTION: THE FREE TEST, FIRST.
 *
 * The most direct of the options. The first screen sells the one thing a
 * visitor can do today for nothing: a free test at their own tap. It asks for
 * the smallest possible commitment first (which suburb are you in?), answers
 * it against Aqua-Safe's own service list, and carries the suburb straight
 * into the booking form. Under it, the whole path in one line, so nobody has
 * to wonder what happens after the test.
 */
const STEPS = ["A free test at your tap", "A quote for your house", "Fitted at the mains", "Cartridges changed for you"];

export function HeroSuburb() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [hintOn, setHintOn] = useDragHint();
  const hideHint = useCallback(() => setHintOn(false), [setHintOn]);
  useHeroAnchor(stageRef);
  useHeroDrag(stageRef, hideHint);
  const [result, setResult] = useState<SuburbResult>(null);

  const goSection = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToY(journeyY(0.02));
  };

  return (
    <section className="hero hero--suburb" aria-labelledby="hero-h">
      <div className="hero-copy">
        <h1 id="hero-h" className="hero-h">
          A free water test,
          <br />
          at your own tap.
        </h1>
        <p className="hero-p">
          A licensed plumber tests your supply where you drink it and tells you what is in it. If a system at
          the mains is worth it for your house, you get a quote. If it isn&rsquo;t, you get told that.
        </p>

        <SuburbCheck onResult={setResult} />

        <div className="hero-act">
          <a className="lm hero-cta" href="#book">
            <span>{result?.kind === "yes" ? `Book my free test in ${result.suburb}` : "Book a free water test"}</span>
          </a>
          <a className="hero-more" href="#journey" onClick={goSection} data-own-scroll>
            See the system
            <i aria-hidden="true" />
          </a>
        </div>

        <ol className="sub-path" aria-label="What happens">
          {STEPS.map((s, i) => (
            <li key={s}>
              <i aria-hidden="true">{i + 1}</i>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="hero-stage" ref={stageRef} aria-hidden="true">
        <HeroPoster />
        <span className={`hero-drag${hintOn ? " is-on" : ""}`}>
          <i aria-hidden="true" />
          Drag to turn · tap to open
        </span>
      </div>

      <HeroProof />
    </section>
  );
}
