"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows, Html, Lightformer, RoundedBox } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ChromaticAberration, DepthOfField } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import { BACKDROP_STOPS, BACKDROP_CENTER, BACKDROP_RADII, BACKDROP_FOG } from "./backdrop";
import { VESSEL_BEAT_P } from "@/content/journeyStory";

/**
 * THE REAL MACHINE — NGW-01 as it actually is: three 20″×4.5″ vessels on a
 * bracket/manifold, plumbed in series (Clear2O FHWR-3SI-20 architecture, no RO),
 * rendered in the brand's brushed-steel language. ONE scalar (journey progress p)
 * drives everything:
 *   0.000–0.075  hero + slow drift (meet the assembly)
 *   0.075–0.26  front DOCK (held) — the SVG white-ink trace + plate run here
 *   0.26–0.37  PROBLEM beat (mains-in side) → approach vessel 1
 *   0.37–0.70  THE WATER RUN — visit V1 → V2 (double dwell) → V3; each sump
 *              reveal its cartridge; flow guides read the true radial path
 *              (down the annulus → in through the media wall → up the core)
 *   0.70–0.78  PROOF (house-out side) → CREDIBILITY orbit
 *   0.78–0.92  service EXPLODE: heads lift, cartridges rise, labels + benefits
 *   0.92–1.00  reassemble (INSTALL beat) + settle → booking tail
 *
 * Stage order per the client's spec sheet: 1 graded sediment → 2 KDF 55/85 +
 * coconut carbon (the redox bed) → 3 limescale-reduction carbon.
 */
type Props = {
  progress: MutableRefObject<number>;
  active: boolean;
  /** .plate-sheet height / viewport height — drives the dock registration
   *  zoom now that the canvas is full-bleed (Phase 1). */
  sheetRatio?: MutableRefObject<number>;
  /** fires once the suspended scene (env HDR included) has actually mounted —
   *  LivingDrawing holds the SVG still as a poster until then. */
  onReady?: () => void;
};

// DEV forensic (?nghide=a,b,c): knock out scene elements to bisect a rogue
// frame. Namespaced key so real-world query params can't collide; inert
// in normal use.
const HIDE: string[] =
  typeof window !== "undefined"
    ? (new URLSearchParams(window.location.search).get("nghide") || "").split(",").filter(Boolean)
    : [];
const hidden = (k: string) => HIDE.includes(k);

const ss = (x: number, a: number, b: number) => THREE.MathUtils.smoothstep(x, a, b);
const lerp = THREE.MathUtils.lerp;

// Damped-interaction tuning — frame-rate-independent via THREE.MathUtils.damp
// (higher lambda = snappier). These ease ONLY the hover/pointer micro-
// interactions layered on the journey; the scroll scrub is never touched.
const HOVER_EMISSIVE_LAMBDA = 12; // ring brighten/dim on hover: crisp, still eased
const POINTER_LAMBDA = 5; // pointer parallax: smooth float

/* ---- the three vessels (x spacing 1.9; sump r .62, head r .74) ----
   spec fields feed the interactive explode cards (Phase 2) */
const VESSELS = [
  // No asterisks, no service-life estimates, no health claims. The old strings
  // carried "*" footnotes to figures nobody could source, "~6 months*" and
  // "~12 months*" service lives, and "Bacteria control*" — a health claim
  // about drinking water, which is regulated. What remains describes the
  // media and what it targets.
  {
    x: -1.9, n: "01", title: "Sediment", sub: "10/5/1µm 3-layer",
    cart: "#e8ecee", cartMetal: 0.05, cartRough: 0.85,
    media: "Graded polypropylene · 3 layers", rating: "10 / 5 / 1 µm", service: "Replaceable cartridge",
    removes: ["Grit", "Rust", "Silt"],
  },
  {
    x: 0.0, n: "02", title: "KDF 55/85 + carbon", sub: "heavy metals · chlorine",
    cart: "#a97142", cartMetal: 0.65, cartRough: 0.5,
    media: "Copper-zinc granules + coconut carbon", rating: "redox bed", service: "Long-interval",
    removes: ["Heavy metals", "Chlorine", "Taste"],
  },
  {
    x: 1.9, n: "03", title: "Limescale carbon", sub: "scale · taste · 1µm",
    cart: "#232c33", cartMetal: 0.1, cartRough: 0.7,
    media: "Scale-reduction media + carbon", rating: "1 µm polish", service: "Replaceable cartridge",
    removes: ["Scale formation", "Taste", "Odour"],
  },
] as const;

// (VESSEL_BEAT_P — the click-a-vessel scroll targets — is shared with the
// blueprint's clickable balloons via content/journeyStory)

/** per-vessel interior windows — the camera parks at each vessel while its
 *  sump ghosts. Shared by the assembly, the lights and the camera breath.
 *  Slice-1 map (1050svh pin): V2 gets DOUBLE dwell — the redox bed is the
 *  machine's signature chemistry. */
function interiorWindows(p: number): [number, number, number] {
  const w1 = ss(p, 0.37, 0.405) * (1 - ss(p, 0.445, 0.47));
  const w2 = ss(p, 0.445, 0.47) * (1 - ss(p, 0.575, 0.6));
  const w3 = ss(p, 0.575, 0.6) * (1 - ss(p, 0.675, 0.7));
  return [w1, w2, w3];
}
const interiorMax = (p: number) => Math.max(...interiorWindows(p));

/* material recipes — one story: brushed steel sumps, dark machined heads.
   NOTE (review-confirmed): per-material envMapIntensity is a no-op under
   scene.environment (three r163+) — env strength comes solely from
   scene.environmentIntensity (<Environment> prop, scrubbed in JourneyLights). */
// Slice 4 — matched to the real FHWR-3SI-20 photos: brushed silver-white
// sumps, matte charcoal heads, powder-coat charcoal frame, brass ports.
const STEEL = { color: "#c9cecf", metalness: 1, roughness: 0.33, clearcoat: 0.5, clearcoatRoughness: 0.16, anisotropy: 0.5, anisotropyRotation: Math.PI / 2 } as const;
const CAPS = { color: "#79848e", metalness: 1, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.22 } as const;
const MACHINED = { color: "#2b333b", metalness: 0.95, roughness: 0.42 } as const;
const HEAD = { color: "#23272c", metalness: 0.9, roughness: 0.5 } as const; // matte charcoal cap
const FRAME = { color: "#2c3034", metalness: 0.42, roughness: 0.6 } as const; // powder-coat cage
const BRASS = { color: "#b28a4e", metalness: 1, roughness: 0.34 } as const; // connector ports
const CA_OFFSET = new THREE.Vector2(0.0006, 0.0004);

/** Mounting tab with two real through-holes (the old one was a box with a
 *  torus sat on top of it — a ring, not a hole). Extruded from a rounded
 *  rectangle Shape with two circular holes. */
function tabGeometry(w: number, d: number, t: number, holeR: number) {
  const r = Math.min(w, d) * 0.22;
  const sh = new THREE.Shape();
  sh.moveTo(-w / 2 + r, -d / 2);
  sh.lineTo(w / 2 - r, -d / 2);
  sh.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + r);
  sh.lineTo(w / 2, d / 2 - r);
  sh.quadraticCurveTo(w / 2, d / 2, w / 2 - r, d / 2);
  sh.lineTo(-w / 2 + r, d / 2);
  sh.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - r);
  sh.lineTo(-w / 2, -d / 2 + r);
  sh.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + r, -d / 2);
  for (const hx of [-w * 0.24, w * 0.24]) {
    const h = new THREE.Path();
    h.absarc(hx, 0, holeR, 0, Math.PI * 2, true);
    sh.holes.push(h);
  }
  const g = new THREE.ExtrudeGeometry(sh, {
    depth: t, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 2, curveSegments: 18,
  });
  g.rotateX(-Math.PI / 2); // extrude along +y, so the tab lies flat
  g.translate(0, -t / 2, 0);
  return g;
}

/** Corner gusset — a right-triangle plate welded into a post/rail corner. */
function gussetGeometry(leg: number, t: number) {
  const sh = new THREE.Shape();
  sh.moveTo(0, 0);
  sh.lineTo(leg, 0);
  sh.lineTo(0, leg);
  sh.closePath();
  const g = new THREE.ExtrudeGeometry(sh, { depth: t, bevelEnabled: false });
  g.translate(0, 0, -t / 2);
  return g;
}

/** Fullscreen pool-of-light INSIDE the GL frame — same stops as the page CSS
 *  (see backdrop.ts), so the canvas cross-fade at the trace beat is seamless.
 *  Raw ShaderMaterial: no tone mapping, no fog — the hexes hit the framebuffer
 *  exactly as CSS renders them. */
function Backdrop() {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    // one triangle covering NDC — cheaper and simpler than a quad
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
    return g;
  }, []);
  const mat = useMemo(() => {
    // the composer's frame buffer is LINEAR (the final pass applies tone
    // mapping + sRGB encode to everything) — feed it linear values or the
    // encode washes the pool-of-light to grey
    const [a, b, c] = BACKDROP_STOPS.map(([, hex]) => {
      const col = new THREE.Color(hex).convertSRGBToLinear();
      return [col.r, col.g, col.b] as [number, number, number];
    });
    const mid = BACKDROP_STOPS[1][0];
    return new THREE.ShaderMaterial({
      depthWrite: false,
      depthTest: false,
      fog: false,
      vertexShader: `varying vec2 vUv; void main(){ vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 1.0, 1.0); }`,
      fragmentShader: `
        varying vec2 vUv;
        void main(){
          // CSS geometry: centre (${BACKDROP_CENTER.x}, ${BACKDROP_CENTER.y} from top), radii ${BACKDROP_RADII.x}/${BACKDROP_RADII.y}
          vec2 q = vec2((vUv.x - ${BACKDROP_CENTER.x.toFixed(3)}) / ${BACKDROP_RADII.x.toFixed(3)},
                        (vUv.y - ${(1 - BACKDROP_CENTER.y).toFixed(3)}) / ${BACKDROP_RADII.y.toFixed(3)});
          float d = clamp(length(q), 0.0, 1.0);
          vec3 a = vec3(${a.map((v) => v.toFixed(4)).join(",")});
          vec3 b = vec3(${b.map((v) => v.toFixed(4)).join(",")});
          vec3 c = vec3(${c.map((v) => v.toFixed(4)).join(",")});
          vec3 col = d < ${mid.toFixed(3)} ? mix(a, b, d / ${mid.toFixed(3)}) : mix(b, c, (d - ${mid.toFixed(3)}) / ${(1 - mid).toFixed(3)});
          gl_FragColor = vec4(col, 1.0);
        }`,
    });
  }, []);
  return <mesh geometry={geo} material={mat} renderOrder={-1} frustumCulled={false} />;
}

/** Phase 3 — scroll-driven photography: focus rides the vessel being
 *  discussed (weighted by the interior windows), the lens opens up inside the
 *  machine, and the DoF stands down entirely at the trace dock where ink
 *  registration owns a clinically sharp frame. */
function FocusRig({ progress, dof }: { progress: MutableRefObject<number>; dof: MutableRefObject<{ target?: THREE.Vector3; bokehScale: number; cocMaterial?: { worldFocusRange: number } } | null> }) {
  useFrame(() => {
    const eff = dof.current;
    if (!eff) return;
    const p = progress.current;
    const w = interiorWindows(p);
    const through = Math.max(...w);
    const dockW = ss(p, 0.03, 0.075) * (1 - ss(p, 0.26, 0.33));
    const sum = w[0] + w[1] + w[2];
    const x = sum > 0.001 ? (w[0] * VESSELS[0].x + w[1] * VESSELS[1].x + w[2] * VESSELS[2].x) / sum : 0;
    if (eff.target) eff.target.set(x, -0.1, 0);
    if (eff.cocMaterial) eff.cocMaterial.worldFocusRange = 3.4 - through * 1.2;
    eff.bokehScale = (1.3 + through * 1.9) * (1 - dockW);
  });
  return null;
}

/** Mounted INSIDE the Canvas's suspense boundary — its effect can only fire
 *  once every suspended resource (the env HDR) has resolved. */
