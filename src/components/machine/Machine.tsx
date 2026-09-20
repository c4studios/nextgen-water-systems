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
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { LOCKUP } from "./lockupPaths";
import { makeStageLabel } from "./labels";
import { BOWL, CARTRIDGE, COVER, COVER_Y, COVER_Z, FRAME, FRAME_TOP, GAUGE, HEAD, HOUSING_X, PIPE, POST_X, POST_Z, TUBE } from "./dims";
import {
  bowlGeometry,
  bowlRibsGeometry,
  capGeometry,
  collarRibsGeometry,
  coreGeometry,
  coverShellGeometry,
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
  screwGeometry,
  threadsGeometry,
  tubeGeometry,
  upstandGeometry,
  UPSTAND,
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
  /** frames left in which every part the journey reveals (section faces, the
   *  water) is drawn once, unseen inside the closed machine, so its shaders
   *  compile at load and not in the middle of the scroll */
  warm: number;
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
    warm: 2,
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
      upstand: upstandGeometry(),
      screw: screwGeometry(),
      bowlRibs: bowlRibsGeometry(),
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
      waterBody: (() => {
        // open-ended and no taller than the beds: a closed end showed through the cut as a white disc
        const g = new THREE.CylinderGeometry(BOWL.r - BOWL.wall - 0.08, BOWL.r - BOWL.wall - 0.08, cartY1 - cartY0, 64, 1, true);
        g.translate(0, (cartY0 + cartY1) / 2, 0);
        return g;
      })(),
      cover: coverShellGeometry(),
      dial: makeDialTexture(),
    };
  }, []);
}
type Geos = ReturnType<typeof useGeometries>;

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

