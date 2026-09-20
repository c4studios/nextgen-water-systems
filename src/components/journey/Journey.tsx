"use client";

/**
 * THE JOURNEY: the machine, opened up, on the scroll.
 *
 * One WebGL scene sits fixed behind the page (stage-fixed). The hero borrows
 * it while its anchor is on screen; this pinned section owns it while it is
 * on screen; in between the canvas is hidden and its frame loop paused. The
 * pin is 1050svh on desktop and 620svh on phones. Both play the one timeline,
 * each at its own pace (journeyMap.ts).
 *
 * Every scroll update: the scroll position becomes the journey scalar p, the
 * scene reads p (MachineStage.tsx moves the camera, lifts the cover, cuts the
 * sections open, runs the water, sets the bowls down), and the rail and the
 * copy beats follow the same p here.
 *
 * THE BEATS ARE TIMED, NOT SCRUBBED (19 Sep 2026). The machine is scrubbed:
 * the scroll is its timeline, and a half-open housing is a fine thing to stop
 * on. Copy is not. Scrubbed copy left half-risen words and ghosted cards on
 * screen wherever the scroll happened to rest (7 of 29 stops on a phone, by
 * the design review's count). So a beat is either in or out: crossing into its
 * window sets a class, and the entrance (each word rising out of its own line,
 * then the body) and the exit (one quick fade) run on the clock in CSS.
 *
 * THE RAIL. A ten-screen pin has to say where you are in it. The rail is one
 * line along the foot of the frame, left to right the way the water goes
 * through the machine, filling as the visitor scrolls: a stop for every beat,
 * a numbered disc for each of the three stages, the name of the current stop,
 * and a way past the whole section. Every stop is a jump. It is one tab stop
 * for a keyboard (the arrow keys move along it), then the skip. On a phone the
 * caption card carries Back and Next as well, because a flick is a poor way to
 * move one beat.
 *
 * THE VISITOR'S OWN WATER. What they picked on the first screen, or ticked
 * under the kettle, points at a stage (content/yourWater.ts). That stage's
 * disc is marked as theirs, its beat says so in their own words, and the beat
 * before the stages offers to go straight to it.
 */
import dynamic from "next/dynamic";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollToY } from "@/lib/providers/SmoothScroll";
import { HERO, JOURNEY_HOVER, STAGE_RIDE } from "@/components/blueprint/heroState";
import { JOURNEY_ID, PHONE_CUT, isMobileCut, journeyEndY, journeyProgress, journeyY, unmapWide } from "@/components/blueprint/journeyMap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { RAIL_STOPS, STORY_BEATS, type RailStop } from "@/content/journeyStory";
import { CALLOUTS } from "@/content/callouts";
import { EMPTY_TOLD, TOLD_EVENTS, readTold, toldLine, toldStages, type Told } from "@/content/yourWater";

const MachineStage = dynamic(() => import("@/components/machine/MachineStage"), { ssr: false });

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/* THE HANDOVER FROM THE POSTER. The poster is cut from this same scene at
   each layout (heroes/HeroPoster.tsx), so the live frame appears under it at
   full strength and the poster fades off the top of the same picture
   (sections.css). The page is told the scene is up only once it has drawn
   settled frames (MachineStage Ready). */

/** ?ngjp=<p> freezes the journey at one scalar for captures */
let DBG_JP: number | null = null;

/** a scene that has not come up in this long is not coming: the page hands
 *  over to the static story rather than pin ten screens of empty set */
const SCENE_PATIENCE_MS = 25000;
/** the phone's cut: the picture goes to its ground, the film jumps, it returns */
const CUT_OUT_MS = 140;
const CUT_IN_MS = 240;

/* THE RAIL'S GEOMETRY. On a wide screen a stop stands where its beat starts in
   the SCROLL, so the line is honest about how far there is to go and its fill
   is simply how far the section has been scrolled. A phone hides the two beats
   its cut skips and spaces the rest evenly (they have to be far enough apart
   to hit with a thumb), so there the fill runs from stop to stop. Both are
   fractions of the line's length. */