function Ready({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return null;
}

/** DEV forensic (?ngdbgray): raycast from screen centre and log what's actually
 *  in front of the camera — for diagnosing "mystery surface" frames. */
function DebugRay() {
  const { camera, scene } = useThree();
  const done = useRef(false);
  useFrame((state) => {
    if (done.current || state.clock.elapsedTime < 3) return;
    done.current = true;
    const ray = new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2(0, 0), camera);
    const hits = ray.intersectObjects(scene.children, true);
    // eslint-disable-next-line no-console
    console.log(
      "DBGRAY",
      JSON.stringify(
        hits.slice(0, 8).map((h) => {
          const o = h.object as THREE.Mesh;
          const geo = o.geometry as THREE.BufferGeometry & { type?: string; parameters?: Record<string, unknown> };
          const mat = (Array.isArray(o.material) ? o.material[0] : o.material) as THREE.MeshStandardMaterial | undefined;
          return {
            d: +h.distance.toFixed(2),
            g: geo?.type,
            p: geo?.parameters ? JSON.stringify(geo.parameters).slice(0, 60) : "",
            op: mat?.opacity,
            t: mat?.transparent,
            c: mat?.color?.getHexString?.(),
          };
        }),
      ),
    );
  });
  return null;
}

/** Studio lights that DIM while the camera is inside a ghosted vessel —
 *  directionals have no shadows, so without this they flood the interior.
 *  scene.environmentIntensity is the ONE env knob that actually reaches the
 *  GPU under scene.environment. */
function JourneyLights({ progress }: { progress: MutableRefObject<number> }) {
  const amb = useRef<THREE.AmbientLight>(null);
  const key = useRef<THREE.DirectionalLight>(null);
  const rim = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.DirectionalLight>(null);
  const { scene } = useThree();
  useFrame(() => {
    const through = interiorMax(progress.current);
    const dimmed = 1 - through * 0.8;
    if (amb.current) amb.current.intensity = 0.12 * dimmed;
    if (key.current) key.current.intensity = 0.85 * dimmed;
    if (rim.current) rim.current.intensity = 0.6 * dimmed;
    if (fill.current) fill.current.intensity = 0.22 * dimmed;
    scene.environmentIntensity = 0.82 * (1 - through * 0.95);
  });
  return (
    <>
      <ambientLight ref={amb} intensity={0.12} />
      {/* warm key for form; two cyan rims rake the edges as brand accent */}
      <directionalLight ref={key} position={[4, 6, 5]} intensity={0.85} color="#f2f3f4" />
      {/* rim was #29c2ee cyan — it painted every steel highlight blue. Neutral rim = real studio stainless. */}
      <directionalLight ref={rim} position={[-5.5, 1.5, -3]} intensity={0.6} color="#e9ebed" />
      <directionalLight ref={fill} position={[-1.5, -1, 4.5]} intensity={0.22} color="#c9ced2" />
    </>
  );
}

/* ---- camera rail (pos + look target), keyed to p ---- */
type Key = { p: number; pos: [number, number, number]; tgt: [number, number, number] };
/* Slice-1 rail (1050svh pin): the sales story gets its own poses — the
   PROBLEM beat holds the mains-in side while contaminants gather, the PROOF
   beat holds the house-out side as clean water exits. */
const CAM: Key[] = [
  // Rest pose == dock pose. The hero used to be a low ¾ that orbited into the
  // dock, which is what made the machine look tilted and spinning on arrival.
  // Now: front elevation, static, from p=0 — the photoreal still sits over
  // exactly this framing and dissolves into it before the ink trace begins.
  { p: 0.0, pos: [0, 0.12, 8.8], tgt: [0, 0.12, 0] }, // rest (= dock)
  { p: 0.075, pos: [0, 0.12, 8.8], tgt: [0, 0.12, 0] }, // front dock (trace)
  { p: 0.26, pos: [0, 0.12, 8.8], tgt: [0, 0.12, 0] }, // hold dock until the plate exits
  { p: 0.305, pos: [-3.6, -0.25, 6.2], tgt: [-2.5, 0.35, 0] }, // PROBLEM — mains-in side, V1 inlet + feed pipe
  { p: 0.345, pos: [-2.7, -0.1, 5.2], tgt: [-2.1, 0.1, 0] }, // ease toward V1
  { p: 0.37, pos: [-1.9, 0.05, 4.6], tgt: [-1.9, -0.1, 0] }, // arrive V1
  { p: 0.445, pos: [-1.9, -0.05, 4.1], tgt: [-1.9, -0.15, 0] }, // slow push through V1
  { p: 0.47, pos: [0, 0.05, 4.6], tgt: [0, -0.1, 0] }, // slide to V2 (KDF)
  { p: 0.575, pos: [0, -0.05, 4.05], tgt: [0, -0.15, 0] }, // deep push through V2 (double dwell)
  { p: 0.6, pos: [1.9, 0.05, 4.6], tgt: [1.9, -0.1, 0] }, // slide to V3
  { p: 0.675, pos: [1.9, -0.05, 4.1], tgt: [1.9, -0.15, 0] }, // push through V3
  { p: 0.725, pos: [3.6, 0.3, 6.4], tgt: [2.7, 0.45, 0] }, // PROOF — machine left of centre, the schedule owns the right
  { p: 0.78, pos: [5.4, 1.6, 5.6], tgt: [0, 0.3, 0] }, // pull back (credibility orbit)
  { p: 0.845, pos: [5.0, 2.6, 6.2], tgt: [0, 0.35, 0] }, // rise…
  { p: 0.885, pos: [5.6, 3.6, 8.6], tgt: [0.15, -0.3, 0.55] }, // …to the elevated service view — far enough back that the set-down sumps AND the exposed cartridges both sit in frame
  { p: 1.0, pos: [2.8, 0.15, 8.8], tgt: [0, 0.12, 0] }, // settle front, reassembled
];

function segIndex(p: number): number {
  for (let i = 0; i < CAM.length - 1; i++) if (p <= CAM[i + 1].p) return i;
  return CAM.length - 2;
}

/** Catmull-Rom through the rail keys (uniform basis), evaluated per segment so
 *  every key still lands at its EXACT p. Hold segments (identical knots) stay
 *  put, and their zero-length neighbours naturally ease the tangents to rest —
 *  kills the velocity kink at 9 of 11 keys that piecewise lerp had. */
function crAxis(a: number, b: number, c: number, d: number, t: number): number {
  return 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
}
function sampleRail(sel: "pos" | "tgt", i: number, t: number, out: THREE.Vector3) {
  const pick = (j: number) => CAM[Math.min(Math.max(j, 0), CAM.length - 1)][sel];
  const P0 = pick(i - 1), P1 = pick(i), P2 = pick(i + 1), P3 = pick(i + 2);
  const len = Math.hypot(P2[0] - P1[0], P2[1] - P1[1], P2[2] - P1[2]);
  if (len < 1e-5) {
    out.set(P1[0], P1[1], P1[2]); // hold — the camera is parked
    return;
  }
  out.set(
    crAxis(P0[0], P1[0], P2[0], P3[0], t),
    crAxis(P0[1], P1[1], P2[1], P3[1], t),
    crAxis(P0[2], P1[2], P2[2], P3[2], t),
  );
}

function Rig({ progress, sheetRatio }: { progress: MutableRefObject<number>; sheetRatio?: MutableRefObject<number> }) {
  const { camera } = useThree();
  const tgt = useRef(new THREE.Vector3(0, 0.12, 0));
  // persistent smoothed pointer offset — damps toward the raw pointer each frame
  // so the parallax floats instead of twitching (applied below the rail base)
  const ptr = useRef(new THREE.Vector2(0, 0));
  useFrame((state, delta) => {
    const p = progress.current;
    const i = segIndex(p);
    const a = CAM[i], b = CAM[i + 1];
    const t = THREE.MathUtils.clamp((p - a.p) / (b.p - a.p || 1), 0, 1);
    // cushion the dock arrival and the final settle
    const e = b.p === 0.075 || b.p === 1.0 ? ss(t, 0, 1) : t;
    sampleRail("pos", i, e, camera.position);
    sampleRail("tgt", i, e, tgt.current);
    // portrait rescue — the hero pose frames all three vessels only above
    // ~1.15 aspect; on narrow screens pull back + widen the lens so the whole
    // assembly stays in frame. MUST be gone by p=0.10: the dock's ink
    // registration is derived from the unmodified rail.
    const cam = camera as THREE.PerspectiveCamera;
    const narrow = THREE.MathUtils.clamp((1.15 - cam.aspect) / 0.5, 0, 1);
    const heroW = narrow * (1 - ss(p, 0.05, 0.075));
    if (heroW > 0) {
      camera.position.z += heroW * 4.5;
      camera.position.x *= 1 - heroW * 0.3;
      camera.position.y += heroW * 0.2;
      // the hero look-target is shoved left (machine right, copy left) on wide
      // screens; on portrait there's no room for that — recentre it AND raise
      // it so the machine drops into the lower frame, clear of the top copy
      tgt.current.x *= 1 - heroW * 0.85;
      tgt.current.y += heroW * 1.05;
    }
    // dock registration zoom (Phase 1): the canvas is full-bleed but the ink
    // is drawn at SHEET scale — camera.zoom scales the NDC image uniformly
    // about centre (sheet centre == canvas centre), which is an EXACT remap
    // of the calibrated projection. Engages with the dock, releases with reg.
    const zoomW = ss(p, 0.03, 0.075) * (1 - ss(p, 0.26, 0.33));
    // pointer parallax (Phase 2) — the suspended machine answers the cursor
    // everywhere except the trace dock, where registration owns the frame
    const par = 1 - zoomW;
    // damp the smoothed offset toward the live pointer (frame-rate independent),
    // then add it on top of the rail-set base — re-based every frame by
    // sampleRail above, so it never accumulates
    ptr.current.x = THREE.MathUtils.damp(ptr.current.x, state.pointer.x, POINTER_LAMBDA, delta);
    ptr.current.y = THREE.MathUtils.damp(ptr.current.y, state.pointer.y, POINTER_LAMBDA, delta);
    camera.position.x += ptr.current.x * 0.16 * par;
    camera.position.y += ptr.current.y * 0.09 * par;
    camera.up.set(0, 1, 0);
    camera.lookAt(tgt.current);
    // subtle dolly-zoom "breath" — the lens pushes in at each vessel visit
    const fov = 38 - interiorMax(p) * 5 + heroW * 10;
    const zoom = lerp(1, Math.min(sheetRatio?.current ?? 1, 1), zoomW);
    if (Math.abs(cam.fov - fov) > 0.01 || Math.abs(cam.zoom - zoom) > 0.001) {
      cam.fov = fov;
      cam.zoom = zoom;
      cam.updateProjectionMatrix();
    }
  });
  return null;
}

