"use client";

/**
 * THE ONE SCENE, DRIVEN.
 *
 * The page has a single WebGL canvas fixed behind it. Two things borrow it:
 * the hero, which fits the closed cover into its anchor box and lets the
 * visitor turn it and open it, and the journey, which owns it while the
 * pinned section scrolls. Both write into plain mutable objects (HERO, and
 * the journey scalar `progress`) and this file reads them every frame and
 * moves the camera and the machine. Nothing here re-renders on scroll.
 *
 * All poses are in centimetres, the machine's own units (dims.ts).
 */
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { CALLOUTS, type Callout } from "@/content/callouts";
import { Machine, createMachineHandle, type MachineHandle } from "./Machine";
import { loadMachineMedia, makeMachineMaterials } from "./materials";
import { BLOOM_INTENSITY, CA_OFFSET, GRAIN_OPACITY, PostChain, VIGNETTE_DARKNESS } from "./PostChain";
import { Studio, configureStudio } from "./Studio";
import { precompile } from "./precompile";
import { coverPose, LIFT_RISE } from "./coverLift";
import { BOWL, COVER, COVER_Y, HOUSING_X } from "./dims";
import { HERO, HERO_OPEN_EVENT, JOURNEY_HOVER, STAGE_RIDE } from "@/components/blueprint/heroState";
import { journeyY } from "@/components/blueprint/journeyMap";
import { STORY_BEATS, VESSEL_BEAT_P } from "@/content/journeyStory";
import { scrollToY } from "@/lib/providers/SmoothScroll";
import { detectTier, QUALITY } from "@/components/blueprint/quality";

const ss = (x: number, a: number, b: number) => THREE.MathUtils.smoothstep(x, a, b);
const lerp = THREE.MathUtils.lerp;
const TIER = detectTier();
const Q = QUALITY[TIER];

/* ---- the camera rail, keyed to the journey scalar ---- */
type Key = { p: number; pos: [number, number, number]; tgt: [number, number, number] };
const X0 = HOUSING_X[0];
const X1 = HOUSING_X[1];
const X2 = HOUSING_X[2];
export const CAM: Key[] = [
  { p: 0.0, pos: [-36, 46, 184], tgt: [10, 37, 0] }, // the cover, a little off square so it has a side; aimed right of it so it sits left of the copy
  { p: 0.05, pos: [-36, 46, 184], tgt: [10, 37, 0] }, // hold while "take the cover off" reads
  { p: 0.12, pos: [-44, 58, 192], tgt: [0, 50, 0] }, // the cover rises: back off and look up with it
  { p: 0.2, pos: [-62, 60, 168], tgt: [0, 36, 0] }, // the cover is gone: three-quarter on the machine
  { p: 0.28, pos: [-104, 60, 128], tgt: [-22, 48, 0] }, // the mains in, left side
  { p: 0.34, pos: [X0 - 9, 34, 96], tgt: [X0, 31, 0] }, // arrive at stage 1
  { p: 0.45, pos: [X0 - 5, 33, 80], tgt: [X0, 30, 0] }, // push in
  { p: 0.475, pos: [X1 - 7, 34, 106], tgt: [X1, 31, 0] }, // slide to stage 2: a wider frame, its neighbours and the inlet drop are in it
  { p: 0.6, pos: [X1 - 4, 33, 100], tgt: [X1, 30, 0] }, // the long dwell
  { p: 0.625, pos: [X2 - 9, 34, 96], tgt: [X2, 31, 0] }, // slide to stage 3
  { p: 0.72, pos: [X2 - 5, 33, 80], tgt: [X2, 30, 0] },
  { p: 0.77, pos: [96, 60, 118], tgt: [30, 50, 0] }, // the house out, right side
  { p: 0.815, pos: [96, 60, 118], tgt: [30, 50, 0] }, // held while "every tap" reads: the orbit used to start under it and carried the machine into the copy
  { p: 0.85, pos: [112, 78, 150], tgt: [0, 34, 0] }, // orbit: the installer beat
  { p: 0.88, pos: [112, 78, 150], tgt: [0, 34, 0] }, // held while the installer's copy reads, for the same reason
  { p: 0.905, pos: [-32, 58, 182], tgt: [30, 27, 6] }, // service: bowls down, cartridges hanging; panned left of centre so the copy on the right stands on clean set
  { p: 0.935, pos: [-32, 58, 182], tgt: [30, 27, 6] }, // held while the servicing copy reads: moving off early slid the machine under it
  { p: 0.955, pos: [64, 50, 194], tgt: [-12, 34, 0] }, // hand-off
  { p: 1.0, pos: [56, 46, 200], tgt: [-14, 33, 0] },
];

