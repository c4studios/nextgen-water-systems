"use client";

/**
 * THE MACHINE, ASSEMBLED.
 *
 * The FHWR-3S1-20 as the supplier ships it and as the installer hangs it:
 * three 20 × 4.5 inch housings on a black tube frame under a solid plate,
 * two gauges standing on the plate, the heads plumbed in series with brass,
 * copper in from the mains on the left and out to the house on the right, and
 * the clip-on steel cover over the lot, lettered NEXT GEN.
 *
 * Everything the page animates is reachable through one handle: the cover
 * group (it lifts), the bowl groups (they unscrew and set down), the
 * cartridge groups (they hang and lift out), a section wedge per housing (two
 * clipping planes; opening the wedge cuts the bowl and the cartridge open like
 * an engineering section), a flow scalar per housing (water particles run
 * the real path: down the outside of the cartridge, in through the media, up
 * the core), and a highlight per housing for the taste check.
 */
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { LOCKUP } from "./lockupPaths";
import { BOWL, CARTRIDGE, COVER, COVER_Y, COVER_Z, FRAME, FRAME_TOP, GAUGE, HEAD, HOUSING_X, PIPE, POST_X, POST_Z, TUBE } from "./dims";
import {
  bowlGeometry,
  capGeometry,
  collarRibsGeometry,
  coreGeometry,
  coverGeometries,
  earGeometry,
  elbowGeometry,
  gaugeBezelGeometry,
  gaugeCaseGeometry,
  gaugeDialGeometry,
  gaugeGlassGeometry,
  headGeometry,
  hexGeometry,
  makeDialTexture,
  pipeGeometry,
  plateGeometry,
  portGeometry,
  threadsGeometry,
  tubeGeometry,
} from "./geometry";
import type { MachineMaterials } from "./materials";

export type MachineHandle = {
  cover: THREE.Group | null;
  lockup: THREE.Group | null;
  housings: (THREE.Group | null)[];
  bowls: (THREE.Group | null)[];
  cartridges: (THREE.Group | null)[];
  runs: THREE.Group | null;
  needles: (THREE.Object3D | null)[];
  /** the section wedge per housing: two world-space planes, kept by the frame loop */
  planes: [THREE.Plane, THREE.Plane][];
  /** wedge half-angle per housing, radians; 0 closes the section */
  cut: number[];
  /** water running through each housing, 0..1 */
  flow: number[];
  /** taste-check highlight per housing, 0..1 */
  lit: number[];
  /** the bowl material per housing, for the highlight */
  bowlMats: THREE.MeshPhysicalMaterial[];
};

export function createMachineHandle(): MachineHandle {
  return {
    cover: null,
    lockup: null,
    housings: [null, null, null],
    bowls: [null, null, null],
    cartridges: [null, null, null],
    runs: null,
    needles: [null, null],
    planes: [0, 1, 2].map(() => [new THREE.Plane(new THREE.Vector3(0, 1, 0), 1e5), new THREE.Plane(new THREE.Vector3(0, 1, 0), 1e5)] as [THREE.Plane, THREE.Plane]),
    cut: [0, 0, 0],
    flow: [0, 0, 0],
    lit: [0, 0, 0],
    bowlMats: [],
  };
}