function VesselAssembly({ progress }: { progress: MutableRefObject<number> }) {
  const assy = useRef<THREE.Group>(null);
  const sumpMats = useRef<(THREE.MeshPhysicalMaterial | null)[]>([]);
  const domeMats = useRef<(THREE.MeshPhysicalMaterial | null)[]>([]);
  const cartMats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const coreMats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const flowGroups = useRef<(THREE.Group | null)[]>([]);
  const ringMats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const headGroups = useRef<(THREE.Group | null)[]>([]);
  const cartGroups = useRef<(THREE.Group | null)[]>([]);
  // the sump assembly (bowl, dome, o-ring, seam, drain, label, light ring)
  // moves as ONE part on the service beat — see the useFrame comment there
  const sumpGroups = useRef<(THREE.Group | null)[]>([]);
  const ringMeshes = useRef<(THREE.Mesh | null)[]>([]);
  const boreLight = useRef<THREE.PointLight>(null);
  // Phase 3: printed label wraps (ghost with their sump) + cartridge end caps
  const labelMatRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const capMatRefs = useRef<(THREE.MeshStandardMaterial | null)[][]>([[], [], []]);
  // detail-pass housing hardware (o-ring, seam, drain) — ghosts with its sump
  const housingExtraMats = useRef<(THREE.MeshStandardMaterial | null)[][]>([[], [], []]);
  const actionRefs = useRef<(THREE.Mesh | null)[][]>([[], [], []]);
  const actionGroups = useRef<(THREE.Group | null)[]>([]);
  const sparkRefs = useRef<(THREE.Mesh | null)[]>([]);
  const [labelsOn, setLabelsOn] = useState(false);
  // Phase 2 interactivity: hovered vessel (ring brighten + tooltip) and the
  // explode card currently expanded
  const [hover, setHover] = useState<number | null>(null);
  const [openCard, setOpenCard] = useState<number | null>(null);

  // procedural micro-roughness — real steel is never a perfect mirror. Fine
  // grayscale noise + faint vertical brush streaks break the reflection into
  // physical brushed metal (multiplies the roughness scalar).
  const roughMap = useMemo(() => {
    if (typeof document === "undefined") return null;
    const s = 512;
    const cv = document.createElement("canvas");
    cv.width = cv.height = s;
    const g = cv.getContext("2d");
    if (!g) return null;
    const img = g.createImageData(s, s);
    for (let i = 0; i < s * s; i++) {
      const v = 168 + Math.floor(Math.random() * 66); // ~0.66–0.92
      img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
      img.data[i * 4 + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    g.globalAlpha = 0.045;
    g.strokeStyle = "#d2d2d2";
    for (let x = 0; x < s; x++)
      if (Math.random() < 0.22) {
        g.beginPath();
        g.moveTo(x + 0.5, 0);
        g.lineTo(x + 0.5, s);
        g.stroke();
      }
    const tex = new THREE.CanvasTexture(cv);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 3);
    tex.anisotropy = 4;
    return tex;
  }, []);

  // brushed-grain bump — hairline vertical strokes give the steel a tactile
  // machined grain (light catches individual brush lines)
  const bumpMap = useMemo(() => {
    if (typeof document === "undefined") return null;
    const s = 512;
    const cv = document.createElement("canvas");
    cv.width = cv.height = s;
    const g = cv.getContext("2d");
    if (!g) return null;
    g.fillStyle = "#808080";
    g.fillRect(0, 0, s, s);
    for (let x = 0; x < s; x++) {
      if (Math.random() < 0.6) {
        const tone = 128 + (Math.random() - 0.5) * 44;
        g.globalAlpha = 0.25 + Math.random() * 0.5;
        g.strokeStyle = `rgb(${tone | 0},${tone | 0},${tone | 0})`;
        g.beginPath();
        const seg0 = Math.random() * s * 0.5;
        g.moveTo(x + 0.5, seg0);
        g.lineTo(x + 0.5, seg0 + s * (0.3 + Math.random() * 0.7));
        g.stroke();
      }
    }
    const tex = new THREE.CanvasTexture(cv);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 2);
    tex.anisotropy = 4;
    return tex;
  }, []);

  // granule bed for the KDF cartridge — black GAC + copper body + glinting
  // brass KDF flecks (the §A-KDF "bed of loose granules" read)
  const granuleMap = useMemo(() => {
    if (typeof document === "undefined") return null;
    const s = 256;
    const cv = document.createElement("canvas");
    cv.width = cv.height = s;
    const g = cv.getContext("2d");
    if (!g) return null;
    g.fillStyle = "#7c4c28";
    g.fillRect(0, 0, s, s);
    for (let k = 0; k < 2400; k++) {
      const r = Math.random();
      g.fillStyle = r < 0.48 ? "#14181d" : r < 0.76 ? "#a97142" : "#e2a55e";
      const sz = 1 + Math.random() * 2.4;
      g.fillRect(Math.random() * s, Math.random() * s, sz, sz);
    }
    const tex = new THREE.CanvasTexture(cv);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);
    tex.anisotropy = 4;
    return tex;
  }, []);

  /* ── Phase 3 — the cartridges become MANUFACTURED PARTS, not primitives ── */

  // V1: pleated spun-poly — vertical facet shading + fibre noise (map + bump)
  const pleatMaps = useMemo(() => {
    if (typeof document === "undefined") return null;
    const w = 512, h = 128;
    const mk = () => {
      const cv = document.createElement("canvas");
      cv.width = w;
      cv.height = h;
      return cv;
    };
    const col = mk(), bmp = mk();
    const gc = col.getContext("2d"), gb = bmp.getContext("2d");
    if (!gc || !gb) return null;
    const PLEATS = 36;
    const pw = w / PLEATS;
    for (let i = 0; i < PLEATS; i++) {
      const x0 = i * pw;
      // each pleat: bright ridge → shadowed valley (triangle shading)
      const grad = gc.createLinearGradient(x0, 0, x0 + pw, 0);
      grad.addColorStop(0, "#d9d6cd");
      grad.addColorStop(0.45, "#f4f2ec");
      grad.addColorStop(0.55, "#f4f2ec");
      grad.addColorStop(1, "#c9c6bc");
      gc.fillStyle = grad;
      gc.fillRect(x0, 0, pw, h);
      const bg = gb.createLinearGradient(x0, 0, x0 + pw, 0);
      bg.addColorStop(0, "#404040");
      bg.addColorStop(0.5, "#ffffff");
      bg.addColorStop(1, "#404040");
      gb.fillStyle = bg;
      gb.fillRect(x0, 0, pw, h);
    }
    // fibre speckle
    for (let k = 0; k < 1600; k++) {
      gc.fillStyle = Math.random() < 0.5 ? "rgba(255,255,255,0.25)" : "rgba(120,116,105,0.18)";
      gc.fillRect(Math.random() * w, Math.random() * h, 1, 1 + Math.random() * 2);
    }
    const map = new THREE.CanvasTexture(col);
    const bump = new THREE.CanvasTexture(bmp);
    [map, bump].forEach((t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(2, 1);
      t.anisotropy = 8;
    });
    map.colorSpace = THREE.SRGBColorSpace;
    return { map, bump };
  }, []);

  // V3: extruded carbon block — matte black, fine speckle, faint striations
  const carbonMap = useMemo(() => {
    if (typeof document === "undefined") return null;
    const s = 256;
    const cv = document.createElement("canvas");
    cv.width = cv.height = s;
    const g = cv.getContext("2d");
    if (!g) return null;
    g.fillStyle = "#191c20";
    g.fillRect(0, 0, s, s);
    for (let x = 0; x < s; x += 6) {
      g.fillStyle = `rgba(0,0,0,${0.1 + 0.12 * Math.abs(Math.sin(x * 0.7))})`;
      g.fillRect(x, 0, 2, s);
    }
    for (let k = 0; k < 2600; k++) {
      const r = Math.random();
      g.fillStyle = r < 0.55 ? "#0d0f12" : r < 0.85 ? "#262b31" : "#3a4149";
      g.fillRect(Math.random() * s, Math.random() * s, 1, 1 + Math.random());
    }
    const tex = new THREE.CanvasTexture(cv);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 2);
    tex.anisotropy = 8;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  // the hollow core reads as RISING WATER — an animated streak map scrolled
  // upward in useFrame (emissive so it stays luminous through the ghost wall)
  const coreFlowMap = useMemo(() => {
    if (typeof document === "undefined") return null;
    const w = 64, h = 256;
    const cv = document.createElement("canvas");
    cv.width = w;
    cv.height = h;
    const g = cv.getContext("2d");
    if (!g) return null;
    g.fillStyle = "#0f7c9e";
    g.fillRect(0, 0, w, h);
    for (let k = 0; k < 90; k++) {
      const x = Math.random() * w;
      const y0 = Math.random() * h;
      const len = 20 + Math.random() * 70;
      const grad = g.createLinearGradient(0, y0, 0, y0 + len);
      grad.addColorStop(0, "rgba(220,248,255,0)");
      grad.addColorStop(0.5, `rgba(190,240,255,${0.25 + Math.random() * 0.5})`);
      grad.addColorStop(1, "rgba(220,248,255,0)");
      g.fillStyle = grad;
      g.fillRect(x, y0, 1 + Math.random() * 2, len);
    }
    const tex = new THREE.CanvasTexture(cv);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 1.4);
    tex.anisotropy = 4;
    return tex;
  }, []);

  // machined faces — concentric turning marks (roughness variation) for the
  // head caps; reads as billet, not extruded primitive
  const spinMap = useMemo(() => {
    if (typeof document === "undefined") return null;
    const s = 256;
    const cv = document.createElement("canvas");
    cv.width = cv.height = s;
    const g = cv.getContext("2d");
    if (!g) return null;
    g.fillStyle = "#8a8a8a";
    g.fillRect(0, 0, s, s);
    for (let r = 4; r < s * 0.72; r += 2 + Math.random() * 3) {
      g.strokeStyle = `rgba(${Math.random() < 0.5 ? "255,255,255" : "40,40,40"},${0.05 + Math.random() * 0.1})`;
      g.lineWidth = 1;
      g.beginPath();
      g.arc(s / 2, s / 2, r, 0, Math.PI * 2);
      g.stroke();
    }
    const tex = new THREE.CanvasTexture(cv);
    tex.anisotropy = 8;
    return tex;
  }, []);

  // pressure-gauge dials — white face, black ticks, red zone, per-vessel needle
  const gaugeMaps = useMemo(() => {
    if (typeof document === "undefined") return null;
    return [0.38, 0.52, 0.47].map((needle) => {
      const s = 256;
      const cv = document.createElement("canvas");
      cv.width = cv.height = s;
      const g = cv.getContext("2d")!;
      const c = s / 2;
      g.fillStyle = "#f4f4f0";
      g.beginPath();
      g.arc(c, c, c, 0, Math.PI * 2);
      g.fill();
      // sweep: 225° → -45° (classic gauge)
      const a0 = Math.PI * 1.25, a1 = -Math.PI * 0.25;
      const at = (t: number) => a0 + (a1 - a0) * t;
      // red zone (last 20%)
      g.strokeStyle = "#c23b2a";
      g.lineWidth = 14;
      g.beginPath();
      g.arc(c, c, c - 26, -at(0.8), -at(1), true);
      g.stroke();
      // ticks + numerals
      g.fillStyle = "#15181c";
      g.strokeStyle = "#15181c";
      for (let k = 0; k <= 10; k++) {
        const t = k / 10;
        const a = at(t);
        const big = k % 2 === 0;
        g.lineWidth = big ? 5 : 2.5;
        g.beginPath();
        g.moveTo(c + Math.cos(a) * (c - 20), c - Math.sin(a) * (c - 20));
        g.lineTo(c + Math.cos(a) * (c - (big ? 44 : 34)), c - Math.sin(a) * (c - (big ? 44 : 34)));
        g.stroke();
        if (big) {
          g.font = "700 26px Arial";
          g.textAlign = "center";
          g.textBaseline = "middle";
          g.fillText(String(k * 20), c + Math.cos(a) * (c - 66), c - Math.sin(a) * (c - 66));
        }
      }
      g.font = "600 22px Arial";
      g.fillText("PSI", c, c + 44);
      // needle
      const na = at(needle);
      g.strokeStyle = "#c23b2a";
      g.lineWidth = 7;
      g.lineCap = "round";
      g.beginPath();
      g.moveTo(c - Math.cos(na) * 20, c + Math.sin(na) * 20);
      g.lineTo(c + Math.cos(na) * (c - 52), c - Math.sin(na) * (c - 52));
      g.stroke();
      g.fillStyle = "#15181c";
      g.beginPath();
      g.arc(c, c, 12, 0, Math.PI * 2);
      g.fill();
      const tex = new THREE.CanvasTexture(cv);
      tex.anisotropy = 8;
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    });
  }, []);

  // printed vinyl label wraps on the sumps — "the product has printed text on
  // it" does more for real-not-rendition than any shader
  const labelMaps = useMemo(() => {
    if (typeof document === "undefined") return null;
    return VESSELS.map((v) => {
      // 640×410 ≈ the strip's world aspect (arc 1.19 × height 0.76)
      const w = 640, h = 410;
      const cv = document.createElement("canvas");
      cv.width = w;
      cv.height = h;
      const g = cv.getContext("2d")!;
      g.fillStyle = "#f2f3ee";
      g.fillRect(0, 0, w, h);
      g.strokeStyle = "#12324a";
      g.lineWidth = 6;
      g.strokeRect(10, 10, w - 20, h - 20);
      // header band
      g.fillStyle = "#12324a";
      g.fillRect(10, 10, w - 20, 64);
      g.fillStyle = "#f2f3ee";
      g.font = "700 36px Arial, sans-serif";
      g.fillText("NEXT GEN", 30, 56);
      g.font = "400 26px Arial, sans-serif";
      g.textAlign = "right";
      g.fillText("NGW-01", w - 30, 55);
      g.textAlign = "left";
      // stage number + title
      g.fillStyle = "#12324a";
      g.font = "800 92px Arial, sans-serif";
      g.fillText(`STAGE ${Number(v.n)}`, 28, 186);
      g.font = "600 34px Arial, sans-serif";
      g.fillText(v.title.toUpperCase(), 28, 246);
      g.font = "400 24px monospace";
      g.fillStyle = "#3c5a70";
      g.fillText(v.sub, 28, 292);
      // divider + footer row
      g.strokeStyle = "#c9ccc2";
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(28, 330);
      g.lineTo(w - 28, 330);
      g.stroke();
      g.fillStyle = "#3c5a70";
      g.font = "400 22px monospace";
      g.fillText("MAX 100 PSI*  ·  4.5″ × 20″  ·  FLOW →", 28, 372);
      const tex = new THREE.CanvasTexture(cv);
      tex.anisotropy = 8;
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    });
  }, []);

  /* ---- per-vessel interior ACTIONS (the doc's "what working looks like") ----
     V1: rust/silt particles spiral inward and decelerate INTO the fibre mat.
     V2: contaminant ions drift onto the granule bed while redox sparks fire
         (electron-transfer micro-events on the copper-zinc surface).
     V3: pale scale flecks shrink away as the media captures them. */
  // depthWrite:false everywhere (review-confirmed): invisible transparent
  // spheres must not write depth into the pass and punch holes in ghosts
  const actionMats = useMemo(
    () => [
      [
        new THREE.MeshStandardMaterial({ color: "#8a4a30", roughness: 0.88, transparent: true, opacity: 0, depthWrite: false }),
        new THREE.MeshStandardMaterial({ color: "#8a8378", roughness: 0.85, transparent: true, opacity: 0, depthWrite: false }),
      ],
      [
        new THREE.MeshStandardMaterial({ color: "#3a4149", roughness: 0.6, transparent: true, opacity: 0, depthWrite: false }),
        new THREE.MeshStandardMaterial({
          color: "#7fe4ff",
          emissive: "#29c2ee",
          emissiveIntensity: 2.4,
          toneMapped: false,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        }),
      ],
      [new THREE.MeshStandardMaterial({ color: "#e8ecef", roughness: 0.5, transparent: true, opacity: 0, depthWrite: false })],
    ],
    [],
  );
  type ASpec = { angle: number; phase: number; speed: number; y: number; size: number; mi: number };
  const actionSpecs = useMemo<ASpec[][]>(() => {
    const R = Math.random;
    const mk = (n: number, speed: [number, number], size: [number, number], twoMats: boolean): ASpec[] =>
      Array.from({ length: n }, () => ({
        angle: R() * Math.PI * 2,
        phase: R(),
        speed: speed[0] + R() * (speed[1] - speed[0]),
        y: -1.15 + R() * 1.45,
        size: size[0] + R() * (size[1] - size[0]),
        mi: twoMats && R() > 0.55 ? 1 : 0,
      }));
    return [mk(12, [0.1, 0.18], [0.022, 0.046], true), mk(10, [0.12, 0.2], [0.02, 0.04], false), mk(8, [0.07, 0.12], [0.024, 0.044], false)];
  }, []);
  const sparkSpecs = useMemo(
    () =>
      Array.from({ length: 8 }, (_, k) => ({
        angle: (k / 8) * Math.PI * 2 + Math.random() * 0.5,
        y: -1.05 + (k / 8) * 1.35 + Math.random() * 0.15,
        phase: Math.random() * Math.PI * 2,
        freq: 1.6 + Math.random() * 1.3,
      })),
    [],
  );
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(1, 10, 8), []);

  /* ---- CUTAWAY CARTRIDGE textures ----
     The section face of a graded-density sediment cartridge: three bands,
     coarse (outer, fluffier, more open) to fine (inner, denser), with faint
     fibre grain and a hairline where each layer meets the next. This is what
     the media looks like when you cut it — and it's the Section A–A language
     the drawing already speaks. No text on it (image text is composited in
     the HUD, never drawn). */
  const sectionMap = useMemo(() => {
    if (typeof document === "undefined") return null;
    const W = 256, H = 512;
    const cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    const g = cv.getContext("2d");
    if (!g) return null;
    // u runs from the CORE (0) to the OUTER surface (1) — bands by radius:
    // core wall 0–0.06, fine 0.06–0.36, mid 0.36–0.66, coarse 0.66–1
    const bands: [number, number, string][] = [
      [0, 0.06, "#2a2e33"],
      [0.06, 0.36, "#d9d3c4"],
      [0.36, 0.66, "#e6e1d5"],
      [0.66, 1.0, "#f1eee6"],
    ];
    for (const [a, c, col] of bands) { g.fillStyle = col; g.fillRect(a * W, 0, (c - a) * W + 1, H); }
    // fibre grain — coarser and more open toward the outside
    const img = g.getImageData(0, 0, W, H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const u = x / W;
      if (u < 0.06) continue;
      const open = 0.35 + u * 0.65; // how "open" the fibre is
      const n = (Math.random() - 0.5) * 34 * open;
      const i4 = (y * W + x) * 4;
      img.data[i4] += n; img.data[i4 + 1] += n; img.data[i4 + 2] += n;
    }
    g.putImageData(img, 0, 0);
    // hairlines between layers
    g.fillStyle = "rgba(60,58,52,0.55)";
    for (const u of [0.36, 0.66]) g.fillRect(u * W - 1, 0, 2, H);
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  }, []);

  /* perforated core tube — a rigid tube with a grid of holes; the risen water
     shows through them and through the section cut */
  const perfMap = useMemo(() => {
    if (typeof document === "undefined") return null;
    const S = 256;
    const cv = document.createElement("canvas");
    cv.width = cv.height = S;
    const g = cv.getContext("2d");
    if (!g) return null;
    g.fillStyle = "#fff"; g.fillRect(0, 0, S, S);
    g.fillStyle = "#000";
    const cols = 8, rows = 8;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const cx = ((c + 0.5 + (r % 2) * 0.5) / cols) * S, cy = ((r + 0.5) / rows) * S;
      g.beginPath(); g.arc(cx % S, cy, S / cols * 0.22, 0, Math.PI * 2); g.fill();
    }
    const tex = new THREE.CanvasTexture(cv);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 6);
    return tex;
  }, []);
  // every cartridge material for a vessel, so the whole cutaway fades as one
  const cartMatList = useRef<THREE.Material[][]>([[], [], []]);
  const regCart = (i: number) => (m: THREE.Material | null) => {
    if (m && !cartMatList.current[i].includes(m)) cartMatList.current[i].push(m);
  };

  /* ---- Slice 3: THE TRANSFORMATION (filter-reference SA-KDF) ----
     dirty water visibly enters at the mains -> each stage does watchable
     chemistry -> clean still water rises at the house-out side. Events are
     time-driven but window-gated: they play while the camera dwells and
     are fully scroll-reversible. */

  // dirty inflow: rust flakes / grey silt / pale scale flecks drifting
  // along the feed pipe into V1 during the PROBLEM beat
  const inflowMats = useMemo(
    () => [
      new THREE.MeshStandardMaterial({ color: "#8a4a30", roughness: 0.9, transparent: true, opacity: 0, depthWrite: false }),
      new THREE.MeshStandardMaterial({ color: "#8a8378", roughness: 0.9, transparent: true, opacity: 0, depthWrite: false }),
      new THREE.MeshStandardMaterial({ color: "#c3ced4", roughness: 0.55, transparent: true, opacity: 0, depthWrite: false }),
    ],
    [],
  );
  const inflowSpecs = useMemo(
    () =>
      Array.from({ length: 16 }, (_, k) => ({
        phase: (k / 16 + Math.random() * 0.05) % 1,
        speed: 0.09 + Math.random() * 0.07,
        dy: (Math.random() - 0.5) * 0.1,
        dz: (Math.random() - 0.5) * 0.16,
        size: 0.016 + Math.random() * 0.022,
        mi: k % 3,
      })),
    [],
  );
  const inflowRefs = useRef<(THREE.Mesh | null)[]>([]);
  const inflowGroup = useRef<THREE.Group | null>(null);

  // KDF micro-events on the bed (V2): lead PLATES on as a growing metallic
  // skin; H2S collapses into black copper-sulphide grains that STICK;
  // chlorine DEFUSES into a pair of harmless ions that wash up to the core
  const platingMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#cdd6dc", metalness: 1, roughness: 0.22, transparent: true, opacity: 0, depthWrite: false }),
    [],
  );
  const platingSpecs = useMemo(
    () => [
      { angle: -0.55, y: -0.15 },
      { angle: 0.25, y: -0.75 },
      { angle: 0.85, y: 0.3 },
      { angle: -1.05, y: -1.05 },
    ],
    [],
  );
  const platingRefs = useRef<(THREE.Mesh | null)[]>([]);
  const h2sGasMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#b8c4cb", emissive: "#8fa3ad", emissiveIntensity: 0.22, transparent: true, opacity: 0, depthWrite: false }),
    [],
  );
  const h2sGrainMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#0b0d10", roughness: 0.95, transparent: true, opacity: 0, depthWrite: false }),
    [],
  );
  const h2sSpecs = useMemo(
    () =>
      Array.from({ length: 4 }, (_, k) => ({
        angle: -0.9 + k * 0.55,
        y: -1.0 + k * 0.42,
        phase: k * 0.27,
        speed: 0.16 + (k % 2) * 0.05,
      })),
    [],
  );
  const h2sGasRefs = useRef<(THREE.Mesh | null)[]>([]);
  const h2sGrainRefs = useRef<(THREE.Mesh | null)[]>([]);
  const clGasMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#d3dadf", emissive: "#9aa5ad", emissiveIntensity: 0.35, transparent: true, opacity: 0, depthWrite: false }),
    [],
  );
  const clIonMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#eef2f5", emissive: "#c9d3da", emissiveIntensity: 0.4, transparent: true, opacity: 0, depthWrite: false }),
    [],
  );
  const clSpecs = useMemo(
    () =>
      Array.from({ length: 3 }, (_, k) => ({
        angle: 0.5 - k * 0.85,
        y: -0.55 + k * 0.5,
        phase: 0.15 + k * 0.31,
        speed: 0.14 + k * 0.02,
      })),
    [],
  );
  const clGasRefs = useRef<(THREE.Mesh | null)[]>([]);
  const clIonRefs = useRef<(THREE.Mesh | null)[][]>([[], [], []]);

  // clean exit: still, clear water rising at the house-out elbow (PROOF)
  const exitMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#dff6ff", emissive: "#7fd8f5", emissiveIntensity: 0.7, transparent: true, opacity: 0, depthWrite: false }),
    [],
  );
  const exitSpecs = useMemo(
    () =>
      Array.from({ length: 9 }, (_, k) => ({
        phase: k / 9,
        speed: 0.16 + Math.random() * 0.06,
        dx: (Math.random() - 0.5) * 0.14,
        dz: (Math.random() - 0.5) * 0.14,
        size: 0.02 + Math.random() * 0.02,
      })),
    [],
  );
  const exitRefs = useRef<(THREE.Mesh | null)[]>([]);
  const exitGroup = useRef<THREE.Group | null>(null);
  const exitLight = useRef<THREE.PointLight | null>(null);
  // meniscus caps make the rising cores read WET
  const menisMats = useRef<(THREE.MeshPhysicalMaterial | null)[]>([]);
  // ONE shared frame/cage material — one opacity drive fades the whole cage
  // out during the ink trace (the SVG plate doesn't draw the frame)
  const frameMat = useMemo(() => new THREE.MeshStandardMaterial({ ...FRAME, transparent: true }), []);
  useEffect(() => {
    // powder-coat isn't one roughness value — give the frame the noise map,
    // tiled fine, so the finish has the faint orange-peel a coated frame has
    if (!roughMap) return;
    const t = roughMap.clone();
    t.needsUpdate = true;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(3, 3);
    frameMat.roughnessMap = t;
    frameMat.needsUpdate = true;
  }, [frameMat, roughMap]);
  const tabGeo = useMemo(() => tabGeometry(0.52, 0.34, 0.14, 0.055), []);
  const gussetGeo = useMemo(() => gussetGeometry(0.22, 0.05), []);
  const supplyMat = useMemo(() => new THREE.MeshStandardMaterial({ ...MACHINED, transparent: true }), []);
  const outMat = useMemo(() => new THREE.MeshStandardMaterial({ ...MACHINED, transparent: true }), []);

  useFrame((state, delta) => {
    const p = progress.current;
    const g = assy.current;
    const dock = ss(p, 0.03, 0.075); // settled to dock (drift stops BEFORE the trace)
    const reg = ss(p, 0.26, 0.33); // dock framing → journey framing (plate exits into the PROBLEM beat)
    // the cage fades out through the ink trace (the SVG plate draws only the
    // vessels), full at the hero and after the plate exits
    const traceHold = ss(p, 0.06, 0.09) * (1 - ss(p, 0.3, 0.34));
    frameMat.opacity = 1 - traceHold;
    frameMat.depthWrite = frameMat.opacity > 0.5;
    const w = interiorWindows(p);
    const through = Math.max(...w);
    // time-staggered deconstruction: heads lift first (in a slight wave),
    // cartridges follow per-vessel; reassembly mirrors it (carts seat, then
    // heads close) under the INSTALL beat, into the settle
    const reformCarts = ss(p, 0.92, 0.945);
    const reformHeads = ss(p, 0.935, 0.96);
    const reform = ss(p, 0.92, 0.96);
    const explode = ss(p, 0.82, 0.92) * (1 - reform); // overall scalar (opacities/labels)

    // hysteresis: on at 0.5, off at 0.38 — parking the scrub near a single
    // threshold used to strobe the labels against their 0.45s CSS transition
    const wantLabels = labelsOn ? explode > 0.38 : explode > 0.5;
    if (wantLabels !== labelsOn) {
      setLabelsOn(wantLabels);
      if (!wantLabels) setOpenCard(null); // cards never linger past the beat
    }

    if (g) {
      // dock registration: the SVG plate draws the assembly at ~0.78 scale,
      // centred 60px left of the sheet centre and higher than world origin —
      // computed from the camera projection, then tuned against ink overlays
      g.position.x = lerp(-0.4, 0, reg);
      g.position.y = lerp(0.56, 0, reg);
      g.scale.setScalar(lerp(0.781, 1, reg));
      // The rest pose is SET. This used to add a 0.35rad yaw plus a continuous
      // elapsedTime spin and a vertical bob before the dock — the machine
      // rotated and floated on the hero, and read as a turntable render. A
      // product at rest doesn't move. Yaw 0 also means the rest pose IS the
      // dock pose, so the photoreal still, the live 3D and the ink trace share
      // one registration and can dissolve into each other without a jump.
      g.rotation.y = 0;
    }

    // per-vessel: sump ghosts in its window; cartridge fades in (and stays
    // visible through the service explode); flow guides live only in-window
    for (let i = 0; i < 3; i++) {
      const sm = sumpMats.current[i];
      if (sm) {
        sm.opacity = lerp(1, 0.12, w[i]);
        sm.depthWrite = sm.opacity > 0.5;
      }
      const dm = domeMats.current[i];
      if (dm) {
        dm.opacity = lerp(1, 0.12, w[i]);
        dm.depthWrite = dm.opacity > 0.5;
      }
      // the cartridge is ALWAYS physically there — fully opaque inside its
      // housing (the sump simply hides it until a lid lifts or a wall ghosts),
      // easing to 0.85 only inside the interior window so the emissive core
      // reads through the media wall. Nothing ever fades in or 'appears'.
      const cm = cartMats.current[i];
      if (cm) cm.opacity = lerp(1, 0.85, w[i]);
      cartMatList.current[i].forEach((m) => { m.opacity = lerp(1, 0.9, w[i]); });
      capMatRefs.current[i].forEach((m) => {
        if (m) m.opacity = lerp(1, 0.85, w[i]);
      });
      // the printed label ghosts in step with its sump wall
      const lm = labelMatRefs.current[i];
      if (lm) {
        lm.opacity = lerp(1, 0.1, w[i]);
        lm.depthWrite = lm.opacity > 0.5;
      }
      // housing hardware (o-ring / seam / drain) ghosts with the sump too
      housingExtraMats.current[i].forEach((m) => {
        if (m) {
          m.opacity = lerp(1, 0.12, w[i]);
          m.depthWrite = m.opacity > 0.5;
        }
      });
      const km = coreMats.current[i];
      if (km) km.opacity = w[i] * 0.85;
      const fg = flowGroups.current[i];
      if (fg) fg.visible = w[i] > 0.05;
      // interior action particles (radial capture motion, per the reference doc)
      // — the whole group is visibility-gated so 0-opacity spheres don't draw
      actionMats[i].forEach((m) => (m.opacity = w[i]));
      const ag = actionGroups.current[i];
      if (ag) ag.visible = w[i] > 0.02;
      if (w[i] > 0.02) {
        const tt = state.clock.elapsedTime;
        actionSpecs[i].forEach((s, k) => {
          const mesh = actionRefs.current[i][k];
          if (!mesh) return;
          const t01 = (tt * s.speed + s.phase) % 1;
          const eased = 1 - (1 - t01) * (1 - t01); // decelerates INTO the media wall
          // graded depth: big rust flakes stop at the coarse outer surface,
          // finer silt lodges deeper — the whole point of a 10/5/1 cartridge
          const rStop = i === 0 ? lerp(0.24, 0.4, (s.size - 0.022) / 0.024) : 0.415;
          const r = lerp(0.6, rStop, eased);
          mesh.position.set(Math.sin(s.angle) * r, s.y - t01 * 0.1, Math.cos(s.angle) * r);
          const sc = i === 2 ? s.size * (1 - eased * 0.85) : s.size; // V3: flecks dissolve
          mesh.scale.setScalar(Math.max(sc, 1e-4));
        });
      }
      const rm = ringMats.current[i];
      if (rm) {
        // damp BOTH directions toward the single target (hover -> 2.2, else the
        // scroll-driven base) so the ring eases in/out instead of snapping
        const ringTarget = hover === i && p > 0.26 ? 2.2 : lerp(1.1, 0.15, through);
        rm.emissiveIntensity = THREE.MathUtils.damp(rm.emissiveIntensity, ringTarget, HOVER_EMISSIVE_LAMBDA, delta);
      }
      // SERVICE — the way the real housing is actually serviced.
      //
      // On a Big Blue housing the head is bolted to the manifold plate and
      // NEVER moves; the sump screws UP into it (docs/filter-reference.md).
      // The old animation lifted the heads and raised the cartridges, which is
      // (a) mechanically wrong and (b) exactly why they phased straight
      // through the top plate — the plate is what the heads are mounted to.
      //
      // Now, per vessel, staggered: the sump UNSCREWS (a visible turn) and
      // drops just enough to clear the threads, then comes FORWARD out of the
      // open-fronted cage and sets down in front of it. The cartridge stays
      // where it was, revealed hanging under the fixed head. Nothing goes up.
      // Nothing passes through steel. Reassembly mirrors it: sump back, then
      // screws home.
      const unscrew = ss(p, 0.82 + i * 0.012, 0.85 + i * 0.012) * (1 - reformHeads);
      const pullOut = ss(p, 0.845 + i * 0.012, 0.905 + i * 0.012) * (1 - reformCarts);
      const sg = sumpGroups.current[i];
      if (sg) {
        sg.rotation.y = -unscrew * 1.75; // just over a quarter turn — reads as a turn, not a spin
        sg.position.y = -0.14 * unscrew - 0.06 * pullOut; // thread clearance, then down onto the floor
        sg.position.z = 1.36 * pullOut; // clears the front bottom rail (z 0.705) plus the sump radius (0.62)
      }
      const rg = ringMeshes.current[i];
      if (rg) {
        rg.position.y = -1.5 - 0.14 * unscrew - 0.06 * pullOut;
        rg.position.z = 1.36 * pullOut;
      }
      const hg = headGroups.current[i];
      if (hg) hg.position.y = 0; // heads are fixed to the plate
      const cg = cartGroups.current[i];
      if (cg) cg.position.y = 0; // cartridge revealed in place, not lifted
    }

    // the core water RISES — scroll the streak map while any interior is open
    if (coreFlowMap && through > 0.01) coreFlowMap.offset.y -= delta * 0.55;

    // KDF redox sparks — brief electron-transfer flashes on the granule bed
    // (only animated while V2's window is open; the group is hidden otherwise)
    if (w[1] > 0.02) {
      const tt = state.clock.elapsedTime;
      sparkSpecs.forEach((s, k) => {
        const m = sparkRefs.current[k];
        if (!m) return;
        const pulse = Math.max(0, Math.sin(tt * s.freq + s.phase));
        m.scale.setScalar(0.01 + Math.pow(pulse, 8) * 0.055);
      });
    }

    // ---- Slice 3: the transformation plays while the camera dwells ----
    const tt2 = state.clock.elapsedTime;
    // dirty inflow INSIDE the mains supply run (PROBLEM beat -> V1 arrival).
    // Two things were wrong before: the stream faded in at 0.26 while the
    // frame and pipework were still ghosted for the ink trace (until 0.34), so
    // the particles floated in empty black; and the path started at x=-3.55,
    // left of the elbow, where no pipe existed at all. Now the stream can't
    // start until the frame is solid, it travels inside a real supply pipe
    // that turns translucent to show it, and it ends at V1's inlet.
    const wIn = ss(p, 0.335, 0.375) * (1 - ss(p, 0.41, 0.45));
    supplyMat.opacity = (1 - traceHold) * (1 - 0.72 * wIn);
    supplyMat.depthWrite = supplyMat.opacity > 0.5;
    if (inflowGroup.current) inflowGroup.current.visible = wIn > 0.02;
    if (wIn > 0.02) {
      inflowSpecs.forEach((sp, k) => {
        const m = inflowRefs.current[k];
        if (!m) return;
        const t01 = (tt2 * sp.speed + sp.phase) % 1;
        // x: from well inside the supply run to V1's inlet boss; y/z: bounded
        // to the pipe bore (r 0.11) so nothing drifts outside the wall
        m.position.set(-5.0 + t01 * 2.45, 0.9 + sp.dy * 0.9 + Math.sin(t01 * 9 + k) * 0.03, sp.dz * 0.5);
        m.scale.setScalar(sp.size);
      });
      inflowMats.forEach((m) => (m.opacity = wIn * 0.9));
    } else {
      inflowMats.forEach((m) => (m.opacity = 0));
    }

    // KDF micro-events (V2's window drives them)
    const w2live = w[1];
    // the lead skin GROWS as you push deeper into the visit (scroll-tied)
    const plateProg = THREE.MathUtils.clamp((p - 0.47) / 0.105, 0, 1);
    platingRefs.current.forEach((m) => {
      if (m) m.scale.setScalar(0.012 + plateProg * 0.05);
    });
    platingMat.opacity = w2live;
    if (w2live > 0.02) {
      h2sSpecs.forEach((sp, k) => {
        const gas = h2sGasRefs.current[k];
        const grain = h2sGrainRefs.current[k];
        if (!gas || !grain) return;
        const t01 = (tt2 * sp.speed + sp.phase) % 1;
        const sx = Math.sin(sp.angle);
        const cz = Math.cos(sp.angle);
        if (t01 < 0.7) {
          const r = lerp(0.62, 0.418, t01 / 0.7);
          gas.position.set(sx * r, sp.y, cz * r);
          gas.scale.setScalar(0.03);
          grain.scale.setScalar(1e-4);
        } else {
          gas.scale.setScalar(1e-4);
          grain.position.set(sx * 0.415, sp.y, cz * 0.415);
          grain.scale.setScalar(Math.sin(((t01 - 0.7) / 0.3) * Math.PI) * 0.032);
        }
      });
      clSpecs.forEach((sp, k) => {
        const gas = clGasRefs.current[k];
        const ions = clIonRefs.current[k];
        if (!gas) return;
        const t01 = (tt2 * sp.speed + sp.phase) % 1;
        const sx = Math.sin(sp.angle);
        const cz = Math.cos(sp.angle);
        if (t01 < 0.6) {
          const r = lerp(0.64, 0.43, t01 / 0.6);
          gas.position.set(sx * r, sp.y, cz * r);
          gas.scale.setScalar(0.028);
          ions.forEach((io) => io && io.scale.setScalar(1e-4));
        } else {
          gas.scale.setScalar(1e-4);
          const u = (t01 - 0.6) / 0.4;
          const env = Math.sin(u * Math.PI) * 0.016;
          ions.forEach((io, j) => {
            if (!io) return;
            const r = lerp(0.43, 0.14, u);
            io.position.set(sx * r + (j ? 0.05 : -0.05), sp.y + u * 0.8, cz * r);
            io.scale.setScalar(env);
          });
        }
      });
      h2sGasMat.opacity = w2live * 0.95;
      h2sGrainMat.opacity = w2live;
      clGasMat.opacity = w2live * 0.95;
      clIonMat.opacity = w2live * 0.9;
    } else {
      h2sGasMat.opacity = h2sGrainMat.opacity = clGasMat.opacity = clIonMat.opacity = 0;
    }

    // clean exit: the payoff. Clear water LEAVES along the house-out run —
    // inside the pipe, which turns translucent to show it, mirroring how the
    // dirty water arrived on the other side. It used to bubble UP out of the
    // elbow into open air, which is not something water in a closed pipe does,
    // and it left droplets floating in black through the credibility orbit.
    const wOut = ss(p, 0.69, 0.72) * (1 - ss(p, 0.78, 0.82));
    outMat.opacity = (1 - traceHold) * (1 - 0.72 * wOut);
    outMat.depthWrite = outMat.opacity > 0.5;
    if (exitGroup.current) exitGroup.current.visible = wOut > 0.02;
    if (exitLight.current) exitLight.current.intensity = wOut * 0.9;
    if (wOut > 0.02) {
      exitSpecs.forEach((sp, k) => {
        const m = exitRefs.current[k];
        if (!m) return;
        const t01 = (tt2 * sp.speed + sp.phase) % 1;
        // along the pipe bore, out toward the house (+x)
        m.position.set(3.3 + t01 * 1.25, 0.9 + sp.dz * 0.5 + Math.sin(t01 * 7 + k) * 0.025, sp.dx * 0.5);
        m.scale.setScalar(sp.size * (0.55 + 0.45 * Math.sin(t01 * Math.PI)));
      });
      exitMat.opacity = wOut * 0.95;
    } else {
      exitMat.opacity = 0;
    }

    // wet cores: meniscus rides the window; a caustic pulse breathes the glow
    for (let i = 0; i < 3; i++) {
      const mm = menisMats.current[i];
      if (mm) mm.opacity = w[i] * 0.85;
      const km2 = coreMats.current[i];
      if (km2) km2.emissiveIntensity = 1.15 + Math.sin(tt2 * 2.6 + i * 1.7) * 0.28 * w[i];
    }

    // interior glow tracks the active vessel (soft, breathing), and its colour
    // tells the water's story: murky at V1, coppery-neutral at V2, clean at V3
    if (boreLight.current) {
      const sum = w[0] + w[1] + w[2];
      const x = sum > 0.001 ? (w[0] * VESSELS[0].x + w[1] * VESSELS[1].x + w[2] * VESSELS[2].x) / sum : 0;
      boreLight.current.position.x = x;
      const breathe = 1 + Math.sin(state.clock.elapsedTime * 2.1) * 0.12;
      boreLight.current.intensity = through * 0.5 * breathe;
      if (through > 0.02)
        boreLight.current.color.set(w[0] >= w[1] && w[0] >= w[2] ? "#efe6d8" : w[1] >= w[2] ? "#dbe9f0" : "#d6e6ee");
    }
  });

  return (
    <group ref={assy}>
      {/* interior glow (window-driven; slides to the active vessel) */}
      {!hidden("borelight") && (
        // cool white-cyan, not saturated cyan — saturated cyan × copper = green
        <pointLight ref={boreLight} position={[0, -0.3, 0.5]} color="#cfeef8" intensity={0} distance={3.2} decay={2} />
      )}

      {/* Slice 3 — dirty water IN at the mains (PROBLEM beat) */}
      <group ref={inflowGroup} visible={false}>
        {inflowSpecs.map((sp, k) => (
          <mesh
            key={`in${k}`}
            ref={(el) => {
              inflowRefs.current[k] = el;
            }}
            geometry={sphereGeo}
            material={inflowMats[sp.mi]}
            scale={sp.size}
          />
        ))}
      </group>
      {/* Slice 3 — clean water OUT at the house side (PROOF beat) */}
      <group ref={exitGroup} visible={false}>
        {exitSpecs.map((sp, k) => (
          <mesh
            key={`ex${k}`}
            ref={(el) => {
              exitRefs.current[k] = el;
            }}
            geometry={sphereGeo}
            material={exitMat}
            scale={sp.size}
          />
        ))}
        <pointLight ref={exitLight} position={[3.9, 0.95, 0.55]} color="#dff3fb" intensity={0} distance={2.4} decay={2} />
      </group>

      {/* ── the open charcoal steel FRAME/CAGE — the FHWR-3SI-20 silhouette:
          the vessels hang from a top manifold plate INSIDE a rectangular tube
          frame (per the real product photos) + series pipework.

          Every member is a ROUNDED box now, not a sharp one. Real steel tube
          and plate have an edge radius, and that radius is what catches the
          highlight — sharp CG boxes read as CG no matter what the material
          does. Plus the hardware a welded, bolted frame actually carries:
          hex bolts + washers where the plate meets the posts and where each
          head bracket bolts through the plate, corner gussets at the joints,
          a mounting tab with real through-holes, and a powder-coat roughness
          map so the finish is not one uniform value. ── */}
      {!hidden("kit") && (
        <>
          {/* top manifold plate the vessels hang from */}
          <RoundedBox args={[5.72, 0.14, 1.5]} radius={0.022} smoothness={4} material={frameMat} position={[0, 1.33, 0]} />
          {/* head mounting brackets — each head bolts up through the plate via
              a short cast bracket; two bolt heads show on the plate top */}
          {VESSELS.map((v) => (
            <group key={`hbr${v.n}`} position={[v.x, 0, 0]}>
              <RoundedBox args={[0.98, 0.09, 0.62]} radius={0.014} smoothness={3} material={frameMat} position={[0, 1.215, 0]} />
              {[-0.34, 0.34].map((bx) => (
                <group key={bx} position={[bx, 1.4, 0]}>
                  <mesh position={[0, 0.012, 0]}>
                    <cylinderGeometry args={[0.058, 0.058, 0.014, 20]} />
                    <meshStandardMaterial {...MACHINED} />
                  </mesh>
                  <mesh position={[0, 0.045, 0]}>
                    <cylinderGeometry args={[0.04, 0.04, 0.05, 6]} />
                    <meshStandardMaterial {...MACHINED} metalness={0.9} roughness={0.38} />
                  </mesh>
                </group>
              ))}
            </group>
          ))}
          {/* four corner posts */}
          {([[-2.72, 0.66], [2.72, 0.66], [-2.72, -0.66], [2.72, -0.66]] as const).map(([px, pz], k) => (
            <RoundedBox key={`post${k}`} args={[0.09, 3.28, 0.09]} radius={0.012} smoothness={3} material={frameMat} position={[px, -0.3, pz]} />
          ))}
          {/* bottom rectangle rails */}
          <RoundedBox args={[5.53, 0.09, 0.09]} radius={0.012} smoothness={3} material={frameMat} position={[0, -1.9, 0.66]} />
          <RoundedBox args={[5.53, 0.09, 0.09]} radius={0.012} smoothness={3} material={frameMat} position={[0, -1.9, -0.66]} />
          <RoundedBox args={[0.09, 0.09, 1.41]} radius={0.012} smoothness={3} material={frameMat} position={[-2.72, -1.9, 0]} />
          <RoundedBox args={[0.09, 0.09, 1.41]} radius={0.012} smoothness={3} material={frameMat} position={[2.72, -1.9, 0]} />
          {/* top side rails tie the posts to the plate corners */}
          <RoundedBox args={[0.09, 0.12, 1.41]} radius={0.012} smoothness={3} material={frameMat} position={[-2.72, 1.27, 0]} />
          <RoundedBox args={[0.09, 0.12, 1.41]} radius={0.012} smoothness={3} material={frameMat} position={[2.72, 1.27, 0]} />
          {/* plate-to-post bolts at the four top corners */}
          {([[-2.72, 0.66], [2.72, 0.66], [-2.72, -0.66], [2.72, -0.66]] as const).map(([px, pz], k) => (
            <group key={`pb${k}`} position={[px, 1.4, pz]}>
              <mesh position={[0, 0.012, 0]}>
                <cylinderGeometry args={[0.062, 0.062, 0.014, 20]} />
                <meshStandardMaterial {...MACHINED} />
              </mesh>
              <mesh position={[0, 0.048, 0]}>
                <cylinderGeometry args={[0.042, 0.042, 0.055, 6]} />
                <meshStandardMaterial {...MACHINED} metalness={0.9} roughness={0.38} />
              </mesh>
            </group>
          ))}
          {/* corner gussets — welded into the bottom post/rail joints. Real
              frames are stiffened; floating tubes that just touch read as a
              render. */}
          {([[-2.72, 0.66, 1], [2.72, 0.66, -1], [-2.72, -0.66, 1], [2.72, -0.66, -1]] as const).map(([px, pz, dir], k) => (
            <mesh
              key={`gus${k}`}
              geometry={gussetGeo}
              material={frameMat}
              position={[px + dir * 0.045, -1.855, pz]}
              rotation={[0, 0, dir > 0 ? 0 : Math.PI / 2]}
            />
          ))}
          {/* mounting tab, top-left, with two REAL through-holes */}
          <mesh geometry={tabGeo} material={frameMat} position={[-3.06, 1.33, 0]} />

          {/* series pipework (mains → V1 → V2 → V3 → house), under the plate */}
          {[-2.94, -0.95, 0.95, 2.94].map((x, i) => (
            <mesh key={x} material={frameMat} position={[x, 1.0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.11, 0.11, i === 0 || i === 3 ? 0.6 : 0.44, 20]} />
            </mesh>
          ))}
          {/* mains-in / house-out elbows */}
          {[-3.22, 3.22].map((x) => (
            <mesh key={x} material={frameMat} position={[x, 0.9, 0]}>
              <sphereGeometry args={[0.14, 18, 14]} />
            </mesh>
          ))}
          {/* the mains SUPPLY run, arriving from off-left into the elbow. The
              dirty-water stream travels inside it and the pipe turns
              translucent to show that (supplyMat, useFrame). Before this
              existed the stream had nothing to be in. */}
          <mesh material={supplyMat} position={[-4.35, 0.9, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.11, 0.11, 2.3, 24, 1, true]} />
          </mesh>
          {/* house-out run, mirrored — goes translucent while clean water is
              shown leaving through it (outMat, useFrame) */}
          <mesh material={outMat} position={[3.9, 0.9, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.11, 0.11, 1.4, 24, 1, true]} />
          </mesh>
        </>
      )}

      {VESSELS.map((v, i) => (
        <group
          key={v.n}
          position={[v.x, 0, 0]}
          // Phase 2 — the machine answers touch: hover brightens this vessel's
          // ring + raises its label; click flies the scroll to its beat.
          // Gated past the dock so nothing fights the ink trace.
          onPointerOver={(e) => {
            if (progress.current < 0.26) return;
            e.stopPropagation();
            setHover(i);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHover((h) => (h === i ? null : h));
            document.body.style.cursor = "";
          }}
          onClick={(e) => {
            if (progress.current < 0.26 || progress.current > 0.8) return;
            e.stopPropagation();
            const el = document.getElementById("drawing");
            if (!el) return;
            const y = el.offsetTop + VESSEL_BEAT_P[i] * (el.offsetHeight - window.innerHeight);
            window.scrollTo({ top: y, behavior: "smooth" });
          }}
        >
          {/* head / cap (lifts on the service explode) */}
          {!hidden("caps") && (
            <group
              ref={(el) => {
                headGroups.current[i] = el;
              }}
            >
              <mesh position={[0, 1.0, 0]}>
                <cylinderGeometry args={[0.74, 0.74, 0.52, 48]} />
                {/* matte charcoal cap (the real heads are dark, not chrome) */}
                <meshStandardMaterial {...HEAD} roughnessMap={spinMap ?? undefined} />
              </mesh>
              {/* pressure-release button */}
              <mesh position={[0, 1.32, 0]}>
                <cylinderGeometry args={[0.09, 0.09, 0.14, 16]} />
                <meshStandardMaterial {...MACHINED} />
              </mesh>
              {/* head collar detail */}
              <mesh position={[0, 0.78, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.68, 0.028, 10, 48]} />
                <meshStandardMaterial {...MACHINED} />
              </mesh>
              {/* wrench lugs — eight around the rim, the service-tool grip */}
              {Array.from({ length: 8 }, (_, k) => {
                const a = (k * Math.PI) / 4;
                return (
                  <mesh key={`lug${k}`} position={[Math.sin(a) * 0.72, 1.13, Math.cos(a) * 0.72]} rotation={[0, a, 0]}>
                    <boxGeometry args={[0.1, 0.17, 0.07]} />
                    <meshStandardMaterial {...MACHINED} />
                  </mesh>
                );
              })}
              {/* brass IN/OUT connector ports (the distinctive gold accent) */}
              {[-0.7, 0.7].map((px) => (
                <group key={`boss${px}`} position={[px, 1.0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <mesh>
                    <cylinderGeometry args={[0.135, 0.135, 0.11, 6]} />
                    <meshStandardMaterial {...MACHINED} />
                  </mesh>
                  {/* brass threaded insert seated in the port mouth */}
                  <mesh position={[0, px < 0 ? -0.055 : 0.055, 0]}>
                    <cylinderGeometry args={[0.088, 0.088, 0.05, 20]} />
                    <meshStandardMaterial {...BRASS} />
                  </mesh>
                </group>
              ))}
              {/* pressure gauge on the head face — dial per vessel */}
              {gaugeMaps && (
                <group position={[0, 1.05, 0.72]}>
                  <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.035, 0.035, 0.16, 12]} />
                    <meshStandardMaterial {...MACHINED} />
                  </mesh>
                  <mesh position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.13, 0.13, 0.07, 32]} />
                    <meshPhysicalMaterial {...CAPS} />
                  </mesh>
                  <mesh position={[0, 0, 0.19]}>
                    <torusGeometry args={[0.122, 0.018, 10, 40]} />
                    <meshStandardMaterial {...MACHINED} />
                  </mesh>
                  <mesh position={[0, 0, 0.187]}>
                    <circleGeometry args={[0.112, 32]} />
                    <meshStandardMaterial map={gaugeMaps[i]} roughness={0.35} metalness={0} />
                  </mesh>
                </group>
              )}
            </group>
          )}

          {/* sump (ghosts during this vessel's window). Grouped so the whole
              bowl — dome, o-ring, seam, drain, printed label — unscrews and
              comes away as one part on the service beat. */}
          {!hidden("housing") && (
            <group
              ref={(el) => {
                sumpGroups.current[i] = el;
              }}
            >
              <mesh position={[0, -0.4, 0]}>
                <cylinderGeometry args={[0.62, 0.62, 2.3, 48]} />
                <meshPhysicalMaterial
                  ref={(el) => {
                    sumpMats.current[i] = el;
                  }}
                  {...STEEL}
                  roughnessMap={roughMap ?? undefined}
                  bumpMap={bumpMap ?? undefined}
                  bumpScale={0.012}
                  transparent
                  opacity={1}
                />
              </mesh>
              {/* shallow domed base (flattened to match the GA's rounded foot) */}
              <mesh position={[0, -1.55, 0]} scale={[1, 0.32, 1]}>
                <sphereGeometry args={[0.62, 40, 18, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
                <meshPhysicalMaterial
                  ref={(el) => {
                    domeMats.current[i] = el;
                  }}
                  {...CAPS}
                  transparent
                />
              </mesh>
              {/* housing hardware — o-ring seat, rolled seam, drain plug
                  (ghost with the sump; the o-ring stays when the head lifts,
                  exactly like the real service moment) */}
              <mesh position={[0, 0.745, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.615, 0.02, 10, 48]} />
                <meshStandardMaterial
                  ref={(el) => {
                    housingExtraMats.current[i][0] = el;
                  }}
                  color="#101214"
                  roughness={0.92}
                  transparent
                />
              </mesh>
              <mesh position={[0, 0.52, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.622, 0.007, 8, 48]} />
                <meshStandardMaterial
                  ref={(el) => {
                    housingExtraMats.current[i][1] = el;
                  }}
                  color="#4c565e"
                  metalness={1}
                  roughness={0.5}
                  transparent
                />
              </mesh>
              <mesh position={[0, -1.77, 0]}>
                <cylinderGeometry args={[0.06, 0.06, 0.07, 6]} />
                <meshStandardMaterial
                  ref={(el) => {
                    housingExtraMats.current[i][2] = el;
                  }}
                  {...MACHINED}
                  transparent
                />
              </mesh>
              {/* Phase 3: printed vinyl label wrap (~109° facing front) —
                  ghosts with its sump during the interior dive */}
              {labelMaps && (
                <mesh position={[0, -0.34, 0]}>
                  <cylinderGeometry args={[0.625, 0.625, 0.76, 48, 1, true, -0.95, 1.9]} />
                  <meshStandardMaterial
                    ref={(el) => {
                      labelMatRefs.current[i] = el;
                    }}
                    map={labelMaps[i]}
                    roughness={0.5}
                    metalness={0}
                    transparent
                    side={THREE.FrontSide}
                  />
                </mesh>
              )}
            </group>
          )}

          {/* cartridge (revealed in-window; rises out on the explode).
              depthWrite OFF + core renderOrder (review-confirmed): otherwise the
              cartridge depth-occludes the core and "up the core" never renders. */}
          {!hidden("stages") && (
            <group
              ref={(el) => {
                cartGroups.current[i] = el;
              }}
            >
              {/* ── the cartridge, SECTIONED. A 90° wedge is cut from the front
                  (toward the camera's parked position for this vessel) so the
                  media reads in section: for stage 1, three graded layers —
                  coarse outside, fine inside — around a perforated core; for
                  2 and 3, the granule bed / carbon block cut through. This is
                  what the inside of a filter looks like, and it is the drawing's
                  own Section A–A made physical, instead of a textured tube
                  ghosted through a translucent shell. ── */}
              {(() => {
                const TH0 = Math.PI * 0.3, THL = Math.PI * 1.4; // 108° wedge open toward +z — wide enough that both section faces read from the parked camera
                const H = 2.05, Y = -0.42;
                const layers: { r: number; color: string; useMap: boolean }[] =
                  i === 0
                    ? [
                        { r: 0.4, color: "#ffffff", useMap: true },
                        { r: 0.31, color: "#e6e1d5", useMap: false },
                        { r: 0.22, color: "#d9d3c4", useMap: false },
                      ]
                    : [{ r: 0.4, color: "#ffffff", useMap: true }];
                const secMap = i === 0 ? sectionMap : i === 1 ? granuleMap : carbonMap;
                const face = (theta: number, rIn: number, rOut: number, key: string) => (
                  <mesh
                    key={key}
                    position={[Math.sin(theta) * (rIn + rOut) / 2, Y, Math.cos(theta) * (rIn + rOut) / 2]}
                    rotation={[0, theta - Math.PI / 2, 0]}
                  >
                    <planeGeometry args={[rOut - rIn, H]} />
                    <meshStandardMaterial
                      ref={regCart(i)}
                      map={secMap ?? undefined}
                      color={secMap ? "#ffffff" : v.cart}
                      roughness={0.95}
                      metalness={i === 1 ? 0.35 : 0}
                      side={THREE.DoubleSide}
                      transparent
                      opacity={0}
                      depthWrite={false}
                    />
                  </mesh>
                );
                return (
                  <>
                    {layers.map((L, li) => (
                      <mesh key={`layer${li}`} position={[0, Y, 0]}>
                        <cylinderGeometry args={[L.r, L.r, H, 48, 1, true, TH0, THL]} />
                        <meshStandardMaterial
                          ref={li === 0 ? (el) => { cartMats.current[i] = el; regCart(i)(el); } : regCart(i)}
                          color={L.useMap && (i === 0 ? pleatMaps : i === 1 ? granuleMap : carbonMap) ? "#ffffff" : L.color}
                          map={L.useMap ? (i === 0 ? pleatMaps?.map ?? undefined : i === 1 ? granuleMap ?? undefined : carbonMap ?? undefined) : undefined}
                          bumpMap={L.useMap && i === 0 ? pleatMaps?.bump ?? undefined : undefined}
                          bumpScale={L.useMap && i === 0 ? 0.035 : 0}
                          metalness={i === 1 ? v.cartMetal : 0.02}
                          roughness={i === 0 ? 0.92 : i === 1 ? v.cartRough : 0.82}
                          side={THREE.DoubleSide}
                          transparent
                          depthWrite={false}
                          opacity={0}
                        />
                      </mesh>
                    ))}
                    {/* section faces on both cut planes — one quad per layer.
                        The stage-1 section map spans core→outer in u, so a
                        single full-radius quad carries all three bands. */}
                    {i === 0
                      ? [TH0, -TH0].map((th, k) => face(th, 0.1, 0.4, `sec${k}`))
                      : [TH0, -TH0].map((th, k) => face(th, 0.1, 0.4, `sec${k}`))}
                    {/* perforated core tube — the rigid part the water rises
                        inside; wedge-cut with the media so the column shows */}
                    <mesh position={[0, Y, 0]}>
                      <cylinderGeometry args={[0.1, 0.1, H, 32, 1, true, TH0, THL]} />
                      <meshStandardMaterial
                        ref={regCart(i)}
                        color="#1e2226"
                        roughness={0.7}
                        metalness={0.05}
                        alphaMap={perfMap ?? undefined}
                        alphaTest={0.5}
                        side={THREE.DoubleSide}
                        transparent
                        opacity={0}
                        depthWrite={false}
                      />
                    </mesh>
                  </>
                );
              })()}
              {/* moulded end caps — the "this is a replaceable part" cue.
                  Wedge-cut with the media so the section reads as one cut. */}
              {[1.02, -1.02].map((dy, ci) => (
                <mesh key={dy} position={[0, -0.42 + dy, 0]}>
                  <cylinderGeometry args={[0.43, 0.43, 0.07, 40, 1, false, Math.PI * 0.3, Math.PI * 1.4]} />
                  <meshStandardMaterial
                    ref={(el) => {
                      capMatRefs.current[i][ci] = el;
                    }}
                    color={["#e3e1d8", "#23282e", "#0e1114"][i]}
                    roughness={0.55}
                    metalness={0.05}
                    side={THREE.DoubleSide}
                    transparent
                    depthWrite={false}
                    opacity={0}
                  />
                </mesh>
              ))}
              {/* hollow core the filtered water rises through (draws after the
                  cartridge so its glow reads through the ghosted media wall) */}
              <mesh position={[0, -0.42, 0]} renderOrder={2}>
                <cylinderGeometry args={[0.085, 0.085, 2.08, 20]} />
                {/* Phase 3: the core is RISING WATER — animated streak map,
                    scrolled in useFrame, not a flat glowing stick */}
                <meshStandardMaterial
                  ref={(el) => {
                    coreMats.current[i] = el;
                  }}
                  color="#7fc4dd"
                  map={coreFlowMap ?? undefined}
                  emissive="#1f9ec4"
                  emissiveMap={coreFlowMap ?? undefined}
                  /* Was 1.15, which saturated the whole surface to a uniform
                     glow and drowned the streak map — the flat glowing stick
                     this material's own comment says it isn't. Dropped so the
                     map's variation is what you actually see, and the column
                     reads as moving water rather than a lit plastic rod. */
                  emissiveIntensity={0.38}
                  roughness={0.14}
                  metalness={0}
                  transparent
                  depthWrite={false}
                  opacity={0}
                />
              </mesh>
              {/* Slice 3 — meniscus cap: the risen water column reads WET */}
              <mesh position={[0, 0.64, 0]} scale={[1, 0.4, 1]} renderOrder={3}>
                <sphereGeometry args={[0.083, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshPhysicalMaterial
                  ref={(el) => {
                    menisMats.current[i] = el;
                  }}
                  color="#bfe9f7"
                  roughness={0.05}
                  clearcoat={1}
                  clearcoatRoughness={0.08}
                  transparent
                  opacity={0}
                  depthWrite={false}
                />
              </mesh>
              {/* Phase 2 — the label RIDES the lifted cartridge and is a real
                  interactive text space: leader draws → tag letters → the tag
                  expands into a spec card on click/keyboard */}
              <Html position={[0.55, 0.2, 0.4]} zIndexRange={[30, 10]} className="xlabel-wrap">
                <div
                  className={`xlabel ${labelsOn || (hover === i && progress.current > 0.26) ? "on" : ""} ${openCard === i ? "is-open" : ""}`.trim()}
                  aria-hidden={!labelsOn && hover !== i}
                >
                  <span className="xl-leader" aria-hidden="true" />
                  <button
                    type="button"
                    className="xl-tag"
                    tabIndex={labelsOn ? 0 : -1}
                    aria-expanded={openCard === i}
                    onClick={() => setOpenCard(openCard === i ? null : i)}
                  >
                    <b>{v.n}</b>
                    <span>{v.title}</span>
                    <i className="xl-plus" aria-hidden="true">
                      {openCard === i ? "–" : "+"}
                    </i>
                  </button>
                  <div className="xl-card">
                    <dl>
                      <div>
                        <dt>MEDIA</dt>
                        <dd>{v.media}</dd>
                      </div>
                      <div>
                        <dt>RATING</dt>
                        <dd>{v.rating}</dd>
                      </div>
                      <div>
                        <dt>SERVICE</dt>
                        <dd>{v.service}</dd>
                      </div>
                    </dl>
                    <div className="xl-chips">
                      {v.removes.map((r) => (
                        <span key={r}>{r}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Html>
            </group>
          )}

          {/* radial-flow guides: DOWN the annulus, IN through the wall, UP the
              core — Phase 3: soft water STREAKS (capsules), not bare cones */}
          {!hidden("flow") && (
            <group
              ref={(el) => {
                flowGroups.current[i] = el;
              }}
              visible={false}
            >
              {/* annulus streaks (staggered around the front half) */}
              {[
                [0.52, 0.42, 0.12],
                [-0.44, -0.02, 0.3],
                [0.28, -0.5, 0.45],
              ].map((pos, k) => (
                <mesh key={k} position={pos as [number, number, number]}>
                  <capsuleGeometry args={[0.011, 0.3, 3, 10]} />
                  <meshBasicMaterial
                    color="#8fdcf7"
                    transparent
                    opacity={0.34}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                  />
                </mesh>
              ))}
              {/* inward streaks punching through the media wall */}
              {[
                [0.5, -0.85, 0.0],
                [-0.5, -0.85, 0.0],
              ].map((pos, k) => (
                <mesh key={k} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
                  <capsuleGeometry args={[0.01, 0.24, 3, 10]} />
                  <meshBasicMaterial
                    color="#a8e6fb"
                    transparent
                    opacity={0.28}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                  />
                </mesh>
              ))}
              {/* core up-streak */}
              <mesh position={[0, 0.62, 0]}>
                <capsuleGeometry args={[0.014, 0.4, 3, 10]} />
                <meshBasicMaterial
                  color="#9fe8ff"
                  transparent
                  opacity={0.4}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                  toneMapped={false}
                />
              </mesh>
            </group>
          )}

          {/* interior actions — the "what working looks like" micro-events
              (visibility-gated per window in useFrame) */}
          {!hidden("actions") && (
            <group
              ref={(el) => {
                actionGroups.current[i] = el;
              }}
              visible={false}
            >
              {actionSpecs[i].map((s, k) => (
                <mesh
                  key={`a${k}`}
                  ref={(el) => {
                    actionRefs.current[i][k] = el;
                  }}
                  geometry={sphereGeo}
                  material={actionMats[i][s.mi]}
                  scale={s.size}
                />
              ))}
              {i === 1 &&
                sparkSpecs.map((s, k) => (
                  <mesh
                    key={`sp${k}`}
                    ref={(el) => {
                      sparkRefs.current[k] = el;
                    }}
                    geometry={sphereGeo}
                    material={actionMats[1][1]}
                    position={[Math.sin(s.angle) * 0.415, s.y, Math.cos(s.angle) * 0.415]}
                    scale={0.01}
                  />
                ))}
              {/* Slice 3 — the redox close-ups (filter-reference SA-KDF):
                  lead plating skins, H2S -> black CuS grains, chlorine
                  defusing into ion pairs that wash up to the core */}
              {i === 1 && (
                <>
                  {platingSpecs.map((sp, k) => (
                    <mesh
                      key={`pl${k}`}
                      ref={(el) => {
                        platingRefs.current[k] = el;
                      }}
                      geometry={sphereGeo}
                      material={platingMat}
                      position={[Math.sin(sp.angle) * 0.405, sp.y, Math.cos(sp.angle) * 0.405]}
                      scale={0.012}
                    />
                  ))}
                  {h2sSpecs.map((sp, k) => (
                    <group key={`hs${k}`}>
                      <mesh
                        ref={(el) => {
                          h2sGasRefs.current[k] = el;
                        }}
                        geometry={sphereGeo}
                        material={h2sGasMat}
                        scale={0.03}
                      />
                      <mesh
                        ref={(el) => {
                          h2sGrainRefs.current[k] = el;
                        }}
                        geometry={sphereGeo}
                        material={h2sGrainMat}
                        scale={0.0001}
                      />
                    </group>
                  ))}
                  {clSpecs.map((sp, k) => (
                    <group key={`cl${k}`}>
                      <mesh
                        ref={(el) => {
                          clGasRefs.current[k] = el;
                        }}
                        geometry={sphereGeo}
                        material={clGasMat}
                        scale={0.028}
                      />
                      {[0, 1].map((j) => (
                        <mesh
                          key={j}
                          ref={(el) => {
                            clIonRefs.current[k][j] = el;
                          }}
                          geometry={sphereGeo}
                          material={clIonMat}
                          scale={0.0001}
                        />
                      ))}
                    </group>
                  ))}
                </>
              )}
            </group>
          )}

          {/* cyan brand ring seated at the sump base — travels with the sump
              when it comes away on the service beat */}
          <mesh
            ref={(el) => {
              ringMeshes.current[i] = el;
            }}
            position={[0, -1.5, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            visible={!hidden("ring")}
          >
            <torusGeometry args={[0.655, 0.015, 12, 64]} />
            <meshStandardMaterial
              ref={(el) => {
                ringMats.current[i] = el;
              }}
              color="#29c2ee"
              emissive="#29c2ee"
              emissiveIntensity={1.1}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function ChromeStage({ progress, active, sheetRatio, onReady }: Props) {
  const dofRef = useRef<{ target?: THREE.Vector3; bokehScale: number; cocMaterial?: { worldFocusRange: number } } | null>(null);
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 2]}
      camera={{ position: [0, 0.12, 8.8], fov: 38 }}
      // OPAQUE canvas: blending ghosted layers against an alpha framebuffer and
      // letting the BROWSER composite produces a milky wash. The full-bleed
      // canvas paints its own pool-of-light (Backdrop) from the SAME stops as
      // the page CSS — one continuous space, no seam at the cross-fade.
      gl={{ alpha: false, antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl, scene }) => {
        // Phase 3: Khronos PBR Neutral — ACES washed the metals into "CG
        // chrome"; Neutral keeps colour and contrast like product photography
        gl.toneMapping = THREE.NeutralToneMapping;
        gl.toneMappingExposure = 1.12;
        gl.setClearColor("#0a121b", 1);
        // far edges of the machine melt into the space's ambient tone —
        // barely reaches the assembly, only the pipe extremities at distance
        scene.fog = new THREE.Fog(BACKDROP_FOG, 12, 28);
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Backdrop />
      {/* PURE IN-SCENE STUDIO (no HDR file): the environment is baked from
          Lightformers on the first frame — zero network fetch, so the machine
          is lit the instant the chunk runs. Two tall strips give the sump
          flanks their signature streaks (the anisotropy stretches them), a
          large warm overhead rounds the head shoulders, a floor bounce lifts
          the domes, and a dim backdrop sheet keeps reflections alive from
          every camera angle. The window-dive env scrub dims all of it. */}
      <Environment resolution={256} frames={1} environmentIntensity={0.82}>
        {/* signature vertical streaks */}
        <Lightformer form="rect" position={[-6, 1, 4]} rotation-y={Math.PI / 2.6} scale={[1.1, 7, 1]} intensity={6.5} color="#eaf3fa" />
        <Lightformer form="rect" position={[6, 1, 4]} rotation-y={-Math.PI / 2.6} scale={[1.1, 7, 1]} intensity={6.5} color="#eaf3fa" />
        {/* broad soft KEY, camera-front-left — carries the body of the steel */}
        <Lightformer form="rect" position={[-3, 2.5, 7]} rotation-y={Math.PI / 8} rotation-x={-Math.PI / 14} scale={[7, 5, 1]} intensity={2.8} color="#f4f9fc" />
        {/* warm overhead softbox rounds the head shoulders */}
        <Lightformer form="rect" position={[0, 8, 2]} rotation-x={-Math.PI / 2} scale={[10, 6, 1]} intensity={3.2} color="#fdf4e6" />
        {/* floor bounce lifts the domes */}
        <Lightformer form="rect" position={[0, -7, 3]} rotation-x={Math.PI / 2} scale={[9, 5, 1]} intensity={1.3} color="#a4a8ac" />
        {/* dim sheets behind + in front keep reflections alive at every angle */}
        <Lightformer form="rect" position={[0, 1.5, -7]} scale={[12, 8, 1]} intensity={1.5} color="#4c5054" />
        <Lightformer form="rect" position={[0, 0.5, 8]} rotation-y={Math.PI} scale={[11, 7, 1]} intensity={1.1} color="#33373b" />
      </Environment>

      <JourneyLights progress={progress} />

      <VesselAssembly progress={progress} />
      <Rig progress={progress} sheetRatio={sheetRatio} />
      <FocusRig progress={progress} dof={dofRef} />
      <Ready onReady={onReady} />
      {typeof window !== "undefined" && new URLSearchParams(window.location.search).has("ngdbgray") && <DebugRay />}

      {!hidden("shadows") && (
        <ContactShadows position={[0, -1.955, 0]} opacity={0.6} scale={16} blur={2.6} far={5.5} color="#000000" />
      )}

      {!hidden("post") && (
        <EffectComposer>
          {/* Phase 3 lens: focus rides the discussed part (FocusRig), off at
              the trace dock */}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <DepthOfField ref={dofRef as any} target={[0, -0.1, 0]} focalLength={0.004} bokehScale={1.3} />
          {/* bloom OFF the metal speculars (the #1 CG tell) — only genuinely
              emissive things (rings, redox sparks) may glow */}
          <Bloom intensity={0.34} luminanceThreshold={0.92} luminanceSmoothing={0.3} mipmapBlur />
          {/* lens fringe kept to the frame edges — dead-centre chrome stays clinically sharp */}
          <ChromaticAberration offset={CA_OFFSET} radialModulation modulationOffset={0.3} />
          <Vignette eskil={false} offset={0.26} darkness={0.55} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