function segIndex(p: number): number {
  for (let i = 0; i < CAM.length - 1; i++) if (p <= CAM[i + 1].p) return i;
  return CAM.length - 2;
}
function crAxis(a: number, b: number, c: number, d: number, t: number): number {
  return 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
}
/** Catmull-Rom through the keys, evaluated per segment so every key lands
 *  exactly; a zero-length segment is a hold */
function sampleRail(sel: "pos" | "tgt", i: number, t: number, out: THREE.Vector3) {
  const pick = (j: number) => CAM[Math.min(Math.max(j, 0), CAM.length - 1)][sel];
  const P0 = pick(i - 1), P1 = pick(i), P2 = pick(i + 1), P3 = pick(i + 2);
  const len = Math.hypot(P2[0] - P1[0], P2[1] - P1[1], P2[2] - P1[2]);
  if (len < 1e-5) {
    out.set(P1[0], P1[1], P1[2]);
    return;
  }
  out.set(crAxis(P0[0], P1[0], P2[0], P3[0], t), crAxis(P0[1], P1[1], P2[1], P3[1], t), crAxis(P0[2], P1[2], P2[2], P3[2], t));
}

/** the section windows: when each housing is cut open and its water runs */
export function interiorWindows(p: number): [number, number, number] {
  const w1 = ss(p, 0.33, 0.37) * (1 - ss(p, 0.455, 0.475));
  const w2 = ss(p, 0.46, 0.495) * (1 - ss(p, 0.605, 0.625));
  const w3 = ss(p, 0.61, 0.645) * (1 - ss(p, 0.735, 0.76));
  return [w1, w2, w3];
}
/** the cover's lift along the journey */
export const coverLiftAt = (p: number) => ss(p, 0.045, 0.2);
/** the service explode */
export const serviceAt = (p: number) => ss(p, 0.875, 0.93) * (1 - ss(p, 0.945, 0.985));

const _dir = new THREE.Vector3();
const _right = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const _slot = new THREE.Vector3();

type DofHandle = { target?: THREE.Vector3; bokehScale: number; cocMaterial?: { worldFocusRange: number; worldFocusDistance: number } } | null;

/** where the camera should be looking hardest, per beat: the cut housing while
 *  one is open, the cover's lettering while the cover is on, the machine otherwise */
export function focusPoint(p: number, out: THREE.Vector3): number {
  const [w1, w2, w3] = interiorWindows(p);
  const through = Math.max(w1, w2, w3);
  const sum = w1 + w2 + w3;
  if (sum > 0.001) out.set((w1 * X0 + w2 * X1 + w3 * X2) / sum, 30, 0);
  else if (p < 0.2) out.set(0, COVER.lockup.name.cy, COVER.d / 2 + 1);
  else out.set(0, 34, 0);
  return through;
}

