"use client";

import { useCallback, useRef, useState } from "react";
import { journeyY } from "@/components/blueprint/journeyMap";
import { scrollToY } from "@/lib/providers/SmoothScroll";
import { HeroProof } from "./HeroProof";
import { lightHousing, useDragHint, useHeroAnchor, useHeroDrag } from "./useHeroMachine";
import { HeroPoster } from "./HeroPoster";
import { ASK_KEY, ASKS, type Ask } from "@/content/asks";

/**
 * HERO OPTION: THE QUESTION.
 *
 * The first screen asks the visitor what their water is doing, and the
 * machine answers. Pick an answer and the cover lifts off, the housing whose
 * media is there for it is cut open in section with its water running, and
 * one line says what that stage does. The action underneath takes the answer
 * with it into the booking. A visitor who arrives not knowing whether this is
 * for them leaves the first screen knowing which part of the machine is.
 *
 * Copy rules are the checklist's (content/signs.ts, content/taste.ts): a
 * mechanism in the datasheet's terms, never an outcome or a figure, and
 * nothing that implies the water is softened.
 * The answers themselves live in content/asks.ts, because the journey reads
 * them too.
 */
export function HeroAsk() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [hintOn, setHintOn] = useDragHint(3400);
  const hideHint = useCallback(() => setHintOn(false), [setHintOn]);
  useHeroAnchor(stageRef);
  useHeroDrag(stageRef, hideHint);
  const [picked, setPicked] = useState<string | null>(null);

  const choose = (a: Ask) => {
    const next = picked === a.id ? null : a.id;
    setPicked(next);
    setHintOn(false);
    lightHousing(next ? a.stage : null, true);
    try {
      if (next) sessionStorage.setItem(ASK_KEY, a.plain);
      else sessionStorage.removeItem(ASK_KEY);
      window.dispatchEvent(new CustomEvent(ASK_KEY, { detail: next ? a.plain : "" }));
    } catch {
      /* private mode: the hand-over just doesn't happen */
    }
  };
  const shown = ASKS.find((a) => a.id === picked) ?? null;

  const goSection = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToY(journeyY(0.02));
  };

  return (
    <section className="hero hero--ask" aria-labelledby="hero-h">
      <div className="hero-copy">
        <h1 id="hero-h" className="hero-h">
          What&rsquo;s your
          <br />
          water doing?
        </h1>
        {/* the first screen has to say what this is before it asks anything
            (design review, 19 Sep 2026: the five-second test failed on "what
            is it?"); the hint on the machine says what picking does */}
        <p className="hero-p">
          Whole-house water filtration for Perth homes, fitted at the mains by licensed plumbers. Pick what
          sounds like yours.
        </p>
        <div className="ask-list" role="group" aria-labelledby="hero-h">
          {ASKS.map((a) => {
            const on = picked === a.id;
            return (
              <div key={a.id} className={`ask-row${on ? " is-on" : ""}`}>
                <button type="button" aria-expanded={on} aria-controls={`ask-a-${a.id}`} className="ask-btn" onClick={() => choose(a)}>
                  <i aria-hidden="true" />
                  <span>{a.label}</span>
                </button>
                <div className="ask-a" id={`ask-a-${a.id}`} {...({ inert: on ? undefined : "" } as Record<string, unknown>)}>
                  <div className="ask-a-in">
                    <p>{a.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="hero-act">
          <a className="lm hero-cta" href="#book">
            <span>{shown && shown.stage !== null ? "Book a free test for this" : "Book a free water test"}</span>
          </a>
          <a className="hero-more" href="#journey" onClick={goSection} data-own-scroll>
            See all three stages
            <i aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="hero-stage" ref={stageRef} aria-hidden="true">
        <HeroPoster />
        <span className={`hero-drag${hintOn && !picked ? " is-on" : ""}`}>
          <i aria-hidden="true" />
          Pick an answer, or drag to turn it
        </span>
      </div>

      <HeroProof />
    </section>
  );
}
