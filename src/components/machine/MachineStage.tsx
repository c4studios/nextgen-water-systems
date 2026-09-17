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
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import { useCallback, useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Machine, createMachineHandle, type MachineHandle } from "./Machine";
import { makeMachineMaterials } from "./materials";
import { Studio, configureStudio } from "./Studio";
import { coverPose, LIFT_RISE } from "./coverLift";
import { BOWL, COVER, COVER_Y, HOUSING_X } from "./dims";
import { HERO, HERO_OPEN_EVENT } from "@/components/blueprint/heroState";
import { journeyY } from "@/components/blueprint/journeyMap";
import { VESSEL_BEAT_P } from "@/content/journeyStory";
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
  { p: 0.85, pos: [112, 78, 150], tgt: [0, 34, 0] }, // orbit: the installer beat
  { p: 0.905, pos: [-50, 58, 182], tgt: [12, 27, 6] }, // service: bowls down, cartridges hanging; copy on the right
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

function Rig({ progress, h, world }: { progress: MutableRefObject<number>; h: MachineHandle; world: MutableRefObject<THREE.Group | null> }) {
  const { camera } = useThree();
  const tgt = useRef(new THREE.Vector3(0, 37, 0));
  const ptr = useRef(new THREE.Vector2());
  const lit = useRef([0, 0, 0]);
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

    // the hero borrows the scene
    HERO.mix = THREE.MathUtils.damp(HERO.mix, HERO.mixT, 5, delta);
    HERO.open = THREE.MathUtils.damp(HERO.open, HERO.openT, 4.2, delta);
    const hm = HERO.mix;

    // PORTRAIT: the journey's poses are composed for a wide frame; a phone
    // pulls back along the line of sight and drops the target so the machine
    // sits in the upper frame above the caption card
    if (narrow > 0.001 && hm < 0.999) {
      // the sideways compositions are for copy beside the machine; a phone
      // puts the copy under it, so the machine comes back to the centre line
      const cx = tgt.current.x * 0.8 * narrow * (1 - hm);
      tgt.current.x -= cx;
      camera.position.x -= cx;
      _dir.copy(camera.position).sub(tgt.current);
      const dist = _dir.length();
      _dir.normalize();
      camera.position.addScaledVector(_dir, dist * 0.42 * narrow * (1 - hm));
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
    const [w1, w2, w3] = interiorWindows(p);
    const pan = (1 - narrow) * (1 - hm) * (-9 * w1 + -22 * w2 + 9 * w3);
    if (Math.abs(pan) > 1e-3) {
      _dir.copy(tgt.current).sub(camera.position);
      _right.crossVectors(_dir, _up).normalize();
      camera.position.addScaledVector(_right, pan);
      tgt.current.addScaledVector(_right, pan);
    }

    camera.up.set(0, 1, 0);
    camera.lookAt(tgt.current);
    const fov = 38 - Math.max(w1, w2, w3) * 4 + (hm > 0.001 ? (36 - 38) * hm : 0);
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }

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

function Ready({ onReady }: { onReady?: () => void }) {
  const get = useThree((s) => s.get);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("ngdiag")) (window as unknown as Record<string, unknown>).__r3f = get;
    onReady?.();
  }, [onReady, get]);
  return null;
}

type Props = { progress: MutableRefObject<number>; active: boolean; onReady?: () => void };

export default function MachineStage({ progress, active, onReady }: Props) {
  const h = useMemo(() => createMachineHandle(), []);
  const mats = useMemo(() => makeMachineMaterials(Q.relief), []);
  const world = useRef<THREE.Group>(null);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("ngdiag")) (window as unknown as Record<string, unknown>).__mh = h;
  }, [h]);

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
      onHover: (what: "cover" | "housing" | null) => {
        const live = what === "housing" || (what === "cover" && HERO.mix > 0.5 && HERO.openT < 0.5);
        document.body.style.cursor = live ? "pointer" : "";
      },
    }),
    [openCover],
  );
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={Q.dpr}
      shadows
      camera={{ position: [0, 44, 172], fov: 38, near: 4, far: 900 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      eventPrefix="client"
      onCreated={({ gl, scene }) => configureStudio(gl, scene, TIER !== "low")}
      style={{ position: "absolute", inset: 0 }}
    >
      <Studio shadows={TIER !== "low"} />
      <group ref={world} position={[0, 0, 0]}>
        <Machine mats={mats} handle={h} covered pointer={pointer} />
      </group>
      <Rig progress={progress} h={h} world={world} />
      <Ready onReady={onReady} />
      {Q.ao && (
        <EffectComposer multisampling={TIER === "low" ? 0 : 4} enableNormalPass={false}>
          <N8AO aoRadius={8} intensity={1.5} distanceFalloff={1.2} halfRes={Q.aoHalfRes} quality={TIER === "high" ? "high" : "low"} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