function Rig({ progress, h, world, dof }: { progress: MutableRefObject<number>; h: MachineHandle; world: MutableRefObject<THREE.Group | null>; dof: MutableRefObject<DofHandle> }) {
  const { camera } = useThree();
  const size = useThree((st) => st.size);
  const focus = useRef(new THREE.Vector3(0, 34, 0));
  const tgt = useRef(new THREE.Vector3(0, 37, 0));
  const ptr = useRef(new THREE.Vector2());
  const lit = useRef([0, 0, 0]);
  const side = useRef(0);
  useFrame((state, delta) => {
    const p = progress.current;
    const i = segIndex(p);
    const a = CAM[i], b = CAM[i + 1];
    const t = THREE.MathUtils.clamp((p - a.p) / (b.p - a.p || 1), 0, 1);
    const e = ss(t, 0, 1);
    sampleRail("pos", i, e, camera.position);
    sampleRail("tgt", i, e, tgt.current);
    const cam = camera as THREE.PerspectiveCamera;
    const narrow = THREE.MathUtils.clamp((1.15 - cam.aspect) / 0.5, 0, 1);
    const [w1, w2, w3] = interiorWindows(p);
    const inside = Math.max(w1, w2, w3);

    // the hero borrows the scene
    HERO.mix = THREE.MathUtils.damp(HERO.mix, HERO.mixT, 5, delta);
    HERO.open = THREE.MathUtils.damp(HERO.open, HERO.openT, 4.2, delta);
    const hm = HERO.mix;

    // PORTRAIT: the journey's poses are composed for a wide frame; a phone
    // pulls back along the line of sight and drops the target so the machine
    // sits in the upper frame above the caption card
    if (narrow > 0.001 && hm < 0.999) {
      // the sideways compositions are for copy beside the machine; a phone
      // puts the copy under it, so the machine comes back to the centre line,
      // EXCEPT inside a stage, where the housing being opened is the subject
      // and stays centred (stage 1 frames housing 1, not its neighbour)
      const cx = tgt.current.x * 0.8 * narrow * (1 - hm) * (1 - inside);
      tgt.current.x -= cx;
      camera.position.x -= cx;
      _dir.copy(camera.position).sub(tgt.current);
      const dist = _dir.length();
      _dir.normalize();
      // pulled back to fit the tall frame; less inside a stage, so the one
      // housing fills it and the neighbours fall to the edges
      camera.position.addScaledVector(_dir, dist * (0.42 - 0.12 * inside) * narrow * (1 - hm));
      tgt.current.y -= 5 * narrow * (1 - hm);
      camera.position.y -= 5 * narrow * (1 - hm);
    }

    if (hm > 0.001) {
      // drag to turn: eases to the dragged yaw, and back to square when let go
      if (!HERO.dragging) HERO.yawT = THREE.MathUtils.damp(HERO.yawT, HERO.yawRest, 0.5, delta);
      HERO.yaw = THREE.MathUtils.damp(HERO.yaw, HERO.yawT, HERO.dragging ? 24 : 5, delta);
      // FIT the cover to its anchor box, aimed at the cover's own centre
      const fovNow = 36;
      const wantH = Math.min(0.66, Math.max(0.2, HERO.ch * 0.82));
      const wantW = Math.max(0.14, HERO.cw * 0.7);
      const tanH = Math.tan(THREE.MathUtils.degToRad(fovNow) / 2);
      const dFit = Math.max(COVER.h / (wantH * 2 * tanH), COVER.w / (wantW * 2 * tanH * cam.aspect));
      const aimY = COVER.h / 2;
      camera.position.x = lerp(camera.position.x, 0, hm);
      camera.position.y = lerp(camera.position.y, aimY + 4, hm);
      camera.position.z = lerp(camera.position.z, dFit, hm);
      tgt.current.x = lerp(tgt.current.x, 0, hm);
      tgt.current.y = lerp(tgt.current.y, aimY, hm);
      const dist = camera.position.distanceTo(tgt.current);
      const worldH = 2 * dist * Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2);
      const worldW = worldH * cam.aspect;
      // a pan, not a turn: camera and target move together so the machine is
      // translated on screen into the anchor box
      const dx = -(HERO.cx - 0.5) * worldW * hm;
      const dy = (HERO.cy - 0.5) * worldH * hm;
      camera.position.x += dx;
      camera.position.y += dy;
      tgt.current.x += dx;
      tgt.current.y += dy;
    } else {
      HERO.yaw = HERO.yawRest;
    }
    // the visitor's turn: the whole machine yaws
    if (world.current) world.current.rotation.y = HERO.yaw * hm;

    // pointer parallax, everywhere except the cover sheet
    const par = 1 - hm;
    ptr.current.x = THREE.MathUtils.damp(ptr.current.x, state.pointer.x, 5, delta);
    ptr.current.y = THREE.MathUtils.damp(ptr.current.y, state.pointer.y, 5, delta);
    camera.position.x += ptr.current.x * 1.6 * par;
    camera.position.y += ptr.current.y * 0.9 * par;

    // WIDE-FRAME COMPOSITION: the copy stands beside the machine, so on the
    // three stage beats the view is shifted sideways along the camera's right
    // vector (the same view, moved) to leave the copy column clear
    const pan = (1 - narrow) * (1 - hm) * (-9 * w1 + -22 * w2 + 9 * w3);
    if (Math.abs(pan) > 1e-3) {
      _dir.copy(tgt.current).sub(camera.position);
      _right.crossVectors(_dir, _up).normalize();
      camera.position.addScaledVector(_right, pan);
      tgt.current.addScaledVector(_right, pan);
    }

    camera.up.set(0, 1, 0);
    camera.lookAt(tgt.current);

    // where each housing's front sits on screen, for a hero that pins labels
    // to them (heroState HERO.slots); only while the hero owns the scene
    if (hm > 0.5 && world.current) {
      camera.updateMatrixWorld();
      world.current.updateMatrixWorld();
      for (let k = 0; k < 3; k++) {
        // low on the front of each bowl, under the section window, so a mark
        // there never covers the media when the housing is cut open
        _slot.set(HOUSING_X[k], 11, BOWL.r + 0.5).applyMatrix4(world.current.matrixWorld).project(camera);
        const s = HERO.slots[k];
        s.x = _slot.x * 0.5 + 0.5;
        s.y = -_slot.y * 0.5 + 0.5;
        s.on = _slot.z < 1;
      }
    } else if (HERO.slots[0].on) {
      for (const s of HERO.slots) s.on = false;
    }

    // the lens: focus rides the discussed part, the field narrows as a housing opens
    const eff = dof.current;
    if (eff) {
      const through = focusPoint(p, focus.current);
      if (hm > 0.001) focus.current.lerp(new THREE.Vector3(0, COVER.lockup.name.cy, COVER.d / 2 + 1), hm);
      if (eff.target) eff.target.copy(focus.current);
      if (eff.cocMaterial) {
        eff.cocMaterial.worldFocusDistance = camera.position.distanceTo(focus.current);
        eff.cocMaterial.worldFocusRange = (26 - through * 14) * (1 - hm) + 60 * hm;
      }
      eff.bokehScale = (1.6 + through * 2.2) * (1 - hm) + 1.0 * hm;
    }
    const fov = 38 - Math.max(w1, w2, w3) * 4 + (hm > 0.001 ? (36 - 38) * hm : 0);
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }

    // THE ENTRANCE (heroState STAGE_RIDE): while the journey's top edge is
    // still below the top of the screen, the whole picture is drawn that far
    // down the frame, so the machine comes up with its section instead of
    // standing still while the page above slides off it. Read from the scroll
    // position, not from layout, so it costs nothing per frame.
    let ride = 0;
    if (hm < 0.5 && Number.isFinite(STAGE_RIDE.start)) {
      ride = THREE.MathUtils.clamp(STAGE_RIDE.start - window.scrollY, 0, size.height);
    }
    // THE COPY COLUMN ON A SMALLER DESKTOP. Every pose on the rail was composed
    // at 1440 by 900, where a beat's sentences end 290px short of the frame's
    // centre line. The picture scales with the frame's HEIGHT (the field of
    // view is vertical) while the copy keeps its own measure, so on a smaller
    // screen the copy reaches further into the picture: at 1024 by 768 every
    // beat stood on a pipe or a housing, and at 1280 by 720 three did. While a
    // beat is up the whole picture steps sideways, away from that beat's
    // column, by exactly what the copy has gained on the 1440 composition (13px
    // at 1280 by 720, 135px at 1024 by 768, nothing at 1366 and up). It eases
    // over about half a second, the time the copy takes to arrive. The numbers
    // mirror world.css (.jb--left's margin, .jbeat's measure, .jb-p's 40ch):
    // change them together.
    let sideT = 0;
    if (narrow < 0.001 && hm < 0.5 && size.width > 900) {
      const bt = STORY_BEATS.find((b) => p >= b.a && p <= b.b);
      if (bt) {
        const margin = THREE.MathUtils.clamp(size.width * 0.06, 24, 96);
        const sentences = Math.min(430, size.width * 0.33, 344);
        const composedFor = size.width / 2 - 290 * (size.height / 900);
        const gained = Math.max(0, margin + sentences - composedFor);
        sideT = bt.pos === "jb--left" ? gained : -gained;
      }
    }
    side.current = THREE.MathUtils.damp(side.current, sideT, 5, delta);
    if (Math.abs(side.current) < 0.25 && sideT === 0) side.current = 0;
    const sx = Math.round(side.current * 2) / 2;
    if (ride > 0.25 || sx !== 0) {
      const v = cam.view;
      if (!v || !v.enabled || v.offsetX !== -sx || v.offsetY !== -ride || v.fullWidth !== size.width || v.fullHeight !== size.height) {
        cam.setViewOffset(size.width, size.height, -sx, -ride, size.width, size.height);
      }
    } else if (cam.view && cam.view.enabled) {
      cam.clearViewOffset();
      ride = 0;
    }
    STAGE_RIDE.px = ride;
    STAGE_RIDE.side = sx;

    // ---- the machine follows p and the hero ----
    const jl = coverLiftAt(p);
    const lift = Math.max(jl * (1 - hm), HERO.open * hm);
    if (h.cover) {
      // the cover has to leave the frame, whatever the frame is: on a phone
      // the camera stands further back and the frame is tall
      const dist = camera.position.distanceTo(tgt.current);
      const frameTop = tgt.current.y + dist * Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2);
      coverPose(h.cover, lift, Math.max(LIFT_RISE, frameTop - COVER_Y + 10));
    }
    const hot = HERO.hot;
    for (let k = 0; k < 3; k++) {
      const target = hm > 0.5 && hot === k && HERO.open > 0.6 ? 1 : 0;
      lit.current[k] = THREE.MathUtils.damp(lit.current[k], target, 6, delta);
      const wj = [w1, w2, w3][k] * (1 - hm);
      const wh = lit.current[k] * hm;
      const w = Math.max(wj, wh);
      h.cut[k] = w * THREE.MathUtils.degToRad(62);
      h.flow[k] = w;
      h.lit[k] = lit.current[k];
    }
    // service: the bowls unscrew, come forward out of the frame and set down
    // on the floor, and the cartridges hang from their heads
    const sv = serviceAt(p) * (1 - hm);
    for (let k = 0; k < 3; k++) {
      const bowl = h.bowls[k];
      if (!bowl) continue;
      const unscrew = ss(sv, 0, 0.45);
      const setDown = ss(sv, 0.3, 1);
      bowl.rotation.y = unscrew * Math.PI * 1.5;
      bowl.rotation.x = setDown * THREE.MathUtils.degToRad(-10);
      bowl.position.set((k - 1) * 4 * setDown, -unscrew * 6 - setDown * (BOWL.bottom - 6 + 0.4), setDown * 27);
    }
  });
  return null;
}


