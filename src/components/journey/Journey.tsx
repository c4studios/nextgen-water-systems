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
import { RAIL_STOPS, STORY_BEATS, stageAt } from "@/content/journeyStory";
import { CALLOUTS } from "@/content/callouts";

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
  const railRef = useRef<HTMLElement>(null);
  const railOn = useRef("");
  const dipRef = useRef(1);
  const calloutRef = useRef<HTMLDivElement>(null);
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
        // the rail: where you are, from the reveal to the hand-off
        if (railRef.current) {
          const on = p >= 0.19 && p < 0.985;
          railRef.current.classList.toggle("is-on", on);
          const id = stageAt(p);
          if (id !== railOn.current) {
            railOn.current = id;
            for (const b of railRef.current.querySelectorAll<HTMLButtonElement>("button[data-id]")) {
              const here = b.dataset.id === id;
              b.classList.toggle("is-on", here);
              if (here) b.setAttribute("aria-current", "step");
              else b.removeAttribute("aria-current");
            }
          }
        }
        // the copy beats: each windowed on p. The heading rises into place a
        // word at a time from behind its own line and the body follows once it
        // has landed. On the way out the heading leaves as one line, lifting and
        // fading whole, so a pause mid-exit never shows letters sliced by the mask
        for (const el of beats) {
          const a = parseFloat(el.dataset.a || "0");
          const b2 = parseFloat(el.dataset.b || "1");
          const f = parseFloat(el.dataset.f || "0.03");
          const len = Math.min(b2, 1) - a;
          const io = gsap.utils.clamp(0, 1, Math.min((p - a) / f, (b2 - p) / f));
          el.style.visibility = io <= 0.001 ? "hidden" : "visible";
          el.style.setProperty("--io", io.toFixed(3));
          const tIn = gsap.utils.clamp(0, 1, (p - a) / Math.max(0.0001, Math.min(f * 2.4, len * 0.32)));
          const tOut = gsap.utils.clamp(0, 1, (b2 - p) / Math.max(0.0001, Math.min(f * 1.5, len * 0.16)));
          const words = el.querySelectorAll<HTMLElement>(".jwi");
          const n = words.length;
          const leaving = tOut < 1 && p > (a + b2) / 2;
          const head = el.querySelector<HTMLElement>(".jb-h");
          if (leaving) {
            // the whole line lifts and fades together; the words sit at home
            const e = 1 - Math.pow(1 - tOut, 2);
            words.forEach((w) => {
              w.style.transform = "translate3d(0, 0, 0)";
              w.style.opacity = "1";
            });
            if (head) {
              head.style.transform = `translate3d(0, ${(-(1 - e) * 22).toFixed(1)}px, 0)`;
              head.style.opacity = e.toFixed(3);
            }
          } else {
            if (head) {
              head.style.transform = "";
              head.style.opacity = "";
            }
            words.forEach((w, k) => {
              const at = n > 1 ? k / (n - 1) : 0;
              const kin = gsap.utils.clamp(0, 1, (tIn - at * 0.5) / 0.5);
              const e = 1 - Math.pow(1 - kin, 3);
              w.style.transform = `translate3d(0, ${((1 - e) * 105).toFixed(1)}%, 0)`;
              w.style.opacity = e >= 0.999 ? "1" : String(Math.min(1, e * 1.25));
            });
          }
          const gate = gsap.utils.clamp(0, 1, (tIn - 0.55) / 0.35);
          for (const part of el.querySelectorAll<HTMLElement>("[data-stagger]")) {
            if (part.hasAttribute("data-words")) continue;
            if (leaving) {
              // the body and the chip leave with the heading, a beat ahead of it
              const e = 1 - Math.pow(1 - gsap.utils.clamp(0, 1, tOut * 1.15 - 0.15), 2);
              part.style.opacity = e.toFixed(3);
              part.style.transform = `translate3d(0, ${(-(1 - e) * 16).toFixed(1)}px, 0)`;
              continue;
            }
            const d = Number(part.dataset.stagger || 0) * 0.12;
            const kio = gsap.utils.clamp(0, 1, (io - d) / (1 - d)) * gate;
            const e = 1 - Math.pow(1 - kio, 3);
            part.style.opacity = String(e);
            part.style.transform = `translate3d(0, ${((1 - e) * 14).toFixed(1)}px, 0)`;
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
      // An opaque section (the kettle) stands between the hero and the journey,
      // so the two never share the screen. The pose therefore SNAPS to its
      // owner rather than easing: the machine is never seen travelling from
      // the hero's box to the journey's set, least of all across the title.
      const heroOwns = HERO.visible && !near;
      HERO.mixT = heroOwns ? 1 : 0;
      if (!heroOwns) HERO.mix = 0;
      else if (!near) HERO.mix = 1;
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
            <MachineStage progress={u3d} active={active || !warm} onReady={handleReady} callouts={calloutRef} />
          </div>
        )}
      </div>
      <section ref={rootRef} className="journey" id={JOURNEY_ID} aria-label="The system, opened up">
        <div className="journey-stick">
          {/* the callouts: tags the scene pins to parts of the machine */}
          <div className="jcall" ref={calloutRef} aria-hidden="true">
            {CALLOUTS.map((c) => (
              <div key={c.id} className={`jc jc--${c.side}`} data-callout={c.id}>
                <i className="jc-dot" />
                <i className="jc-line" />
                <span className="jc-tag">{c.text}</span>
              </div>
            ))}
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
                <h2 className="jb-h" data-stagger="0" data-words>
                  {bt.h.split(" ").map((word, k, all) => (
                    <span key={k}>
                      <span className="jw">
                        <span className="jwi">{word}</span>
                      </span>
                      {k < all.length - 1 ? " " : ""}
                    </span>
                  ))}
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