/* ---- shared geometry, built once ---- */
function useGeometries() {
  return useMemo(() => {
    const cartY0 = CARTRIDGE.bottom + CARTRIDGE.capH;
    const cartY1 = CARTRIDGE.bottom + CARTRIDGE.len - CARTRIDGE.capH;
    const layer = (r: number) => {
      const g = new THREE.CylinderGeometry(r, r, cartY1 - cartY0, 96, 1, true);
      g.translate(0, (cartY0 + cartY1) / 2, 0);
      return g;
    };
    return {
      bowl: bowlGeometry(),
      ribs: collarRibsGeometry(),
      threads: threadsGeometry(),
      head: headGeometry(),
      port: portGeometry(),
      hexPort: hexGeometry(2.25, 1.7),
      hexGap: hexGeometry(1.95, HEAD.gap + 0.2),
      button: new THREE.CylinderGeometry(HEAD.button.r, HEAD.button.r * 0.92, HEAD.button.h, 32),
      bolt: new THREE.CylinderGeometry(HEAD.bolt.r, HEAD.bolt.r, HEAD.bolt.h, 6),
      plate: plateGeometry(),
      ear: earGeometry(),
      post: tubeGeometry(FRAME.plateBottom - TUBE, "y"),
      railX: tubeGeometry(FRAME.w, "x"),
      railZ: tubeGeometry(FRAME.d - 2 * TUBE, "z"),
      gaugeCase: gaugeCaseGeometry(),
      gaugeBezel: gaugeBezelGeometry(),
      gaugeGlass: gaugeGlassGeometry(),
      gaugeDial: gaugeDialGeometry(),
      gaugeStem: new THREE.CylinderGeometry(GAUGE.stem.r, GAUGE.stem.r, GAUGE.stem.h, 24),
      gaugeFoot: hexGeometry(1.05, 1.3),
      needle: new THREE.BoxGeometry(0.16, GAUGE.r - GAUGE.bezel - 0.35, 0.06),
      hub: new THREE.CylinderGeometry(0.28, 0.28, 0.12, 24),
      cartY0,
      cartY1,
      layer,
      capBottom: capGeometry(CARTRIDGE.r + 0.04, CARTRIDGE.capH, CARTRIDGE.bottom),
      capTop: capGeometry(CARTRIDGE.r + 0.04, CARTRIDGE.capH, cartY1),
      core: coreGeometry(cartY0 - 0.3, cartY1 + 0.3),
      collarBlue: (() => {
        const g = new THREE.CylinderGeometry(CARTRIDGE.r + 0.22, CARTRIDGE.r + 0.22, 2.2, 96, 1, false);
        g.translate(0, cartY1 - 1.1, 0);
        return g;
      })(),
      label: (() => {
        const g = new THREE.CylinderGeometry(BOWL.r + 0.05, BOWL.r + 0.05, 11, 48, 1, true, -Math.PI / 5.2, Math.PI / 2.6);
        g.translate(0, 29, 0);
        return g;
      })(),
      particle: new THREE.SphereGeometry(0.3, 10, 8),
      cover: coverGeometries(),
      dial: makeDialTexture(),
    };
  }, []);
}
type Geos = ReturnType<typeof useGeometries>;

/** a printed label with nothing readable on it: a white patch, a bar of grey
 *  lines and a small block, the way the real housings are labelled */
function makeLabelTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const cv = document.createElement("canvas");
  cv.width = 256;
  cv.height = 384;
  const g = cv.getContext("2d");
  if (!g) return null;
  g.fillStyle = "#f4f4f2";
  g.fillRect(0, 0, 256, 384);
  g.fillStyle = "#c9cbcc";
  g.fillRect(28, 40, 120, 14);
  g.fillRect(28, 66, 180, 7);
  g.fillRect(28, 80, 150, 7);
  g.fillRect(28, 94, 166, 7);
  g.fillStyle = "#b8babb";
  for (let i = 0; i < 9; i++) g.fillRect(28, 140 + i * 16, 60 + ((i * 37) % 120), 5);
  g.fillStyle = "#9a9c9e";
  g.fillRect(150, 280, 78, 78);
  g.fillStyle = "#f4f4f2";
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) if ((x * 7 + y * 3) % 5 < 2) g.fillRect(154 + x * 9, 284 + y * 9, 8, 8);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ---- one housing: head fixed to the plate, bowl hung from it, cartridge inside ---- */
const STAGE_LAYERS = (m: MachineMaterials, i: number): [number, THREE.Material][] =>
  i === 0
    ? [
        [CARTRIDGE.r, m.cartWhite],
        [4.55, m.cartMid],
        [3.15, m.cartFine],
      ]
    : i === 1
      ? [
          [CARTRIDGE.r, m.mesh2],
          [5.5, m.kdf],
          [3.9, m.gac],
        ]
      : [
          [CARTRIDGE.r, m.cartWhite],
          [5.42, m.beads],
          [3.6, m.gac],
        ];

const DIRTY = ["#a4825a", "#b7c66d", "#d9d9cf"];

type Pointer = {
  onCover?: (e: ThreeEvent<MouseEvent>) => void;
  onHousing?: (i: number, e: ThreeEvent<MouseEvent>) => void;
  onHover?: (what: "cover" | "housing" | null, i?: number) => void;
};