/* ---- the callouts: the scene projects each anchor, the page draws the tag ---- */
/** the paper tag's own box, relative to its dot: the leader is 74px and the
 *  tag is centred on the dot (world.css) */
const TAG_LEADER = 74;

function CalloutDriver({ progress, host }: { progress: MutableRefObject<number>; host?: MutableRefObject<HTMLElement | null> }) {
  const camera = useThree((st) => st.camera);
  const size = useThree((st) => st.size);
  const items = useRef<{ el: HTMLElement; tag: HTMLElement | null; c: Callout }[] | null>(null);
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const root = host?.current;
    if (!root) return;
    if (!items.current) {
      items.current = CALLOUTS.map((c) => ({
        c,
        el: root.querySelector<HTMLElement>(`[data-callout="${c.id}"]`),
        tag: root.querySelector<HTMLElement>(`[data-callout="${c.id}"] .jc-tag`),
      })).filter((x): x is { el: HTMLElement; tag: HTMLElement | null; c: Callout } => !!x.el);
    }
    const p = progress.current;
    const hm = HERO.mix;
    const wide = size.width >= 900;
    // THE NAV IS AN OBSTACLE TOO. The condensed pill floats over the top of the
    // frame, so a tag whose paper would land under it (or under its quick-menu
    // circle) is faded out rather than half-hidden. Read before any write, so
    // the frame never pays for a forced layout.
    let navBottom = 0;
    let navLeft = 0;
    let navRight = 0;
    if (wide && hm < 0.999) {
      const nav = document.querySelector<HTMLElement>("header.site-nav");
      if (nav) {
        const r = nav.getBoundingClientRect();
        navBottom = r.bottom + 6;
        navLeft = r.left - 6;
        navRight = r.right + 6;
      }
    }
    for (const { el, tag, c } of items.current) {
      // IN OR OUT, ON THE CLOCK, like the copy (Journey.tsx): a tag scrubbed
      // to the scroll rested part-drawn wherever the scroll stopped, and at
      // the rail's own "The system" stop one tag stood at a quarter strength
      // (finish review, 19 Sep 2026). The class runs the entrance (dot, then
      // leader, then tag, each tag a beat after the last) and one quick fade
      // out in world.css; this only says when, and where on the screen.
      let on = wide && hm < 0.5 && p >= c.a && p <= c.b;
      if (on) {
        v.set(c.at[0], c.at[1], c.at[2]).project(camera);
        if (v.z > 1) on = false;
      }
      let x = 0;
      let y = 0;
      if (on) {
        x = (v.x * 0.5 + 0.5) * size.width;
        y = (-v.y * 0.5 + 0.5) * size.height;
        if (tag) {
          const w = tag.offsetWidth || 180;
          const h = tag.offsetHeight || 34;
          const left = c.side === "r" ? x + TAG_LEADER : x - TAG_LEADER - w;
          const top = y - h / 2;
          if (navBottom > 0 && top < navBottom && left < navRight && left + w > navLeft) on = false;
          // a tag that would run off the frame is left out whole: on a smaller
          // desktop the picture stands further to one side (the copy column's
          // step, above) and the outermost tag no longer fits
          if (left < 8 || left + w > size.width - 8) on = false;
        }
      }
      if (on !== el.classList.contains("is-in")) el.classList.toggle("is-in", on);
      if (on) el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }
  });
  return null;
}

