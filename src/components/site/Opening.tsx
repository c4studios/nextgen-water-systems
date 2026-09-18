"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import { INSTALLER } from "@/lib/jsonld";
import { HERO, HERO_OPEN_EVENT } from "@/components/blueprint/heroState";
import { journeyY } from "@/components/blueprint/journeyMap";
import { scrollToY } from "@/lib/providers/SmoothScroll";

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
const LAST_HINT_KEY = "ngw:hero-drag-hint";

export function Opening() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [hintOn, setHintOn] = useState(false);
  const [coverOpen, setCoverOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setCoverOpen(true);
    window.addEventListener(HERO_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(HERO_OPEN_EVENT, onOpen);
  }, []);

  // the machine anchor: the scene fits the cover to this box every frame
  useEffect(() => {
    HERO.mixT = 1;
    const el = stageRef.current;
    let raf = 0;
    const measure = () => {
      raf = 0;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      HERO.visible = r.bottom > 0 && r.top < vh;
      HERO.cx = (r.left + r.width / 2) / vw;
      HERO.cy = (r.top + r.height / 2) / vh;
      HERO.ch = r.height / vh;
      HERO.cw = r.width / vw;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const ro = new ResizeObserver(schedule);
    if (el) ro.observe(el);
    return () => {
      HERO.visible = false;
      HERO.mixT = 0;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // drag to turn, on the window: the canvas is behind the page, and a drag is
  // a drag only once the pointer has moved, so a tap stays a tap
  useEffect(() => {
    let down = false;
    let lastX = 0;
    let moved = 0;
    const overMachine = (e: PointerEvent) => {
      const el = stageRef.current;
      if (!el || !HERO.visible) return false;
      const r = el.getBoundingClientRect();
      return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    };
    const onDown = (e: PointerEvent) => {
      HERO.dragged = false;
      if (e.button !== 0 || !overMachine(e)) return;
      down = true;
      moved = 0;
      lastX = e.clientX;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      moved += Math.abs(dx);
      if (moved > 4) {
        HERO.dragging = true;
        HERO.dragged = true;
        HERO.yawT += dx * 0.0075;
        HERO.yawT = Math.max(-1.1, Math.min(1.1, HERO.yawT));
        try {
          sessionStorage.setItem(LAST_HINT_KEY, "1");
        } catch {
          /* private mode */
        }
        setHintOn(false);
      }
    };
    const onUp = () => {
      down = false;
      HERO.dragging = false;
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  // the hint shows once per session, once the live machine is up
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(LAST_HINT_KEY) === "1";
    } catch {
      /* private mode */
    }
    if (seen) return;
    const t = window.setTimeout(() => setHintOn(true), 2600);
    return () => window.clearTimeout(t);
  }, []);

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
          <a className="hero-more" href="#journey" onClick={goSection}>
            See inside it
            <i aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="hero-stage" ref={stageRef} aria-hidden="true">
        <img
          className="hero-still"
          src={asset("/photos/cover-still.jpg")}
          alt=""
          width={1200}
          height={1400}
          draggable={false}
          decoding="async"
          fetchPriority="high"
        />
        <span className={`hero-drag${hintOn ? " is-on" : ""}`}>
          <i aria-hidden="true" />
          Drag to turn · {coverOpen ? "tap a housing" : "tap to open"}
        </span>
      </div>

      <ul className="hero-proof" aria-label="Who fits it">
        <li>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14.5 5.5a4 4 0 0 0-5.3 5.3L3.5 16.5 7.5 20.5l5.7-5.7a4 4 0 0 0 5.3-5.3l-2.6 2.6-2.8-.6-.6-2.8Z" />
          </svg>
          <span>
            Fitted by{" "}
            <a className="installer-link" href={INSTALLER.url} target="_blank" rel="noopener">
              {INSTALLER.name}
            </a>
          </span>
        </li>
        <li>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3.5 14.2 5l2.6-.2.9 2.5 2.2 1.4-.7 2.5.7 2.5-2.2 1.4-.9 2.5-2.6-.2L12 18.9l-2.2-1.5-2.6.2-.9-2.5-2.2-1.4.7-2.5-.7-2.5 2.2-1.4.9-2.5 2.6.2Z" />
            <path d="m9 11.4 2 2 4-4" />
          </svg>
          <span>Licensed plumbers and gas fitters, PL10802 · GF22810</span>
        </li>
        <li>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3.5 19 6v5.5c0 4.3-3 7.6-7 9-4-1.4-7-4.7-7-9V6Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span>12-month workmanship warranty</span>
        </li>
        <li>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
            <circle cx="12" cy="10" r="2.3" />
          </svg>
          <span>Perth metro</span>
        </li>
      </ul>
    </section>
  );
}
