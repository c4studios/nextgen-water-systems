"use client";

/**
 * THE JOURNEY: the machine, opened up, on the scroll.
 *
 * One WebGL scene sits fixed behind the page (stage-fixed). The hero borrows
 * it while its anchor is on screen; this pinned section owns it while it is
 * on screen; in between the canvas is hidden and its frame loop paused. The
 * pin is 1050svh on desktop and 620svh on phones, which play a shorter cut of
 * the same timeline (journeyMap.ts).
 *
 * Every frame: the scroll position becomes the journey scalar p, the scene
 * reads p (MachineStage.tsx moves the camera, lifts the cover, cuts the
 * sections open, runs the water, sets the bowls down), and the copy beats and
 * the rail are windowed on the same p here.
 */
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollToY } from "@/lib/providers/SmoothScroll";
import { HERO } from "@/components/blueprint/heroState";
import { JOURNEY_ID, journeyEndY, journeyProgress, journeyY } from "@/components/blueprint/journeyMap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { RAIL_STOPS, STAGE_LABEL, STORY_BEATS, stageAt } from "@/content/journeyStory";
import { WaterTextDefs } from "@/components/ui/WaterText";

const MachineStage = dynamic(() => import("@/components/machine/MachineStage"), { ssr: false });

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** ?ngjp=<p> freezes the journey at one scalar for captures */
let DBG_JP: number | null = null;