/* the lens chain is for the set: on the hero the page is white, so the
   vignette and the grain fade out as the hero takes the scene */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PostDriver({ vig, grain, bloom, ca }: { vig: MutableRefObject<any>; grain: MutableRefObject<any>; bloom: MutableRefObject<any>; ca: MutableRefObject<any> }) {
  useFrame(() => {
    const k = 1 - HERO.mix;
    if (vig.current && "darkness" in vig.current) vig.current.darkness = VIGNETTE_DARKNESS * k;
    if (grain.current?.blendMode?.opacity) grain.current.blendMode.opacity.value = GRAIN_OPACITY * k;
    // the hero's ground is HDR white so it lands on the page's white: nothing may
    // bloom off it, and no fringe may ride the cover's edge against it either
    if (bloom.current && "intensity" in bloom.current) bloom.current.intensity = BLOOM_INTENSITY * k;
    const off = ca.current?.offset;
    if (off && "set" in off) off.set(CA_OFFSET.x * k, CA_OFFSET.y * k);
  });
  return null;
}

/** Compiles every program the scene draws before its first frame, in the
 *  GPU process's own threads (precompile.ts), while the frame loop is held;
 *  then arms the warm-up, so for the first few frames every part the journey
 *  reveals (the section faces, the water) is drawn once, unseen inside the
 *  closed machine, and its buffers and textures upload at load, never
 *  mid-scroll. Runs after the canvas's layout effects: by then onCreated has
 *  set the renderer up (tone mapping, local clipping, fog), the environment
 *  map is in the scene and the soft-shadow chunk is patched, and every one of
 *  them goes into the programs. */
