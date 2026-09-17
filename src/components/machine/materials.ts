/**
 * WHAT THE MACHINE IS MADE OF.
 *
 * One material per real material, tuned against the supplier's photographs
 * under a white studio: the housings are moulded grey polypropylene with a
 * soft sheen, the heads black polypropylene, the frame and cover powder-coated
 * steel with a fine orange peel, the ports brass, the gauges stainless with a
 * glass lens, the mains and house runs copper. Nothing here is chrome: the
 * old scene's brushed-steel bowls were the wrong product.
 *
 * All the relief comes from the canvas-generated maps in surfaces.ts, so the
 * scene still starts with no texture fetch.
 */
import * as THREE from "three";
import { heightToNormal, makeOrangePeel, makeGranules } from "@/components/blueprint/surfaces";

export type MachineMaterials = ReturnType<typeof makeMachineMaterials>;

/** a fine random fibre field, for the polyspun sediment wrap */
function makeFibre(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const S = 256;
  const cv = document.createElement("canvas");
  cv.width = S;
  cv.height = S;
  const g = cv.getContext("2d", { willReadFrequently: true });
  if (!g) return null;
  g.fillStyle = "#808080";
  g.fillRect(0, 0, S, S);
  for (let i = 0; i < 2600; i++) {
    const x = Math.random() * S;
    const y = Math.random() * S;
    const len = 4 + Math.random() * 14;
    const a = (Math.random() - 0.5) * 0.9 + Math.PI / 2;
    g.strokeStyle = `rgba(${Math.random() < 0.5 ? 255 : 0},${Math.random() < 0.5 ? 255 : 0},${Math.random() < 0.5 ? 255 : 0},0.08)`;
    g.lineWidth = 0.8 + Math.random() * 0.8;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
    g.stroke();
  }
  const t = heightToNormal(cv, 1.4);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** a hexagonal mesh, printed dark over a light ground: the stage 2 wrap */
function makeHexMesh(): { map: THREE.CanvasTexture; alphaMap: THREE.CanvasTexture } | null {
  if (typeof document === "undefined") return null;
  const S = 256;
  const cv = document.createElement("canvas");
  cv.width = S;
  cv.height = S;
  const g = cv.getContext("2d");
  if (!g) return null;
  g.fillStyle = "#4a4c4f";
  g.fillRect(0, 0, S, S);
  g.strokeStyle = "#8d9094";
  g.lineWidth = 3;
  const R = 12;
  const h = Math.sqrt(3) * R;
  for (let row = -1; row < S / h + 1; row++) {
    for (let col = -1; col < S / (1.5 * R) + 1; col++) {
      const cx = col * 1.5 * R;
      const cy = row * h + (col % 2 ? h / 2 : 0);
      g.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = (Math.PI / 3) * k;
        const px = cx + R * Math.cos(a);
        const py = cy + R * Math.sin(a);
        if (k === 0) g.moveTo(px, py);
        else g.lineTo(px, py);
      }
      g.closePath();
      g.stroke();
    }
  }
  const alpha = new THREE.CanvasTexture(cv);
  alpha.wrapS = alpha.wrapT = THREE.RepeatWrapping;
  const map = new THREE.CanvasTexture(cv);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.colorSpace = THREE.SRGBColorSpace;
  return { map, alphaMap: alpha };
}

/** a mottled spun-fibre colour map: soft random cells over a base tone, so the
 *  sediment cartridge's nested layers read as matted fibre through the section
 *  cut instead of as smooth lit shells (which look like flutes) */