function Housing({ i, mats, geos, h, label, pointer }: { i: number; mats: MachineMaterials; geos: Geos; h: MachineHandle; label: THREE.Texture | null; pointer?: Pointer }) {
  const x = HOUSING_X[i];
  // every material the section wedge cuts is this housing's own copy
  const cutMats = useMemo(() => {
    const clone = (m: THREE.Material) => {
      const c = m.clone();
      c.clippingPlanes = h.planes[i];
      c.clipIntersection = true;
      c.clipShadows = true;
      return c;
    };
    const bowl = mats.bowl[i];
    bowl.clippingPlanes = h.planes[i];
    bowl.clipIntersection = true;
    bowl.clipShadows = true;
    h.bowlMats[i] = bowl;
    return {
      bowl,
      collar: clone(mats.collar),
      layers: STAGE_LAYERS(mats, i).map(([r, m]) => [r, clone(m)] as [number, THREE.Material]),
      cap: clone(i === 2 ? mats.capWhite : mats.capPink),
      core: clone(mats.core),
      blue: clone(mats.capBlue),
      label: new THREE.MeshStandardMaterial({ map: label ?? undefined, color: label ? "#ffffff" : "#f0f0ee", roughness: 0.7, clippingPlanes: h.planes[i], clipIntersection: true, side: THREE.DoubleSide, transparent: true, opacity: 0.98 }),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mats, i, h, label]);
  const layerGeos = useMemo(() => cutMats.layers.map(([r]) => geos.layer(r)), [cutMats, geos]);

  // the water: particles on the real path
  const inst = useRef<THREE.InstancedMesh>(null);
  const N = 150;
  const seeds = useMemo(() => {
    const s = [];
    for (let k = 0; k < N; k++) s.push({ phase: (k / N + Math.random() * 0.02) % 1, ang: (Math.random() - 0.5) * 2.2, yIn: 11 + Math.random() * 36, rr: 0.15 + Math.random() * 0.7, speed: 0.85 + Math.random() * 0.3 });
    return s;
  }, []);
  const dirty = useMemo(() => new THREE.Color(DIRTY[i]), [i]);
  const clean = useMemo(() => new THREE.Color("#2ea9df"), []);
  const tmp = useMemo(() => ({ m: new THREE.Matrix4(), p: new THREE.Vector3(), c: new THREE.Color(), q: new THREE.Quaternion(), s: new THREE.Vector3() }), []);
  const clock = useRef(0);
  useFrame((_, dt) => {
    const mesh = inst.current;
    if (!mesh) return;
    const f = h.flow[i];
    mesh.visible = f > 0.01;
    if (!mesh.visible) return;
    clock.current += dt * 0.11 * f;
    const R_OUT = BOWL.r - BOWL.wall - 0.35;
    for (let k = 0; k < N; k++) {
      const sd = seeds[k];
      const t = (clock.current * sd.speed + sd.phase) % 1;
      let px = 0;
      let py = 0;
      let pz = 0;
      let cleanMix = 0;
      if (t < 0.06) {
        const u = t / 0.06;
        px = -HEAD.bodyR + (R_OUT * Math.sin(sd.ang) + HEAD.bodyR) * u;
        py = HEAD.port.y - (HEAD.port.y - 55) * u;
        pz = R_OUT * Math.cos(sd.ang) * u;
      } else if (t < 0.42) {
        const u = (t - 0.06) / 0.36;
        px = R_OUT * Math.sin(sd.ang);
        pz = R_OUT * Math.cos(sd.ang);
        py = 55 - (55 - sd.yIn) * u;
      } else if (t < 0.58) {
        const u = (t - 0.42) / 0.16;
        const r = R_OUT - (R_OUT - sd.rr) * u;
        px = r * Math.sin(sd.ang);
        pz = r * Math.cos(sd.ang);
        py = sd.yIn;
        cleanMix = THREE.MathUtils.smoothstep(u, 0.35, 0.75);
      } else if (t < 0.92) {
        const u = (t - 0.58) / 0.34;
        px = sd.rr * 0.9 * Math.sin(sd.ang);
        pz = sd.rr * 0.9 * Math.cos(sd.ang);
        py = sd.yIn + (56.5 - sd.yIn) * u;
        cleanMix = 1;
      } else {
        const u = (t - 0.92) / 0.08;
        px = sd.rr * 0.9 * Math.sin(sd.ang) + (HEAD.bodyR - sd.rr * 0.9 * Math.sin(sd.ang)) * u;
        py = 56.5 + (HEAD.port.y - 56.5) * u;
        pz = sd.rr * 0.9 * Math.cos(sd.ang) * (1 - u);
        cleanMix = 1;
      }
      tmp.p.set(px, py, pz);
      const sc = f * (0.75 + 0.25 * Math.sin(k * 3.1));
      tmp.s.set(sc, sc, sc);
      tmp.m.compose(tmp.p, tmp.q, tmp.s);
      mesh.setMatrixAt(k, tmp.m);
      tmp.c.copy(dirty).lerp(clean, cleanMix);
      mesh.setColorAt(k, tmp.c);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  const isOuterLeft = i === 0;
  const isOuterRight = i === 2;
  return (
    <group
      position={[x, 0, 0]}
      ref={(el) => { h.housings[i] = el; }}
      onClick={pointer?.onHousing ? (e) => { e.stopPropagation(); pointer.onHousing?.(i, e); } : undefined}
      onPointerOver={pointer?.onHover ? (e) => { e.stopPropagation(); pointer.onHover?.("housing", i); } : undefined}
      onPointerOut={pointer?.onHover ? () => pointer.onHover?.(null) : undefined}
    >
      {/* the head, fixed to the plate */}
      <mesh geometry={geos.head} material={mats.head} castShadow receiveShadow />
      <mesh geometry={geos.port} material={mats.head} castShadow />
      {isOuterLeft && <mesh geometry={geos.hexPort} material={mats.brass} position={[-(HEAD.bodyR + HEAD.port.len + 0.6), HEAD.port.y, 0]} castShadow />}
      {isOuterRight && <mesh geometry={geos.hexPort} material={mats.brass} position={[HEAD.bodyR + HEAD.port.len + 0.6, HEAD.port.y, 0]} castShadow />}
      {/* on the plate: the pressure-release button and the four head bolts */}
      <mesh geometry={geos.button} material={mats.red} position={[0, FRAME_TOP + HEAD.button.h / 2, HEAD.button.dz]} castShadow />
      {[45, 135, 225, 315].map((deg) => {
        const a = (deg * Math.PI) / 180;
        return <mesh key={deg} geometry={geos.bolt} material={mats.bolt} position={[HEAD.bolt.ring * Math.cos(a), FRAME_TOP + HEAD.bolt.h / 2, HEAD.bolt.ring * Math.sin(a)]} castShadow />;
      })}

      {/* the bowl: hangs from the head; unscrews and sets down in service */}
      <group ref={(el) => { h.bowls[i] = el; }}>
        <mesh geometry={geos.bowl} material={cutMats.bowl} castShadow receiveShadow />
        <mesh geometry={geos.ribs} material={cutMats.collar} castShadow />
        <mesh geometry={geos.threads} material={cutMats.collar} />
        <mesh geometry={geos.label} material={cutMats.label} />
      </group>

      {/* the cartridge: hangs from the head's seat, lifts out in service */}
      <group ref={(el) => { h.cartridges[i] = el; }}>
        {cutMats.layers.map(([r, m], k) => (
          <mesh key={k} geometry={layerGeos[k]} material={m} castShadow={k === 0} receiveShadow />
        ))}
        <mesh geometry={geos.capBottom} material={cutMats.cap} castShadow />
        <mesh geometry={geos.capTop} material={cutMats.cap} castShadow />
        {i === 2 && <mesh geometry={geos.collarBlue} material={cutMats.blue} castShadow />}
        <mesh geometry={geos.core} material={cutMats.core} />
        {/* the water */}
        <instancedMesh ref={inst} args={[geos.particle, mats.water, N]} frustumCulled={false} visible={false} />
      </group>
    </group>
  );
}

/* ---- the frame ---- */
function Frame({ mats, geos }: { mats: MachineMaterials; geos: Geos }) {
  const postY = TUBE + (FRAME.plateBottom - TUBE) / 2;
  return (
    <group>
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} geometry={geos.post} material={mats.frame} position={[sx * POST_X, postY, sz * POST_Z]} castShadow receiveShadow />
        )),
      )}
      {[-1, 1].map((sz) => (
        <mesh key={`rx${sz}`} geometry={geos.railX} material={mats.frame} position={[0, TUBE / 2, sz * POST_Z]} castShadow receiveShadow />
      ))}
      {[-1, 1].map((sx) => (
        <mesh key={`rz${sx}`} geometry={geos.railZ} material={mats.frame} position={[sx * POST_X, TUBE / 2, 0]} castShadow receiveShadow />
      ))}
      {/* the plate the heads hang from */}
      <mesh geometry={geos.plate} material={mats.plate} position={[0, FRAME.plateBottom + FRAME.plate.h / 2, 0]} castShadow receiveShadow />
      {/* the wall-mount ears */}
      {[-1, 1].map((sx) => (
        <mesh key={`ear${sx}`} geometry={geos.ear} material={mats.plate} position={[sx * (FRAME.w / 2 - 5), FRAME_TOP - 0.2, -FRAME.plate.d / 2 + 0.2]} castShadow />
      ))}
    </group>
  );
}