function Precompile({ h, mats, size, onDone }: { h: MachineHandle; mats: ReturnType<typeof makeMachineMaterials>; size: number; onDone: () => void }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    let live = true;
    // the cartridge media are drawn in idle time and swapped into their stand-ins
    void loadMachineMedia(mats, size);
    // with the post chain the scene is only ever drawn into a target; without
    // it the canvas gets the scene, and the water's transmission pass a target
    void precompile(gl, scene, camera, Q.ao ? ["target"] : ["screen", "target"]).then(() => {
      if (!live) return;
      h.warm = 3;
      onDone();
    });
    return () => {
      live = false;
    };
  }, [gl, scene, camera, h, mats, size, onDone]);
  return null;
}

/** Tells the page the live scene may replace the poster still. Not on mount:
 *  the first frames compile shaders and can still carry the pose from before
 *  the hero took the scene, and a crossfade over those showed two covers on a
 *  phone at load (finish review, 18 Sep 2026). After a few drawn frames the
 *  picture has settled into exactly the still's pose, so the handover is
 *  invisible. */
const SETTLED_FRAMES = 8;
function Ready({ onReady }: { onReady?: () => void }) {
  const get = useThree((s) => s.get);
  const drawn = useRef(0);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("ngdiag")) (window as unknown as Record<string, unknown>).__r3f = get;
  }, [get]);
  useFrame(() => {
    if (drawn.current > SETTLED_FRAMES) return;
    drawn.current += 1;
    if (drawn.current === SETTLED_FRAMES) onReady?.();
  });
  return null;
}

