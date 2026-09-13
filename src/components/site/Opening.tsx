"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import { INSTALLER } from "@/lib/jsonld";
import { TASTE_OPTIONS } from "@/content/taste";
import { HERO, HERO_HOT_EVENT } from "@/components/blueprint/heroState";
import { journeyY } from "@/components/blueprint/journeyMap";
import { scrollToY } from "@/lib/providers/SmoothScroll";

/**
 * THE COVER.
 *
 * The site used to open on a headline, a dim photograph of a glass and a
 * button, with the machine four screens down. The client's note was that it
 * did not feel like a site. A cover sheet does three things in one frame: it
 * says what the thing is in the visitor's own terms, it shows the thing, and
 * it tells you who stands behind it and what to do next.
 *
 * So: the outcome line and the primary action on the left; the machine itself
 * on the right, live, the same render the journey below walks through (one
 * scene, fixed behind the page; the cover only tells it where to sit); and the
 * taste check under the headline, because the first useful question is not
 * "what is this" but "is this about my water". Tick chlorine and the second
 * vessel lights and says what it does with chlorine. The ticks ride into the
 * booking, so the technician knows before he arrives.
 *
 * Along the bottom edge, the inspector strip: the plumber, the licence
 * numbers, the warranty. No claims, no figures, nothing to substantiate.
 */

/** where the booking form picks the answer up */
export const TASTE_KEY = "ngw:taste";

const LAST_HINT_KEY = "ngw:hero-drag-hint";

export function Opening() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [latest, setLatest] = useState<string | null>(null);
  const [hintOn, setHintOn] = useState(false);

  // the machine anchor: the scene fits the machine to this box every frame
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
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      HERO.visible = false;
      HERO.mixT = 0;
    };
  }, []);

  // drag to turn. Pointer events are read at the window so the canvas
  // underneath still gets its own hover and click on the vessels; a drag is a
  // drag only once the pointer has actually moved, so a tap stays a tap.
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
      if (e.button !== 0 || !overMachine(e)) return;
      down = true;
      moved = 0;
      lastX = e.clientX;
      HERO.dragged = false;
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

  // the drag hint shows once per session, and only once the live machine is up
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

  const toggle = useCallback(
    (id: string) => {
      const on = picked.includes(id);
      const next = on ? picked.filter((p) => p !== id) : [...picked, id];
      const opt = TASTE_OPTIONS.find((o) => o.id === id)!;
      // the machine answers the latest tick; un-ticking hands back to the
      // previous one still ticked
      const show = on ? TASTE_OPTIONS.find((o) => o.id === next[next.length - 1]) ?? null : opt;
      setPicked(next);
      setLatest(show?.id ?? null);
      HERO.hot = show?.stage ? show.stage - 1 : null;
      window.dispatchEvent(new CustomEvent(HERO_HOT_EVENT, { detail: HERO.hot }));
      const plain = TASTE_OPTIONS.filter((o) => next.includes(o.id))
        .map((o) => o.plain)
        .join(", ");
      try {
        if (plain) sessionStorage.setItem(TASTE_KEY, plain);
        else sessionStorage.removeItem(TASTE_KEY);
        window.dispatchEvent(new CustomEvent("ngw:taste", { detail: plain }));
      } catch {
        /* private mode: the check still works, the hand-over just doesn't */
      }
    },
    [picked],
  );

  const shown = latest ? TASTE_OPTIONS.find((o) => o.id === latest) : null;

  const goSection = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToY(journeyY(0.268));
  };

  return (
    <section className="opening" aria-labelledby="opening-h" data-sheet="00" data-rev="D" data-name="COVER">
      <div className="opening-copy">
        <h1 id="opening-h" className="opening-h">
          Water that tastes
          <br />
          of nothing.
        </h1>

        <p className="opening-body">
          Perth scheme water arrives safe. It also arrives tasting of chlorine, and it leaves scale
          on the kettle, the glassware and the shower screen. One machine at the mains changes that
          at every tap in the house.
        </p>

        <div className="opening-act">
          <a className="opening-cta lm" href="#plate-cta">
            <span>Book a free water test</span>
          </a>
          <a className="opening-more" href="#drawing" onClick={goSection}>
            See it in section
            <i aria-hidden="true" />
          </a>
        </div>

        <div className="oc" role="group" aria-labelledby="oc-h">
          <p className="oc-h" id="oc-h">
            What does yours taste like? <span>Tick what fits. It goes with your booking.</span>
          </p>
          <div className="oc-list">
            {TASTE_OPTIONS.map((o) => {
              const on = picked.includes(o.id);
              return (
                <button
                  key={o.id}
                  type="button"
                  className={`oc-chip${on ? " is-on" : ""}${shown?.id === o.id ? " is-live" : ""}`}
                  aria-pressed={on}
                  onClick={() => toggle(o.id)}
                >
                  <i aria-hidden="true" />
                  {o.label}
                </button>
              );
            })}
          </div>
          <p className="oc-answer" aria-live="polite">
            {shown ? (
              <>
                <b>{shown.stage ? `STAGE ${shown.stage}` : "THE TEST"}</b>
                {shown.short}
              </>
            ) : (
              <span className="oc-idle">Tick one and the machine shows you which stage answers it.</span>
            )}
          </p>
        </div>
      </div>

      {/* the machine anchor. The page's one scene fits the machine to this box
          while it is on screen; the still is what stands in without WebGL. */}
      <div className="opening-stage" ref={stageRef} aria-hidden="true">
        <img
          className="opening-still"
          src={asset("/photos/machine-rest.webp")}
          alt=""
          width={1600}
          height={1073}
          draggable={false}
          decoding="async"
          fetchPriority="high"
        />
        <span className={`opening-drag${hintOn ? " is-on" : ""}`}>
          <i aria-hidden="true" />
          Drag to turn · tap a vessel
        </span>
      </div>

      <div className="opening-proof" aria-label="Installer">
        <span className="opening-proof-who">
          Fitted by{" "}
          <a className="installer-link" href={INSTALLER.url} target="_blank" rel="noopener">
            {INSTALLER.name}
          </a>
        </span>
        <span>PL10802 · GF22810</span>
        <span>12-month workmanship warranty</span>
        <span>Perth metro</span>
      </div>
    </section>
  );
}