/* ---- the gauges ---- */
function Gauge({ k, mats, geos, h, reading }: { k: number; mats: MachineMaterials; geos: Geos; h: MachineHandle; reading: number }) {
  const at = GAUGE.at[k];
  const cy = FRAME_TOP + GAUGE.stem.h + GAUGE.r;
  const dial = useMemo(() => new THREE.MeshStandardMaterial({ map: geos.dial ?? undefined, color: geos.dial ? "#ffffff" : "#f6f6f4", roughness: 0.75 }), [geos.dial]);
  const rot = ((135 - 270 * reading) * Math.PI) / 180;
  return (
    <group position={[at.x, 0, at.z]}>
      <mesh geometry={geos.gaugeFoot} material={mats.brass} position={[0, FRAME_TOP + 0.65, 0]} rotation={[0, 0, Math.PI / 2]} castShadow />
      <mesh geometry={geos.gaugeStem} material={mats.stainless} position={[0, FRAME_TOP + GAUGE.stem.h / 2, 0]} castShadow />
      <group position={[0, cy, 0]}>
        <mesh geometry={geos.gaugeCase} material={mats.stainless} castShadow receiveShadow />
        <mesh geometry={geos.gaugeBezel} material={mats.stainless} castShadow />
        <mesh geometry={geos.gaugeDial} material={dial} />
        <group position={[0, 0, GAUGE.depth / 2 + 0.09]} rotation={[0, 0, rot]} ref={(el) => { h.needles[k] = el; }}>
          <mesh geometry={geos.needle} material={mats.needle} position={[0, (GAUGE.r - GAUGE.bezel - 0.35) / 2 - 0.3, 0]} />
        </group>
        <mesh geometry={geos.hub} material={mats.bolt} position={[0, 0, GAUGE.depth / 2 + 0.12]} rotation={[Math.PI / 2, 0, 0]} />
        <mesh geometry={geos.gaugeGlass} material={mats.glass} />
      </group>
    </group>
  );
}

