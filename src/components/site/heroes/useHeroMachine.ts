"use client";

import { useEffect, useState, type RefObject } from "react";
import { HERO, HERO_OPEN_EVENT } from "@/components/blueprint/heroState";

/**
 * WHAT EVERY HERO SHARES WITH THE MACHINE.
 *
 * The page has one WebGL scene fixed behind it (MachineStage.tsx). A hero
 * borrows it by laying out an anchor box and writing that box into HERO every
 * frame; the scene fits the closed cover into it. These hooks are that
 * contract, pulled out of the original hero so every hero option (the
 * original, the question, the suburb check, the open machine) drives the
 * same scene the same way.
 */

export const HINT_KEY = "ngw:hero-drag-hint";

/** the machine anchor: the scene fits the cover to this box every frame */
export function useHeroAnchor(stageRef: RefObject<HTMLElement>) {
  useEffect(() => {
    HERO.mixT = 1;
    const el = stageRef.current;
    let raf = 0;
    const measure = () => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      HERO.visible = r.bottom > 0 && r.top < vh && r.height > 0;
      HERO.cx = (r.left + r.width / 2) / vw;
      HERO.cy = (r.top + r.height / 2) / vh;
      HERO.ch = r.height / vh;
      HERO.cw = r.width / vw;
    };
    // measured every frame: a scroll or a resize moves the box, but so does a
    // web font swapping in above it on a phone, which fires no event at all.
    // One rect read a frame costs nothing next to the scene it keeps aligned.
    const loop = () => {
      measure();
      raf = requestAnimationFrame(loop);
    };
    measure();
    raf = requestAnimationFrame(loop);
    return () => {
      HERO.visible = false;
      HERO.mixT = 0;
      // a hero that opened the cover or lit a housing leaves the scene as it
      // found it, so the next page (or the next hero option) starts closed
      HERO.openT = 0;
      HERO.hot = null;
      if (raf) cancelAnimationFrame(raf);
    };
  }, [stageRef]);
}

/** Drag to turn, on the window: the canvas is behind the page, and a drag is a
 *  drag only once the pointer has moved, so a tap stays a tap. */
export function useHeroDrag(stageRef: RefObject<HTMLElement>, onDragged?: () => void) {
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
          sessionStorage.setItem(HINT_KEY, "1");
        } catch {
          /* private mode */
        }
        onDragged?.();
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
  }, [stageRef, onDragged]);
}

/** true once a tap on the closed cover has lifted it */
export function useCoverOpened(): boolean {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(HERO_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(HERO_OPEN_EVENT, onOpen);
  }, []);
  return open;
}

/** the drag hint: once per session, once the live machine is up */
export function useDragHint(delayMs = 2600): [boolean, (on: boolean) => void] {
  const [on, setOn] = useState(false);
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(HINT_KEY) === "1";
    } catch {
      /* private mode */
    }
    if (seen) return;
    const t = window.setTimeout(() => setOn(true), delayMs);
    return () => window.clearTimeout(t);
  }, [delayMs]);
  return [on, setOn];
}

/** Light one housing (0, 1, 2) with the cover lifted, or none. The scene cuts
 *  the lit housing open in section and runs its water (MachineStage.tsx). */
export function lightHousing(k: number | null, open = true) {
  if (open && HERO.openT < 0.5) {
    HERO.openT = 1;
    window.dispatchEvent(new CustomEvent(HERO_OPEN_EVENT));
  }
  HERO.hot = k;
}