const PHONE_STOPS = RAIL_STOPS.filter((s) => !s.mobileHide);
const railX = (st: RailStop, phone: boolean) => {
  if (!phone) return unmapWide(st.p);
  const k = PHONE_STOPS.indexOf(st);
  return k < 0 ? 0 : k / (PHONE_STOPS.length - 1);
};
function railFill(p: number, m: number, phone: boolean): number {
  if (!phone) return m;
  const st = PHONE_STOPS;
  if (p <= st[0].pPhone) return 0;
  for (let i = 0; i < st.length - 1; i++) {
    if (p < st[i + 1].pPhone) return (i + (p - st[i].pPhone) / (st[i + 1].pPhone - st[i].pPhone)) / (st.length - 1);
  }
  return 1;
}
/** the stop the visitor is at: the last one reached */
function railIndex(p: number, phone: boolean): number {
  const st = phone ? PHONE_STOPS : RAIL_STOPS;
  let at = 0;
  for (let i = 0; i < st.length; i++) if (p >= (phone ? st[i].pPhone : st[i].p)) at = i;
  return RAIL_STOPS.indexOf(st[at]);
}
/** the stops either side of a beat on a phone, for its card's Back and Next */
function phoneNeighbours(id: string): { prev: RailStop | null; next: RailStop | null } {
  const k = PHONE_STOPS.findIndex((s) => s.id === id);
  if (k < 0) return { prev: null, next: null };
  return { prev: PHONE_STOPS[k - 1] ?? null, next: PHONE_STOPS[k + 1] ?? null };
}