/* ---- the series ports between heads, and the copper runs ---- */
function Pipework({ mats, geos, h }: { mats: MachineMaterials; geos: Geos; h: MachineHandle }) {
  const gapX = (HOUSING_X[1] - HOUSING_X[0]) / 2;
  const portEnd = HOUSING_X[2] + HEAD.bodyR + HEAD.port.len + 1.4;
  const runs = useMemo(() => {
    const y = PIPE.runY;
    const mk = (sx: number) => {
      const pts = [new THREE.Vector3(sx * portEnd, y, 0), new THREE.Vector3(sx * (COVER.w / 2 + 6), y, 0)];
      const drop = [new THREE.Vector3(sx * (COVER.w / 2 + 6), y, 0), new THREE.Vector3(sx * (COVER.w / 2 + 6), 0.2, 0)];
      return { run: pipeGeometry(pts, PIPE.copperR), drop: pipeGeometry(drop, PIPE.copperR), elbowAt: new THREE.Vector3(sx * (COVER.w / 2 + 6), y, 0) };
    };
    return { left: mk(-1), right: mk(1), elbow: elbowGeometry(PIPE.copperR), valve: new THREE.CylinderGeometry(1.7, 1.7, 3.6, 24), lever: new THREE.BoxGeometry(0.7, 0.5, 4.6) };
  }, [portEnd]);
  return (
    <group>
      {/* brass between the heads */}
      <mesh geometry={geos.hexGap} material={mats.brass} position={[-gapX, HEAD.port.y, 0]} castShadow />
      <mesh geometry={geos.hexGap} material={mats.brass} position={[gapX, HEAD.port.y, 0]} castShadow />
      {/* the mains in and the house out */}
      <group ref={(el) => { h.runs = el; }}>
        {[runs.left, runs.right].map((r, k) => (
          <group key={k}>
            <mesh geometry={r.run} material={mats.copper} castShadow />
            <mesh geometry={r.drop} material={mats.copper} castShadow />
            <mesh geometry={runs.elbow} material={mats.copper} position={r.elbowAt} castShadow />
            {/* the isolation valve on the drop, blue lever */}
            <group position={[r.elbowAt.x, 38, 0]}>
              <mesh geometry={runs.valve} material={mats.brass} castShadow />
              <mesh geometry={runs.lever} material={mats.valveBlue} position={[0, 1.2, 2.6]} castShadow />
            </group>
          </group>
        ))}
      </group>
    </group>
  );
}