/* what the water carries in, per stage: silt, a pale cloud, a milky trace */
const DIRTY = ["#8c7456", "#aeb8bd", "#d4d8d2"];

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
      cap: clone(mats.capPlain),
      core: clone(mats.core),
      waterBody: clone(mats.waterBody),
      blue: clone(mats.capBlue),
      label: new THREE.MeshPhysicalMaterial({ map: label ?? undefined, color: label ? "#ffffff" : "#f0f0ee", roughness: 0.62, clearcoat: 0.25, clearcoatRoughness: 0.35, clippingPlanes: h.planes[i], clipIntersection: true, side: THREE.DoubleSide, transparent: true, opacity: 1, polygonOffset: true, polygonOffsetFactor: -2 }),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mats, i, h, label]);
  const layerGeos = useMemo(() => cutMats.layers.map(([r]) => geos.layer(r)), [cutMats, geos]);

  /* THE SECTION FACES. A clipped shell is hollow: where the wedge cuts the
     bowl and the cartridge, the cut would show nothing but the inside of a
     tube. A real cutaway is solid, so each cut face gets a flat cap in the
     material that was cut: the bowl wall, each bed of media, the end caps.
     They stand in the planes of the wedge and turn with it. */
  const caps = useMemo(() => {
    const plane = (r0: number, r1: number, y0: number, y1: number, su: number) => {
      const w = r1 - r0;
      const hh = y1 - y0;
      const g = new THREE.PlaneGeometry(w, hh);
      g.translate(r0 + w / 2, y0 + hh / 2, 0);
      const uv = g.attributes.uv as THREE.BufferAttribute;
      for (let k = 0; k < uv.count; k++) uv.setX(k, uv.getX(k) * su);
      return g;
    };
    const unclip = (m: THREE.Material) => {
      const c = m.clone();
      c.clippingPlanes = null;
      c.side = THREE.DoubleSide;
      return c;
    };
    const layers = STAGE_LAYERS(mats, i);
    const rCore = CARTRIDGE.coreR + 0.15;
    const items: { geo: THREE.BufferGeometry; mat: THREE.Material }[] = [];
    layers.forEach(([rOut, mat], k) => {
      const rIn = layers[k + 1]?.[0] ?? rCore;
      // each bed's face runs edge to edge with the next (a gap would show the
      // dark inside of the shell as a sliver); the u scale keeps the texel
      // density of the cylinder the bed is drawn on
      items.push({ geo: plane(rIn, rOut, geos.cartY0, geos.cartY1, (rOut - rIn) / (2 * Math.PI * rOut)), mat: unclip(mat) });
    });
    const capMat = unclip(mats.capPlain);
    items.push({ geo: plane(rCore, CARTRIDGE.r + 0.04, CARTRIDGE.bottom, geos.cartY0, 1), mat: capMat });
    items.push({ geo: plane(rCore, CARTRIDGE.r + 0.04, geos.cartY1, geos.cartY1 + CARTRIDGE.capH, 1), mat: capMat });
    items.push({ geo: plane(BOWL.r - BOWL.wall, BOWL.r, BOWL.bottom + BOWL.domeH + 0.3, BOWL.shoulder - 0.6, 1), mat: mats.wallCut });
    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mats, i, geos]);
  const capA = useRef<THREE.Group>(null);
  const capB = useRef<THREE.Group>(null);
  const capTmp = useMemo(() => ({ q: new THREE.Quaternion(), e: new THREE.Euler() }), []);

  // the water: particles on the real path
  const inst = useRef<THREE.InstancedMesh>(null);
  const N = 150;
  const seeds = useMemo(() => {
    const s = [];
    for (let k = 0; k < N; k++) s.push({ phase: (k / N + Math.random() * 0.02) % 1, ang: (Math.random() - 0.5) * 2.2, yIn: 11 + Math.random() * 36, rr: 0.15 + Math.random() * 0.7, speed: 0.85 + Math.random() * 0.3, size: 0.3 + Math.pow(Math.random(), 2.2) * 0.85 });
    return s;
  }, []);
  const dirty = useMemo(() => new THREE.Color(DIRTY[i]), [i]);
  const clean = useMemo(() => new THREE.Color("#2ea9df"), []);
  // the drops' colours exist from the start: instance colour is a program
  // parameter, and three only allocates it on the first setColorAt, so a
  // program compiled before the first frame (MachineStage Precompile) would
  // lack it and be rebuilt the first time the water runs
  useLayoutEffect(() => {
    const mesh = inst.current;
    if (mesh && !mesh.instanceColor) mesh.setColorAt(0, dirty);
  }, [dirty]);
  const tmp = useMemo(() => ({ m: new THREE.Matrix4(), p: new THREE.Vector3(), c: new THREE.Color(), q: new THREE.Quaternion(), s: new THREE.Vector3() }), []);
  const clock = useRef(0);
  const waterRef = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    // the section faces follow the wedge
    const th = h.cut[i];
    const open = th > 0.002;
    const warm = h.warm > 0;
    if (capA.current && capB.current) {
      capA.current.visible = open || warm;
      capB.current.visible = open || warm;
      if (open) {
        let yaw = 0;
        const parent = h.housings[i]?.parent;
        if (parent) {
          parent.getWorldQuaternion(capTmp.q);
          capTmp.e.setFromQuaternion(capTmp.q, "YXZ");
          yaw = capTmp.e.y;
        }
        capA.current.rotation.y = th - Math.PI / 2 - yaw;
        capB.current.rotation.y = -th - Math.PI / 2 - yaw;
      }
    }
    const mesh = inst.current;
    if (!mesh) return;
    const f = h.flow[i];
    mesh.visible = f > 0.01 || warm;
    const wb = waterRef.current;
    if (wb) {
      wb.visible = f > 0.01 || warm;
      (wb.material as THREE.MeshPhysicalMaterial).opacity = 0.62 * f;
    }
    // the core glows while the water runs: the clean water, rising
    const core = cutMats.core as THREE.MeshStandardMaterial;
    if (core.emissive) core.emissiveIntensity = 1.6 * f;
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
      // no two drops alike: a spread of sizes, and a drop moving along the
      // bowl or up the core draws out a little along its path
      const sc = f * sd.size;
      const vertical = (t > 0.06 && t < 0.42) || (t > 0.58 && t < 0.92);
      tmp.s.set(sc, sc * (vertical ? 1.9 : 1), sc);
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
        <mesh geometry={geos.bowlRibs} material={cutMats.bowl} castShadow receiveShadow />
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
        {/* the water: a translucent body filling the bowl around the cartridge,
            only ever seen through the cut, and the particles on their path */}
        <mesh geometry={geos.waterBody} material={cutMats.waterBody} ref={waterRef} visible={false} renderOrder={2} />
        <instancedMesh ref={inst} args={[geos.particle, mats.water, N]} frustumCulled={false} visible={false} />
      </group>

      {/* the section faces, one set per side of the wedge */}
      <group ref={capA} visible={false}>
        {caps.map((c, k) => (
          <mesh key={k} geometry={c.geo} material={c.mat} receiveShadow />
        ))}
      </group>
      <group ref={capB} visible={false}>
        {caps.map((c, k) => (
          <mesh key={k} geometry={c.geo} material={c.mat} receiveShadow />
        ))}
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
      {/* the wall-mount upstand along the back edge, and a screw in each keyhole */}
      <mesh geometry={geos.upstand} material={mats.plate} position={[0, FRAME_TOP - 0.3, -FRAME.plate.d / 2 + UPSTAND.t / 2]} castShadow receiveShadow />
      {[-1, 1].map((sx) => (
        <mesh
          key={`screw${sx}`}
          geometry={geos.screw}
          material={mats.screw}
          position={[sx * (FRAME.plate.w / 2 - UPSTAND.holeInset), FRAME_TOP - 0.3 + UPSTAND.h - 2.1 - UPSTAND.slot * 0.7, -FRAME.plate.d / 2 + UPSTAND.t]}
          castShadow
        />
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
  const zf = COVER.d / 2;
  return (
    <group
      ref={(el) => { h.cover = el; }}
      position={[0, COVER_Y, COVER_Z]}
      onClick={pointer?.onCover ? (e) => { e.stopPropagation(); pointer.onCover?.(e); } : undefined}
      onPointerOver={pointer?.onHover ? (e) => { e.stopPropagation(); pointer.onHover?.("cover"); } : undefined}
      onPointerOut={pointer?.onHover ? () => pointer.onHover?.(null) : undefined}
    >
      {/* the sheet, outside and in */}
      <mesh geometry={geos.cover} material={mats.cover} castShadow receiveShadow />
      <mesh geometry={geos.cover} material={mats.coverInside} receiveShadow />
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
  const labels = useMemo(() => [0, 1, 2].map((k) => makeStageLabel(k)), []);
  useEffect(() => {
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
    // the housings read the warm-up count before this runs (children's frame
    // callbacks subscribe first), so the frame renders with the parts shown
    if (handle.warm > 0) handle.warm -= 1;
  });

  return (
    <group>
      <Frame mats={mats} geos={geos} />
      {[0, 1, 2].map((i) => (
        <Housing key={i} i={i} mats={mats} geos={geos} h={handle} label={labels[i]} pointer={pointer} />
      ))}
      <Gauge k={0} mats={mats} geos={geos} h={handle} reading={0.42} />
      <Gauge k={1} mats={mats} geos={geos} h={handle} reading={0.37} />
      <Pipework mats={mats} geos={geos} h={handle} />
      {covered && <Cover mats={mats} geos={geos} h={handle} pointer={pointer} />}
    </group>
  );
}