export function Journey() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const fixedRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  /** what the scene reads */
  const u3d = useRef(0);
  /** what the scroll says */
  const pScroll = useRef(0);
  const [webgl, setWebgl] = useState(false);
  const [glReady, setGlReady] = useState(false);
  const glReadyRef = useRef(false);
  const railRef = useRef<HTMLElement>(null);
  const railAt = useRef(-1);
  const railHover = useRef(-1);
  const nowKey = useRef<HTMLSpanElement>(null);
  const nowTitle = useRef<HTMLSpanElement>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);
  const [told, setTold] = useState<Told>(EMPTY_TOLD);
  /** the phone's cut, as a timed dissolve: when it started and what to hold */
  const cut = useRef({ side: -1, t0: -1e9, hold: 0 });
  const calloutRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(true);
  const [active, setActive] = useState(true);
  const [warm, setWarm] = useState(false);

  /** no scene: the pinned section steps out and the static story stands in
   *  (world.css, html[data-ngstatic]) */
  const goStatic = useCallback(() => {
    delete document.documentElement.dataset.nggl;
    document.documentElement.dataset.ngstatic = "1";
    setWebgl(false);
    ScrollTrigger.refresh();
  }, []);

  useEffect(() => {
    if (reduced) {
      setWebgl(false);
      return;
    }
    if (hasWebGL()) setWebgl(true);
    else goStatic();
  }, [reduced, goStatic]);

  const handleReady = useCallback(() => setGlReady(true), []);

  // a scene that never comes up (a driver that stalls, a context that cannot
  // be made) must not leave ten screens of empty set pinned
  useEffect(() => {
    if (!webgl || glReady) return;
    const t = window.setTimeout(goStatic, SCENE_PATIENCE_MS);
    return () => window.clearTimeout(t);
  }, [webgl, glReady, goStatic]);

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
      dead = window.setTimeout(goStatic, 4000);
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
  }, [webgl, glReady, goStatic]);

  useEffect(() => {
    glReadyRef.current = glReady;
    if (glReady) document.documentElement.dataset.nggl = "1";
  }, [glReady]);

  // what the visitor has said about their own water, kept current
  useEffect(() => {
    const read = () => setTold(readTold());
    read();
    for (const ev of TOLD_EVENTS) window.addEventListener(ev, read);
    return () => {
      for (const ev of TOLD_EVENTS) window.removeEventListener(ev, read);
    };
  }, []);

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("ngjp");
    const v = raw === null ? NaN : parseFloat(raw);
    if (!Number.isNaN(v)) {
      DBG_JP = Math.min(1, Math.max(0, v));
      pScroll.current = DBG_JP;
      u3d.current = DBG_JP;
    }
    return () => {
      DBG_JP = null;
    };
  }, []);

  // the scroll scalar, the rail and the beats
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    const beats = Array.from(root.querySelectorAll<HTMLElement>(".jbeat")).map((el) => ({
      el,
      id: el.dataset.id || "",
      a: parseFloat(el.dataset.a || "0"),
      b: parseFloat(el.dataset.b || "1"),
      // the phone cut's own window, where it differs (journeyStory Beat.aPhone)
      ap: parseFloat(el.dataset.ap || el.dataset.a || "0"),
      bp: parseFloat(el.dataset.bp || el.dataset.b || "1"),
      on: false,
    }));
    let announce = 0;
    const ctx = gsap.context(() => {
      const applyFrame = (p: number, m: number) => {
        pScroll.current = p;
        const phone = isMobileCut();
        // the phone's cut: crossing it starts the dissolve, and the scene holds
        // the side it came from until the picture is down (the loop below)
        if (phone && DBG_JP === null) {
          const side = m < PHONE_CUT.m ? 0 : 1;
          if (cut.current.side >= 0 && side !== cut.current.side) {
            cut.current.t0 = performance.now();
            cut.current.hold = side === 1 ? PHONE_CUT.before : PHONE_CUT.after;
          }
          cut.current.side = side;
        } else {
          cut.current.side = -1;
        }
        // the rail: how far along the line, which stop, and its name
        const rail = railRef.current;
        if (rail) {
          rail.style.setProperty("--fill", railFill(p, m, phone).toFixed(4));
          const at = railIndex(p, phone);
          if (at !== railAt.current) {
            railAt.current = at;
            rail.querySelectorAll<HTMLButtonElement>("button[data-id]").forEach((b, k) => {
              b.classList.toggle("is-on", k === at);
              b.classList.toggle("is-past", k < at);
              // one tab stop for the whole line: the stop you are at
              b.tabIndex = k === at ? 0 : -1;
              if (k === at) b.setAttribute("aria-current", "step");
              else b.removeAttribute("aria-current");
            });
            const st = RAIL_STOPS[at];
            if (nowKey.current) nowKey.current.textContent = st.key;
            if (nowTitle.current) nowTitle.current.textContent = st.title;
          }
        }
        // the copy beats: in or out, never part-way (the CSS runs the rest). A
        // beat that starts before the section does is simply in from the start.
        for (const bt of beats) {
          const on = phone ? p >= bt.ap && p <= bt.bp : p >= bt.a && p <= bt.b;
          if (on === bt.on) continue;
          bt.on = on;
          bt.el.classList.toggle("is-in", on);
          if (!on) continue;
          // say the new stop to a screen reader once the scroll has settled on it
          window.clearTimeout(announce);
          announce = window.setTimeout(() => {
            const st = RAIL_STOPS.find((s) => s.id === bt.id);
            const h = bt.el.querySelector(".jb-h")?.getAttribute("aria-label") || "";
            if (liveRef.current) liveRef.current.textContent = st ? `${st.key}. ${h}` : h;
          }, 600);
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
          applyFrame(DBG_JP ?? j.p, j.m);
        },
      });
      // The rail belongs to the pinned frame: it comes up once the section has
      // pinned (on a phone it would otherwise ride up the screen ahead of the
      // machine) and leaves with the frame at the far end. Its own trigger
      // starts two pixels early: a jump to the first stop lands exactly on the
      // pin's start, where the pin itself does not yet count as active, and the
      // rail went missing on the one stop it had just been used to reach.
      // ALWAYS A BOOLEAN. A trigger made before ScrollTrigger's first refresh
      // reports isActive as undefined, and classList.toggle(name, undefined) is
      // a plain toggle: it switched the rail ON at load, and with the trigger
      // never changing state nothing switched it off again. On a phone the
      // rail then rode up the screen inside the entering set (verdict pass,
      // 19 Sep 2026). onRefresh sets it again once the first measure is in.
      const showRail = (self: ScrollTrigger) => {
        railRef.current?.classList.toggle("is-on", DBG_JP !== null || self.isActive === true);
      };
      const vis = ScrollTrigger.create({
        trigger: root,
        start: "top top+=2",
        end: "bottom top",
        onToggle: showRail,
        onRefresh: showRail,
      });
      showRail(vis);
      const j0 = journeyProgress(st.progress);
      applyFrame(DBG_JP ?? j0.p, j0.m);
      // where the section's top edge meets the top of the screen, for the
      // scene's entrance (heroState STAGE_RIDE); kept current on every refresh
      const measure = () => {
        STAGE_RIDE.start = st.start;
      };
      measure();
      ScrollTrigger.addEventListener("refresh", measure);
      return () => ScrollTrigger.removeEventListener("refresh", measure);
    }, root);
    return () => {
      window.clearTimeout(announce);
      ctx.revert();
      STAGE_RIDE.start = NaN;
    };
  }, [reduced]);

  /* THE PIN IS MEASURED AGAIN WHEN THE PAGE ABOVE IT GROWS. ScrollTrigger
     caches where the section starts. An answer opening in the hero adds about
     a hundred pixels above the journey on a phone, the pin's start went stale
     by that much, and every jump along the rail landed long: the "The system"
     stop came to rest just past its own beat, with no caption card and so no
     Back or Next (finish review, 19 Sep 2026). journeyY() reads the live
     layout, so the two disagreed. One observer on the body's height, settled
     for a moment so an opening answer refreshes once and not per frame. */
  useEffect(() => {
    if (reduced || typeof ResizeObserver === "undefined") return;
    let t = 0;
    let last = document.body.offsetHeight;
    const ro = new ResizeObserver(() => {
      const h = document.body.offsetHeight;
      if (Math.abs(h - last) < 2) return;
      last = h;
      window.clearTimeout(t);
      t = window.setTimeout(() => ScrollTrigger.refresh(), 220);
    });
    ro.observe(document.body);
    return () => {
      window.clearTimeout(t);
      ro.disconnect();
    };
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
      // the phone's cut, on the clock: down, jump, up
      const dt = performance.now() - cut.current.t0;
      let dip = 1;
      if (dt < CUT_OUT_MS) {
        dip = 1 - dt / CUT_OUT_MS;
        u3d.current = cut.current.hold;
      } else {
        if (dt < CUT_OUT_MS + CUT_IN_MS) dip = (dt - CUT_OUT_MS) / CUT_IN_MS;
        u3d.current = pScroll.current;
      }
      const wrap = canvasWrapRef.current;
      if (wrap) {
        // nothing shows until the scene has drawn (it compiles first, and an
        // undrawn canvas is black): the hero keeps its poster, the journey its ground
        const drawn = glReadyRef.current;
        const op = heroOwns ? (drawn ? 1 : 0) : near && drawn ? dip : 0;
        wrap.style.opacity = op.toFixed(3);
      }
      // the fixed layer's own ground: the page's white under the hero (it is
      // the hero's background until the scene is up), the studio's grey only
      // under the journey, where the cut shows it
      const fixed = fixedRef.current;
      if (fixed) {
        const journeyOwns = !heroOwns && near;
        if (fixed.classList.contains("is-journey") !== journeyOwns) fixed.classList.toggle("is-journey", journeyOwns);
      }
      // a housing under the pointer is a way to its stage: its disc on the rail
      // answers, so the two read as one control
      const hov = heroOwns ? -1 : JOURNEY_HOVER.k;
      if (hov !== railHover.current) {
        railHover.current = hov;
        railRef.current?.querySelectorAll<HTMLElement>(".jline-stop--n").forEach((b, k) => b.classList.toggle("is-hover", k === hov));
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

  /* the line is one tab stop: the arrow keys move along its stops */
  const onRailKey = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    const stops = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>("button[data-id]")).filter((b) => b.offsetParent !== null);
    const i = stops.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0) return;
    e.preventDefault();
    const fwd = e.key === "ArrowRight" || e.key === "ArrowDown";
    const next = e.key === "Home" ? 0 : e.key === "End" ? stops.length - 1 : Math.min(stops.length - 1, Math.max(0, i + (fwd ? 1 : -1)));
    stops[next].focus();
  }, []);
  const goStop = (st: RailStop) => scrollToY(journeyY(st.park));
  const mine = toldStages(told);

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
              <div key={c.id} className={`jc jc--${c.side}`} data-callout={c.id} style={{ "--d": c.d ?? 0 } as React.CSSProperties}>
                <i className="jc-dot" />
                <i className="jc-line" />
                <span className="jc-tag">{c.text}</span>
              </div>
            ))}
          </div>
          {/* the rail: the pass through the machine, every stop on it a jump */}
          <nav className="jline" ref={railRef} aria-label="Where you are in this section">
            <p className="jline-now" aria-hidden="true">
              <span className="jline-k" ref={nowKey}>
                {RAIL_STOPS[0].key}
              </span>
              <span className="jline-t" ref={nowTitle}>
                {RAIL_STOPS[0].title}
              </span>
            </p>
            <div className="jline-track" role="toolbar" aria-label="Go to a stop" aria-orientation="horizontal" onKeyDown={onRailKey}>
              <i className="jline-fill" aria-hidden="true" />
              {RAIL_STOPS.map((st, k) => {
                const theirs = st.n !== null && told[st.n].length > 0;
                return (
                  <button
                    key={st.id}
                    type="button"
                    className={`jline-stop${st.n ? " jline-stop--n" : ""}`}
                    data-id={st.id}
                    data-mobile-hide={st.mobileHide ? "" : undefined}
                    data-mine={theirs ? "" : undefined}
                    tabIndex={k === 0 ? 0 : -1}
                    aria-label={`${st.key}: ${st.title}${theirs ? ". The one for what you mentioned" : ""}`}
                    style={{ "--at": railX(st, false), "--eq": railX(st, true) } as React.CSSProperties}
                    onClick={() => goStop(st)}
                  >
                    <i aria-hidden="true">{st.n ?? ""}</i>
                    <span className="jline-tip" aria-hidden="true">
                      {st.key} <b>{st.title}</b>
                      {theirs && <em>Yours</em>}
                    </span>
                  </button>
                );
              })}
            </div>
            <button type="button" className="jline-skip" onClick={() => scrollToY(journeyEndY())}>
              <span className="jline-skip-l">
                Skip<span> the section</span>
              </span>
              <i aria-hidden="true" />
            </button>
          </nav>
          {/* the stop, said once the scroll settles on it */}
          <p className="jsr" aria-live="polite" ref={liveRef} />
          {/* the copy beats */}
          <div className="jhud">
            {STORY_BEATS.map((bt) => {
              const { prev, next } = phoneNeighbours(bt.id);
              const lines = bt.h.split("\n");
              let k = 0;
              return (
                <div key={bt.id} className={`jbeat ${bt.pos}`} data-id={bt.id} data-a={bt.a} data-b={bt.b} data-ap={bt.aPhone ?? bt.a} data-bp={bt.bPhone ?? bt.b}>
                  {/* one word per mask, so each rises out of its own line; a
                      screen reader gets the sentence, not the pieces */}
                  <h2 className="jb-h" aria-label={bt.h.replace(/\n/g, " ")}>
                    {lines.map((line, li) => (
                      <Fragment key={li}>
                        {li > 0 && <br aria-hidden="true" />}
                        {line.split(" ").map((word, wi, all) => (
                          <span key={wi} aria-hidden="true">
                            <span className="jw">
                              <span className="jwi" style={{ "--k": k++ } as React.CSSProperties}>
                                {word}
                              </span>
                            </span>
                            {wi < all.length - 1 ? " " : ""}
                          </span>
                        ))}
                      </Fragment>
                    ))}
                  </h2>
                  <p className="jb-p jb-part" style={{ "--s": 0 } as React.CSSProperties}>
                    {bt.body}
                    {bt.more && <span className="jb-more"> {bt.more}</span>}
                  </p>
                  {bt.stat && (
                    <span className="jb-stat jb-part" style={{ "--s": 1 } as React.CSSProperties}>
                      {bt.stat}
                    </span>
                  )}
                  {/* the visitor's own words, on the stage that is there for them */}
                  {bt.stage && told[bt.stage].length > 0 && (
                    <p className="jb-you jb-part" style={{ "--s": 2 } as React.CSSProperties}>
                      <i aria-hidden="true" />
                      {toldLine(told[bt.stage])}
                    </p>
                  )}
                  {/* before the stages: straight to theirs, if they have said */}
                  {bt.id === "problem" && mine.length > 0 && (
                    <button
                      type="button"
                      className="jb-cue jb-jump jb-part"
                      style={{ "--s": 1 } as React.CSSProperties}
                      onClick={() => {
                        const st = RAIL_STOPS.find((s) => s.n === mine[0]);
                        if (st) goStop(st);
                      }}
                    >
                      {mine.length > 1 ? `Yours are stages ${mine.join(" and ")}. Go to stage ${mine[0]}` : `Yours is stage ${mine[0]}. Go straight to it`}
                      <i aria-hidden="true" />
                    </button>
                  )}
                  {bt.cue && (
                    <a className={`jb-cue jb-part${bt.cuePill ? " jb-cue--pill" : ""}`} style={{ "--s": 1 } as React.CSSProperties} href="#book">
                      {bt.cuePill ?? bt.cue}
                      {!bt.cuePill && <i aria-hidden="true" />}
                    </a>
                  )}
                  {/* a phone moves one beat at a time from its card */}
                  {(prev || next) && (
                    <div className="jb-nav jb-part" style={{ "--s": 2 } as React.CSSProperties}>
                      {prev ? (
                        <button type="button" className="jb-back" onClick={() => goStop(prev)}>
                          <i aria-hidden="true" />
                          Back
                        </button>
                      ) : (
                        <span />
                      )}
                      {next && (
                        <button type="button" className="jb-next" onClick={() => goStop(next)}>
                          {next.n ? `Next: stage ${next.n}` : `Next: ${next.key.toLowerCase()}`}
                          <i aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