/* ---- the cover ---- */
/** The lockup as relief: the glyph outlines baked by scripts/lockup-paths.mjs
 *  (centimetres, centred, y up) extruded off the cover's front face, so the
 *  lettering is geometry that catches the key light and shades itself as the
 *  cover turns, the way the raised lettering on the concept does. */
const RELIEF = 0.3;
/** the tagline and the rule: a finer relief, so the small letters hold together at phone scale */
const RELIEF_SMALL = 0.08;
function reliefGeometry(small: boolean): THREE.BufferGeometry {
  const loader = new SVGLoader();
  const parts: THREE.BufferGeometry[] = [];
  for (const line of LOCKUP) {
    if ((line.id === "tag") !== small) continue;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg">${line.paths.map((d) => `<path d="${d}"/>`).join("")}</svg>`;
    for (const p of loader.parse(svg).paths) {
      for (const s of SVGLoader.createShapes(p)) {
        parts.push(
          small
            ? new THREE.ExtrudeGeometry(s, { depth: RELIEF_SMALL, bevelEnabled: false, curveSegments: 5 })
            : new THREE.ExtrudeGeometry(s, { depth: RELIEF - 0.06, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 2, curveSegments: 6 }),
        );
      }
    }
  }
  const g = mergeGeometries(parts, false) ?? new THREE.BufferGeometry();
  for (const p of parts) p.dispose();
  return g;
}
/** the two big lines cast their contact shadow; the small tagline is shallow
 *  and casts none, so at phone scale it stays one clean line of letters */
function Relief({ mats, z }: { mats: MachineMaterials; z: number }) {
  const big = useMemo(() => reliefGeometry(false), []);
  const small = useMemo(() => reliefGeometry(true), []);
  useEffect(() => () => { big.dispose(); small.dispose(); }, [big, small]);
  return (
    <>
      <mesh geometry={big} material={mats.letterFace} position={[0, 0, z]} castShadow receiveShadow />
      <mesh geometry={small} material={mats.letterFace} position={[0, 0, z]} />
    </>
  );
}