function makeMottle(base: string, amp = 14, seed = 1): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const S = 256;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, S, S);
  let r = seed * 9301 + 49297;
  const rnd = () => {
    r = (r * 9301 + 49297) % 233280;
    return r / 233280;
  };
  for (let i = 0; i < 1600; i++) {
    const v = Math.round((rnd() - 0.5) * 2 * amp);
    // mostly lighter cells over a light base; the dark cells stay faint or the fibre reads as stone
    ctx.fillStyle = v >= 0 ? `rgba(255,255,255,${(v / amp) * 0.16})` : `rgba(0,0,0,${(-v / amp) * 0.045})`;
    const rad = 2 + rnd() * 9;
    ctx.beginPath();
    ctx.ellipse(rnd() * S, rnd() * S, rad, rad * (0.5 + rnd()), rnd() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 7);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function makeMachineMaterials(relief = 1) {
  const peel = makeOrangePeel();
  const peelFrame = peel ? peel.clone() : null;
  if (peelFrame) {
    peelFrame.wrapS = peelFrame.wrapT = THREE.RepeatWrapping;
    peelFrame.repeat.set(6, 6);
    peelFrame.needsUpdate = true;
  }
  const peelCover = peel ? peel.clone() : null;
  if (peelCover) {
    peelCover.wrapS = peelCover.wrapT = THREE.RepeatWrapping;
    peelCover.repeat.set(14, 14);
    peelCover.needsUpdate = true;
  }
  const fibre = makeFibre();
  const hex = makeHexMesh();
  const kdf = makeGranules("kdf");
  const gac = makeGranules("gac");

  const powder = (color: string, rough: number, map: THREE.Texture | null) =>
    new THREE.MeshPhysicalMaterial({
      color,
      roughness: rough,
      metalness: 0.08,
      clearcoat: 0.22,
      clearcoatRoughness: 0.38,
      normalMap: map ?? undefined,
      normalScale: new THREE.Vector2(0.5 * relief, 0.5 * relief),
    });

  return {
    /** the housing bowls: grey polypropylene, a soft sheen, opaque until a
     *  section is cut; one per housing so each can ghost on its own */
    bowl: [0, 1, 2].map(
      () =>
        new THREE.MeshPhysicalMaterial({
          color: "#8e9093",
          roughness: 0.46,
          metalness: 0,
          clearcoat: 0.3,
          clearcoatRoughness: 0.3,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 1,
        }),
    ),
    /** the grip collar and threads, the same moulding a shade lighter where
     *  it catches the light */
    collar: new THREE.MeshPhysicalMaterial({ color: "#a7a9ab", roughness: 0.5, clearcoat: 0.2, clearcoatRoughness: 0.4 }),
    head: new THREE.MeshPhysicalMaterial({ color: "#121314", roughness: 0.5, metalness: 0, clearcoat: 0.28, clearcoatRoughness: 0.42 }),
    frame: powder("#1d1e20", 0.58, peelFrame),
    plate: powder("#1a1b1d", 0.56, peelFrame),
    cover: (() => {
      const m = powder("#9d9ea0", 0.44, peelCover);
      m.clearcoat = 0.4;
      m.clearcoatRoughness = 0.22;
      return m;
    })(),
    coverInside: new THREE.MeshStandardMaterial({ color: "#2a2b2c", roughness: 0.8, metalness: 0.05 }),
    /** the raised lettering: the same dark semi-matte as the concept, on real relief */
    letterFace: new THREE.MeshPhysicalMaterial({ color: "#232527", roughness: 0.42, metalness: 0.05, clearcoat: 0.4, clearcoatRoughness: 0.25 }),
    brass: new THREE.MeshPhysicalMaterial({ color: "#c79b4b", roughness: 0.36, metalness: 1, clearcoat: 0.1 }),
    brassDull: new THREE.MeshPhysicalMaterial({ color: "#a98240", roughness: 0.5, metalness: 1 }),
    copper: new THREE.MeshPhysicalMaterial({ color: "#b8743a", roughness: 0.3, metalness: 1, clearcoat: 0.2, clearcoatRoughness: 0.2 }),
    stainless: new THREE.MeshPhysicalMaterial({ color: "#d9dbdc", roughness: 0.22, metalness: 1, clearcoat: 0.3, clearcoatRoughness: 0.12 }),
    steelDark: new THREE.MeshPhysicalMaterial({ color: "#9a9c9e", roughness: 0.4, metalness: 1 }),
    glass: new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      roughness: 0.05,
      metalness: 0,
      transparent: true,
      opacity: 0.16,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      depthWrite: false,
    }),
    dial: new THREE.MeshStandardMaterial({ color: "#f6f6f4", roughness: 0.7, metalness: 0 }),
    needle: new THREE.MeshStandardMaterial({ color: "#c8281e", roughness: 0.45, metalness: 0.1 }),
    red: new THREE.MeshPhysicalMaterial({ color: "#c9261c", roughness: 0.42, metalness: 0, clearcoat: 0.4, clearcoatRoughness: 0.3 }),
    bolt: new THREE.MeshPhysicalMaterial({ color: "#2a2b2d", roughness: 0.45, metalness: 0.9 }),
    valveBlue: new THREE.MeshPhysicalMaterial({ color: "#1f5fb0", roughness: 0.5, metalness: 0, clearcoat: 0.3 }),
    /** cartridges */
    cartWhite: new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      map: makeMottle("#f3f2ef", 14, 1) ?? undefined,
      roughness: 0.86,
      metalness: 0,
      side: THREE.DoubleSide,
    }),
    cartMid: new THREE.MeshPhysicalMaterial({ color: "#ffffff", map: makeMottle("#dcdad4", 12, 2) ?? undefined, roughness: 0.88, side: THREE.DoubleSide }),
    cartFine: new THREE.MeshPhysicalMaterial({ color: "#ffffff", map: makeMottle("#cfcdc6", 12, 3) ?? undefined, roughness: 0.9, side: THREE.DoubleSide }),
    capPink: new THREE.MeshPhysicalMaterial({ color: "#e8dbe1", roughness: 0.5, clearcoat: 0.3, clearcoatRoughness: 0.3 }),
    capBlue: new THREE.MeshPhysicalMaterial({ color: "#2c48c9", roughness: 0.45, clearcoat: 0.35, clearcoatRoughness: 0.3 }),
    capWhite: new THREE.MeshPhysicalMaterial({ color: "#f4f3f0", roughness: 0.5, clearcoat: 0.3, clearcoatRoughness: 0.3 }),
    /** stage 2: a hex mesh over the media, then the beds inside */
    mesh2: new THREE.MeshPhysicalMaterial({
      color: "#4a4c4f",
      roughness: 0.72,
      map: hex?.map ?? undefined,
      side: THREE.DoubleSide,
    }),
    kdf: new THREE.MeshStandardMaterial({
      color: "#d9b25a",
      roughness: 0.62,
      metalness: 0.55,
      map: kdf?.map ?? undefined,
      normalMap: kdf?.normalMap ?? undefined,
      normalScale: new THREE.Vector2(0.9 * relief, 0.9 * relief),
      side: THREE.DoubleSide,
    }),
    gac: new THREE.MeshStandardMaterial({
      color: "#26282a",
      roughness: 0.85,
      metalness: 0.05,
      map: gac?.map ?? undefined,
      normalMap: gac?.normalMap ?? undefined,
      normalScale: new THREE.Vector2(0.9 * relief, 0.9 * relief),
      side: THREE.DoubleSide,
    }),
    /** stage 3: white scale-reduction beads outside, carbon inside */
    beads: new THREE.MeshStandardMaterial({
      color: "#e9e6de",
      roughness: 0.8,
      metalness: 0,
      normalMap: gac?.normalMap ?? undefined,
      normalScale: new THREE.Vector2(0.8 * relief, 0.8 * relief),
      side: THREE.DoubleSide,
    }),
    core: new THREE.MeshPhysicalMaterial({ color: "#e6e4df", roughness: 0.6, side: THREE.DoubleSide }),
    /** water, in the flow view */
    water: new THREE.MeshPhysicalMaterial({
      color: "#2ea9df",
      emissive: "#0f6f9c",
      emissiveIntensity: 0.35,
      roughness: 0.15,
      metalness: 0,
      transparent: true,
      opacity: 0.9,
    }),
    waterDirty: new THREE.MeshPhysicalMaterial({ color: "#8a7a5a", roughness: 0.4, transparent: true, opacity: 0.9 }),
    /** the floor the machine stands on */
    floor: new THREE.MeshStandardMaterial({ color: "#f2f3f3", roughness: 0.95, metalness: 0 }),
  };
}

/** every material that must be cut by a housing's section wedge */
export function cutMaterialsFor(m: MachineMaterials, i: number): THREE.Material[] {
  return [m.bowl[i], m.cartWhite, m.cartMid, m.cartFine, m.mesh2, m.kdf, m.gac, m.beads, m.core, m.capPink, m.capBlue, m.capWhite];
}