export function Journey() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const fixedRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const u3d = useRef(0);
  const [webgl, setWebgl] = useState(false);
  const [glReady, setGlReady] = useState(false);
  const glReadyRef = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const stageN = useRef<HTMLSpanElement>(null);
  const stageT = useRef<HTMLSpanElement>(null);
  const stageRail = useRef<HTMLElement>(null);
  const lastStage = useRef("");
  const railRef = useRef<HTMLElement>(null);
  const railOn = useRef("");
  const dipRef = useRef(1);
  const activeRef = useRef(true);
  const [active, setActive] = useState(true);
  const [warm, setWarm] = useState(false);

  useEffect(() => {
    setWebgl(!reduced && hasWebGL());
  }, [reduced]);

  const handleReady = useCallback(() => setGlReady(true), []);

  /* A WebGL context can be lost at any time. preventDefault asks the browser
     to restore it; if nothing comes back within four seconds the page hands
     over to the path built for devices with no WebGL: the hero's still and
     the static story. */
  useEffect(() => {
    if (!webgl || !glReady) return;
    const canvas = canvasWrapRef.current?.querySelector("canvas");
    if (!canvas) return;
    let dead: number | undefined;
    const onLost = (e: Event) => {
      e.preventDefault();
      dead = window.setTimeout(() => {
        delete document.documentElement.dataset.nggl;
        setWebgl(false);
      }, 4000);
    };
    const onRestored = () => {
      if (dead) window.clearTimeout(dead);
      dead = undefined;
    };
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    return () => {
      if (dead) window.clearTimeout(dead);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
    };
  }, [webgl, glReady]);

  useEffect(() => {
    glReadyRef.current = glReady;
    if (glReady) document.documentElement.dataset.nggl = "1";
  }, [glReady]);

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("ngjp");
    const v = raw === null ? NaN : parseFloat(raw);
    if (!Number.isNaN(v)) {
      DBG_JP = Math.min(1, Math.max(0, v));
      u3d.current = DBG_JP;
    }
    return () => {
      DBG_JP = null;
    };
  }, []);

  // the scroll scalar, the beats and the rail
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    const beats = Array.from(root.querySelectorAll<HTMLElement>(".jbeat"));
    const ctx = gsap.context(() => {
      const applyFrame = (p: number) => {
        u3d.current = p;
        // the stage marker: from the reveal to the hand-off
        if (stageRef.current) {
          const on = p >= 0.19 && p < 0.985;
          stageRef.current.style.opacity = on ? "1" : "0";
          const id = stageAt(p);
          if (railRef.current) {
            railRef.current.classList.toggle("is-on", on);
            if (id !== railOn.current) {
              railOn.current = id;
              for (const b of railRef.current.querySelectorAll<HTMLButtonElement>("button[data-id]")) {
                b.classList.toggle("is-on", b.dataset.id === id);
              }
            }
          }
          if (on && id !== lastStage.current && STAGE_LABEL[id]) {
            lastStage.current = id;
            if (stageN.current) stageN.current.textContent = STAGE_LABEL[id][0];
            if (stageT.current) stageT.current.textContent = STAGE_LABEL[id][1];
          }
          if (stageRail.current) {
            const f = gsap.utils.clamp(0, 1, (p - 0.19) / (0.985 - 0.19));
            stageRail.current.style.transform = "scaleX(" + f.toFixed(4) + ")";
          }
        }
        // the copy beats: each windowed on p, its parts arriving one after
        // another, the heading forming out of water first
        for (const el of beats) {
          const a = parseFloat(el.dataset.a || "0");
          const b2 = parseFloat(el.dataset.b || "1");
          const f = parseFloat(el.dataset.f || "0.03");
          const io = gsap.utils.clamp(0, 1, Math.min((p - a) / f, (b2 - p) / f));
          const fW = Math.min(f * 2.8, (Math.min(b2, 1) - a) * 0.4);
          const ioW = gsap.utils.clamp(0, 1, Math.min((p - a) / fW, (b2 - p) / fW));
          el.style.visibility = io <= 0.001 ? "hidden" : "visible";
          el.style.setProperty("--io", io.toFixed(3));
          const parts = el.querySelectorAll<HTMLElement>("[data-stagger]");
          const paced = !!el.querySelector("[data-water]");
          const gate = paced ? gsap.utils.clamp(0, 1, (ioW - 0.65) / 0.2) : 1;
          for (const part of parts) {
            const d = Number(part.dataset.stagger || 0) * 0.16;
            const water = part.querySelector<HTMLElement>("[data-water]");
            const kio = gsap.utils.clamp(0, 1, ((water ? ioW : io) - d) / (1 - d)) * (water ? 1 : gate);
            if (water) {
              part.style.opacity = "1";
              part.style.transform = "";
              const g = Math.max(kio, 0.0001);
              const la = water.querySelector<HTMLElement>(".wt-layer");
              const lb = water.querySelector<HTMLElement>(".wt-layer--b");
              if (la) {
                la.style.filter = `blur(${Math.min(9 / g - 9, 42)}px)`;
                la.style.opacity = String(Math.pow(g, 0.42));
              }
              if (lb) {
                const gb = Math.max(Math.min(kio * 1.18, 1), 0.0001);
                lb.style.filter = `blur(${Math.min(11 / gb - 11, 48)}px)`;
                lb.style.opacity = String(Math.pow(gb, 0.6) * 0.55);
              }
              continue;
            }
            part.style.opacity = String(kio);
            part.style.transform = `translateY(${(1 - kio) * 13}px)`;
          }
        }
      };
      const st = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const j = journeyProgress(self.progress);
          dipRef.current = j.dip;
          applyFrame(DBG_JP ?? j.p);
        },
      });
      applyFrame(DBG_JP ?? journeyProgress(st.progress).p);
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  // ONE loop decides who owns the scene each frame: the hero while its anchor
  // is on screen and the journey is not; the journey while it is; nobody in
  // between, and the canvas hides and the frame loop pauses
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !webgl) return;
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const vh = window.innerHeight;
      const pr = root.getBoundingClientRect();
      const near = pr.top < vh && pr.bottom > 0;
      const heroOwns = HERO.visible && !near;
      HERO.mixT = heroOwns ? 1 : 0;
      const wrap = canvasWrapRef.current;
      if (wrap) {
        const op = heroOwns ? (glReadyRef.current ? 1 : 0) : near ? dipRef.current : 0;
        wrap.style.opacity = op.toFixed(3);
      }
      const act = HERO.visible || near;
      if (act !== activeRef.current) {
        activeRef.current = act;
        setActive(act);
      }
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [webgl]);

  // keep rendering for a moment after load so the shaders and the post chain
  // compile while the visitor is still reading the top of the page
  useEffect(() => {
    if (!webgl) return;
    const t = window.setTimeout(() => setWarm(true), 2200);
    return () => window.clearTimeout(t);
  }, [webgl]);

  return (
    <>
      <div className="stage-fixed" ref={fixedRef} aria-hidden="true">
        {webgl && (
          <div className="plate-canvas" ref={canvasWrapRef}>
            <MachineStage progress={u3d} active={active || !warm} onReady={handleReady} />
          </div>
        )}
      </div>
      <section ref={rootRef} className="journey" id={JOURNEY_ID} aria-label="The system, opened up">
        <div className="journey-stick">
          <WaterTextDefs />
          {/* where you are: a marker under the nav */}
          <div className="jstage" ref={stageRef} aria-live="polite" aria-atomic="true">
            <span className="jstage-rail" aria-hidden="true">
              <i ref={stageRail} />
            </span>
            <span className="jstage-n" ref={stageN} />
            <span className="jstage-t" ref={stageT} />
          </div>
          {/* the rail: every stop, and a way past the whole section */}
          <nav className="jrail" ref={railRef} aria-label="Stops in the journey">
            {RAIL_STOPS.map((st) => (
              <button
                key={st.id}
                type="button"
                data-id={st.id}
                data-mobile-hide={st.mobileHide ? "" : undefined}
                onClick={() => scrollToY(journeyY(st.p))}
              >
                {st.label}
                <i aria-hidden="true" />
              </button>
            ))}
            <button type="button" className="jskip" onClick={() => scrollToY(journeyEndY())}>
              <span className="jskip-l">
                Skip<span> the section</span>
              </span>
              <i aria-hidden="true" />
            </button>
          </nav>
          {/* the copy beats */}
          <div className="jhud">
            {STORY_BEATS.map((bt) => (
              <div key={bt.id} className={`jbeat ${bt.pos}`} data-id={bt.id} data-a={bt.a} data-b={bt.b} data-f={bt.f}>
                <h2 className="jb-h" data-stagger="0">
                  <span className="wt" data-water>
                    <span className="wt-stage" aria-hidden="true">
                      <span className="wt-layer">{bt.h}</span>
                      <span className="wt-layer wt-layer--b">{bt.h}</span>
                    </span>
                    <span className="sr-only">{bt.h}</span>
                  </span>
                </h2>
                <p className="jb-p" data-stagger="2">
                  {bt.body}
                  {bt.more && <span className="jb-more"> {bt.more}</span>}
                </p>
                {bt.stat && (
                  <span className="jb-stat" data-stagger="3">
                    {bt.stat}
                  </span>
                )}
                {bt.cue && (
                  <a className="jb-cue" href="#book" data-stagger="3">
                    {bt.cue}
                    <i aria-hidden="true" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