function Cover({ mats, geos, h, pointer }: { mats: MachineMaterials; geos: Geos; h: MachineHandle; pointer?: Pointer }) {
  const { w, t, notch, d } = COVER;
  const g = geos.cover;
  const nb = notch.top - notch.h;
  const zf = d / 2;
  const midW = w - 2 * t - 2 * notch.w;
  return (
    <group
      ref={(el) => { h.cover = el; }}
      position={[0, COVER_Y, COVER_Z]}
      onClick={pointer?.onCover ? (e) => { e.stopPropagation(); pointer.onCover?.(e); } : undefined}
      onPointerOver={pointer?.onHover ? (e) => { e.stopPropagation(); pointer.onHover?.("cover"); } : undefined}
      onPointerOut={pointer?.onHover ? () => pointer.onHover?.(null) : undefined}
    >
      <mesh geometry={g.sideGeo} material={mats.cover} position-x={-w / 2 + t} castShadow receiveShadow />
      <mesh geometry={g.sideGeo} material={mats.cover} position-x={w / 2} castShadow receiveShadow />
      <mesh geometry={g.mid} material={mats.cover} position-x={midW / 2} castShadow receiveShadow />
      <mesh geometry={g.edgeLow} material={mats.cover} position-x={-w / 2 + t + notch.w} castShadow receiveShadow />
      <mesh geometry={g.edgeLow} material={mats.cover} position-x={w / 2 - t} castShadow receiveShadow />
      <mesh geometry={g.edgeHigh} material={mats.cover} position-x={-w / 2 + t + notch.w} castShadow receiveShadow />
      <mesh geometry={g.edgeHigh} material={mats.cover} position-x={w / 2 - t} castShadow receiveShadow />
      {/* the pressed pocket behind each notch */}
      {[-1, 1].map((sx) => (
        <mesh key={sx} material={mats.coverInside} position={[sx * (w / 2 - t - notch.w / 2), nb + notch.h / 2, zf - notch.d + t / 2]} receiveShadow>
          <boxGeometry args={[notch.w + 0.3, notch.h, t]} />
        </mesh>
      ))}
      {/* the lockup, raised off the front face */}
      <group ref={(el) => { h.lockup = el; }}>
        <Relief mats={mats} z={zf} />
        <mesh material={mats.letterFace} position={[0, COVER.lockup.ruleY, zf + RELIEF_SMALL / 2]}>
          <boxGeometry args={[COVER.lockup.name.w, 0.14, RELIEF_SMALL]} />
        </mesh>
      </group>
    </group>
  );
}

/* ---- the whole thing ---- */
export function Machine({ mats, handle, covered = true, pointer }: { mats: MachineMaterials; handle: MachineHandle; covered?: boolean; pointer?: Pointer }) {
  const geos = useGeometries();
  const label = useMemo(() => makeLabelTexture(), []);
  useEffect(() => {
    for (const t of [mats.kdf.map, mats.kdf.normalMap, mats.gac.map, mats.gac.normalMap, mats.beads.normalMap]) {
      if (t) {
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(5, 4);
        t.needsUpdate = true;
      }
    }
    if (mats.mesh2.map) {
      mats.mesh2.map.wrapS = mats.mesh2.map.wrapT = THREE.RepeatWrapping;
      mats.mesh2.map.repeat.set(8, 26);
      mats.mesh2.map.needsUpdate = true;
    }
  }, [mats]);

  // the section wedges follow their housings every frame
  const tmp = useMemo(() => ({ c: new THREE.Vector3(), n: new THREE.Vector3() }), []);
  useFrame(() => {
    for (let i = 0; i < 3; i++) {
      const [A, B] = handle.planes[i];
      const th = handle.cut[i];
      if (th <= 0.001) {
        A.normal.set(0, 1, 0);
        A.constant = 1e5;
        B.normal.set(0, 1, 0);
        B.constant = 1e5;
        continue;
      }
      const g = handle.housings[i];
      if (!g) continue;
      g.getWorldPosition(tmp.c);
      // the wedge opens toward +z (the camera side): the region between the
      // two rays at ±th from +z is clipped, and only that region
      A.normal.set(Math.cos(th), 0, -Math.sin(th)).normalize();
      A.constant = -A.normal.dot(tmp.c);
      B.normal.set(-Math.cos(th), 0, -Math.sin(th)).normalize();
      B.constant = -B.normal.dot(tmp.c);
      // the highlight: the bowl warms slightly when the taste check names it
      const bm = handle.bowlMats[i];
      if (bm) bm.emissive.setRGB(0.05, 0.16, 0.24).multiplyScalar(handle.lit[i] * 0.6);
    }
  });

  return (
    <group>
      <Frame mats={mats} geos={geos} />
      {[0, 1, 2].map((i) => (
        <Housing key={i} i={i} mats={mats} geos={geos} h={handle} label={label} pointer={pointer} />
      ))}
      <Gauge k={0} mats={mats} geos={geos} h={handle} reading={0.42} />
      <Gauge k={1} mats={mats} geos={geos} h={handle} reading={0.37} />
      <Pipework mats={mats} geos={geos} h={handle} />
      {covered && <Cover mats={mats} geos={geos} h={handle} pointer={pointer} />}
    </group>
  );
}