type Props = { progress: MutableRefObject<number>; active: boolean; onReady?: () => void; callouts?: MutableRefObject<HTMLElement | null> };

export default function MachineStage({ progress, active, onReady, callouts }: Props) {
  const h = useMemo(() => createMachineHandle(), []);
  const mats = useMemo(() => makeMachineMaterials(Q.relief), []);
  const world = useRef<THREE.Group>(null);
  const dof = useRef<DofHandle>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vig = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const grain = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bloom = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ca = useRef<any>(null);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("ngdiag")) (window as unknown as Record<string, unknown>).__mh = h;
  }, [h]);
  // THE FRAME LOOP. Held until every program is compiled (Precompile), so no
  // frame ever waits on a link; then it runs regardless of `active` until the
  // scene has drawn its settled frames (Ready), so the warm-up and the post
  // chain's first compile happen at load even if the visitor has already
  // scrolled on; after that it follows `active`.
  const [compiled, setCompiled] = useState(false);
  const [settled, setSettled] = useState(false);
  const handleCompiled = useCallback(() => setCompiled(true), []);
  const handleReady = useCallback(() => {
    setSettled(true);
    onReady?.();
  }, [onReady]);

  // THE TAPS. On the hero a tap on the closed cover lifts it (a drag is a
  // drag, not a tap). A tap on a housing goes to that stage's beat in the
  // journey; with the cover still on, the housing is behind it and the
  // cover takes the tap first.
  const openCover = useCallback(() => {
    if (HERO.mix < 0.5 || HERO.dragged || HERO.openT > 0.5) return;
    HERO.openT = 1;
    window.dispatchEvent(new CustomEvent(HERO_OPEN_EVENT));
  }, []);
  const pointer = useMemo(
    () => ({
      onCover: openCover,
      onHousing: (i: number) => {
        if (HERO.dragged) return;
        if (HERO.mix > 0.5 && HERO.open < 0.5) {
          openCover();
          return;
        }
        scrollToY(journeyY(VESSEL_BEAT_P[i]));
      },
      onHover: (what: "cover" | "housing" | null, i?: number) => {
        const live = what === "housing" || (what === "cover" && HERO.mix > 0.5 && HERO.openT < 0.5);
        document.body.style.cursor = live ? "pointer" : "";
        // the journey's rail answers on this housing's disc (Journey.tsx)
        JOURNEY_HOVER.k = what === "housing" && typeof i === "number" ? i : -1;
      },
    }),
    [openCover],
  );
  return (
    <Canvas
      frameloop={compiled && (active || !settled) ? "always" : "never"}
      dpr={Q.dpr}
      shadows
      camera={{ position: [0, 44, 172], fov: 38, near: 4, far: 900 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      eventPrefix="client"
      onCreated={({ gl, scene }) => configureStudio(gl, scene, TIER !== "low")}
      style={{ position: "absolute", inset: 0 }}
    >
      <Studio shadows={TIER !== "low"} reflect={Q.reflect} contact={TIER === "high"} soft={TIER === "high"} />
      <group ref={world} position={[0, 0, 0]}>
        <Machine mats={mats} handle={h} covered pointer={pointer} />
      </group>
      <Precompile h={h} mats={mats} size={TIER === "high" ? 1024 : 512} onDone={handleCompiled} />
      <Rig progress={progress} h={h} world={world} dof={dof} />
      <CalloutDriver progress={progress} host={callouts} />
      <PostDriver vig={vig} grain={grain} bloom={bloom} ca={ca} />
      <Ready onReady={handleReady} />
      {/* not memoised, on purpose: each re-render has the composer rebuild its
          passes, and the rebuilt passes are the grade the page was signed off
          with. Built only once, the journey's vignette came out darker at the
          edges (measured 19 Sep 2026). */}
      <PostChain tier={TIER} refs={{ dof, vig, grain, bloom, ca }} />
    </Canvas>
  );
}
