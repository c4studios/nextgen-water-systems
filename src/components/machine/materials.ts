/**
 * WHAT THE MACHINE IS MADE OF.
 *
 * One material per real material, matched to the installed unit photographed
 * uncovered (Peddey Plumbing & Gas, 2026): the housings are moulded light-grey
 * polypropylene with a satin sheen, the heads black polypropylene a little
 * glossier, the frame and plate black powder coat with a soft broad sheen, the
 * cover the concept's grey powder coat, the unions brass, the gauges stainless
 * with a glass lens, the runs copper. Nothing here is chrome.
 *
 * Relief comes from canvas-generated maps (surfaces.ts, media.ts), so the
 * scene still starts with no texture fetch. The cartridge media are drawn in
 * idle time and swapped into their stand-ins (media.ts).
 */
import * as THREE from "three";
import { heightToNormal, makeOrangePeel } from "@/components/blueprint/surfaces";
import { drawMedia, applyMedia, standIn, type MediaKind, type MediaSet } from "./media";

export type MachineMaterials = ReturnType<typeof makeMachineMaterials>;

/** a hexagonal mesh, printed dark over a light ground: the stage 2 wrap */
function makeHexMesh(): { map: THREE.CanvasTexture } | null {
  if (typeof document === "undefined") return null;
  const S = 256;
  const cv = document.createElement("canvas");
  cv.width = S;
  cv.height = S;
  const g = cv.getContext("2d");
  if (!g) return null;
  g.fillStyle = "#3f4144";
  g.fillRect(0, 0, S, S);
  g.strokeStyle = "#8a8d91";
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
  const map = new THREE.CanvasTexture(cv);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.colorSpace = THREE.SRGBColorSpace;
  return { map };
}

/** the housing moulding: faint flow lines around the bowl, the two parting
 *  lines where the mould halves meet, and a little waviness. Varies around the
 *  bowl only, so it reads the same at every height. */
function makeMoulding(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const W = 1024;
  const H = 16;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d", { willReadFrequently: true });
  if (!g) return null;
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const ph = Array.from({ length: 4 }, () => rnd() * Math.PI * 2);
  const raw = new Float32Array(W).map(() => rnd());
  const fine = new Float32Array(W);
  for (let x = 0; x < W; x++) {
    let acc = 0;
    for (let k = -3; k <= 3; k++) acc += raw[(x + k + W) % W];
    fine[x] = acc / 7;
  }
  const img = g.createImageData(W, H);
  for (let x = 0; x < W; x++) {
    const u = x / W;
    const ridge = (c: number) => 0.22 * Math.exp(-Math.pow(((u - c) * W) / 1.6, 2));
    let h = 0.5 + 0.03 * Math.sin(2 * Math.PI * 3 * u + ph[0]) + 0.018 * Math.sin(2 * Math.PI * 9 * u + ph[1]) + 0.05 * (fine[x] - 0.5) + ridge(0.25) + ridge(0.75);
    h = Math.max(0, Math.min(1, h));
    for (let y = 0; y < H; y++) {
      const o = (y * W + x) * 4;
      img.data[o] = img.data[o + 1] = img.data[o + 2] = Math.round(h * 255);
      img.data[o + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  const t = heightToNormal(cv, 2.0);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** the satin of a moulded part is never even: broad soft patches a shade
 *  glossier or duller, and faint flow streaks along the draw */
function makeSatin(seed = 9, base = 0.5, amp = 0.12): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const W = 512;
  const H = 512;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d");
  if (!g) return null;
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const v0 = Math.round(base * 255);
  g.fillStyle = `rgb(${v0},${v0},${v0})`;
  g.fillRect(0, 0, W, H);
  for (let i = 0; i < 140; i++) {
    const x = rnd() * W;
    const y = rnd() * H;
    const r = 30 + rnd() * 110;
    const up = rnd() < 0.5;
    const a = (0.08 + rnd() * 0.22) * (amp / 0.12);
    for (const [dx, dy] of [[0, 0], [W, 0], [-W, 0], [0, H], [0, -H]]) {
      const gr = g.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, r);
      gr.addColorStop(0, up ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`);
      gr.addColorStop(1, up ? "rgba(255,255,255,0)" : "rgba(0,0,0,0)");
      g.fillStyle = gr;
      g.fillRect(x + dx - r, y + dy - r, r * 2, r * 2);
    }
  }
  // streaks along v (the lathe's profile direction)
  for (let i = 0; i < 90; i++) {
    const x = rnd() * W;
    g.fillStyle = `rgba(${rnd() < 0.5 ? "255,255,255" : "0,0,0"},${(0.03 + rnd() * 0.05).toFixed(3)})`;
    g.fillRect(x, 0, 1 + rnd() * 3, H);
  }
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** a fine moulded speckle, for the black heads */
function makeSpeckle(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const S = 256;
  const cv = document.createElement("canvas");
  cv.width = cv.height = S;
  const g = cv.getContext("2d", { willReadFrequently: true });
  if (!g) return null;
  const img = g.createImageData(S, S);
  let seed = 3;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < S * S; i++) {
    const v = 116 + rnd() * 24;
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = heightToNormal(cv, 0.7);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(6, 6);
  return t;
}

/** drawn copper: faint streaks along the pipe in the roughness */
function makeDrawnStreaks(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const W = 8;
  const H = 512;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d");
  if (!g) return null;
  let seed = 5;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let y = 0; y < H; y++) {
    const v = Math.round(190 + (rnd() - 0.5) * 60 + 26 * Math.sin(y * 0.09));
    g.fillStyle = `rgb(${v},${v},${v})`;
    g.fillRect(0, y, W, 1);
  }
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
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
  // the cover's shell carries its UVs in centimetres
  const peelCover = peel ? peel.clone() : null;
  if (peelCover) {
    peelCover.wrapS = peelCover.wrapT = THREE.RepeatWrapping;
    peelCover.repeat.set(0.4, 0.4);
    peelCover.needsUpdate = true;
  }
  const hex = makeHexMesh();
  const moulding = makeMoulding();
  const satin = makeSatin(9, 0.37, 0.1);
  const satinHead = makeSatin(21, 0.36, 0.1);
  const speckle = makeSpeckle();
  const streaks = makeDrawnStreaks();

  /* the cartridge media start as stand-ins and are drawn in idle time; the
     repeats keep a grain or a fibre the same size on every radius */
  const media = {
    fibreCoarse: standIn(2, 3),
    fibreMid: standIn(2, 3),
    fibreFine: standIn(2, 4),
    kdf: standIn(2, 3),
    gac: standIn(2, 4),
    beads: standIn(2, 3),
  } satisfies Record<MediaKind, MediaSet>;
  const bed = (set: MediaSet, over: Partial<THREE.MeshStandardMaterialParameters>) =>
    new THREE.MeshStandardMaterial({
      color: "#ffffff",
      map: set.map,
      normalMap: set.normalMap,
      roughnessMap: set.roughnessMap,
      roughness: 1,
      metalness: 0,
      normalScale: new THREE.Vector2(1 * relief, 1 * relief),
      side: THREE.DoubleSide,
      ...over,
    });

  const powder = (color: string, rough: number, map: THREE.Texture | null, clearcoat = 0.16) =>
    new THREE.MeshPhysicalMaterial({
      color,
      roughness: rough,
      metalness: 0,
      clearcoat,
      clearcoatRoughness: 0.5,
      normalMap: map ?? undefined,
      normalScale: new THREE.Vector2(0.45 * relief, 0.45 * relief),
    });

  return {
    media,
    /** the housing bowls: light-grey polypropylene with a satin sheen; one per
     *  housing so each can carry its own highlight */
    bowl: [0, 1, 2].map(
      () =>
        new THREE.MeshPhysicalMaterial({
          color: "#a7abaf",
          roughness: 1,
          roughnessMap: satin ?? undefined,
          metalness: 0,
          clearcoat: 0.08,
          clearcoatRoughness: 0.5,
          envMapIntensity: 1.3,
          normalMap: moulding ?? undefined,
          normalScale: new THREE.Vector2(0.4 * relief, 0.4 * relief),
          side: THREE.DoubleSide,
        }),
    ),
    /** the grip collar and threads, the bowl's own grey */
    collar: new THREE.MeshPhysicalMaterial({ color: "#a2a6aa", roughness: 0.52, clearcoat: 0.1, clearcoatRoughness: 0.5 }),
    /** the bowl wall where the section cuts it */
    wallCut: new THREE.MeshStandardMaterial({ color: "#8e9296", roughness: 0.82, metalness: 0, side: THREE.DoubleSide }),
    head: new THREE.MeshPhysicalMaterial({
      color: "#0e0f11",
      roughness: 1,
      roughnessMap: satinHead ?? undefined,
      metalness: 0,
      clearcoat: 0.4,
      clearcoatRoughness: 0.32,
      envMapIntensity: 1.35,
      normalMap: speckle ?? undefined,
      normalScale: new THREE.Vector2(0.22 * relief, 0.22 * relief),
    }),
    frame: powder("#141517", 0.5, peelFrame),
    plate: powder("#121315", 0.44, peelFrame, 0.22),
    cover: (() => {
      // the concept's finish: a soft satin, not a gloss
      const m = powder("#a1a3a5", 0.56, peelCover, 0.14);
      m.clearcoatRoughness = 0.42;
      m.envMapIntensity = 1.2;
      m.normalScale.set(0.3 * relief, 0.3 * relief);
      return m;
    })(),
    /** the cover seen from inside: the same sheet, turned away from the light */
    coverInside: new THREE.MeshStandardMaterial({ color: "#86888a", roughness: 0.72, metalness: 0, side: THREE.BackSide }),
    /** the raised lettering: the same dark semi-matte as the concept, on real relief */
    letterFace: new THREE.MeshPhysicalMaterial({ color: "#222426", roughness: 0.4, metalness: 0.05, clearcoat: 0.45, clearcoatRoughness: 0.25 }),
    brass: new THREE.MeshPhysicalMaterial({ color: "#c9a152", roughness: 0.3, metalness: 1, envMapIntensity: 1.4 }),
    brassDull: new THREE.MeshPhysicalMaterial({ color: "#a98240", roughness: 0.48, metalness: 1 }),
    copper: new THREE.MeshPhysicalMaterial({ color: "#c98459", roughness: 0.36, roughnessMap: streaks ?? undefined, metalness: 1, envMapIntensity: 1.4 }),
    stainless: new THREE.MeshPhysicalMaterial({ color: "#e4e6e8", roughness: 0.12, metalness: 1, envMapIntensity: 1.5 }),
    steelDark: new THREE.MeshPhysicalMaterial({ color: "#9a9c9e", roughness: 0.4, metalness: 1 }),
    glass: new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      roughness: 0.04,
      metalness: 0,
      transparent: true,
      opacity: 0.12,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      depthWrite: false,
    }),
    dial: new THREE.MeshStandardMaterial({ color: "#f6f6f4", roughness: 0.7, metalness: 0 }),
    needle: new THREE.MeshStandardMaterial({ color: "#c8281e", roughness: 0.45, metalness: 0.1 }),
    red: new THREE.MeshPhysicalMaterial({ color: "#c9261c", roughness: 0.38, metalness: 0, clearcoat: 0.4, clearcoatRoughness: 0.3 }),
    bolt: new THREE.MeshPhysicalMaterial({ color: "#2a2b2d", roughness: 0.42, metalness: 0.9 }),
    screw: new THREE.MeshPhysicalMaterial({ color: "#d6d8da", roughness: 0.26, metalness: 1 }),
    valveBlue: new THREE.MeshPhysicalMaterial({ color: "#1f5fb0", roughness: 0.42, metalness: 0, clearcoat: 0.35, clearcoatRoughness: 0.3 }),
    /** the sediment cartridge's three grades of spun fibre, coarse outside */
    cartWhite: bed(media.fibreCoarse, { roughness: 1 }),
    cartMid: bed(media.fibreMid, { roughness: 1 }),
    cartFine: bed(media.fibreFine, { roughness: 1 }),
    /** the moulded end caps: plain white-grey polypropylene */
    capPlain: new THREE.MeshPhysicalMaterial({ color: "#e4e4e1", roughness: 0.46, clearcoat: 0.15, clearcoatRoughness: 0.4 }),
    capBlue: new THREE.MeshPhysicalMaterial({ color: "#2c48c9", roughness: 0.42, clearcoat: 0.3, clearcoatRoughness: 0.3 }),
    /** stage 2: a hex mesh over the media, then the beds inside */
    mesh2: new THREE.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.7,
      map: hex?.map ?? undefined,
      side: THREE.DoubleSide,
    }),
    kdf: bed(media.kdf, { metalness: 0.7 }),
    gac: bed(media.gac, {}),
    /** stage 3: pale limescale-reduction crystals outside, carbon inside */
    beads: bed(media.beads, {}),
    core: new THREE.MeshPhysicalMaterial({ emissive: new THREE.Color("#3cb4ea"), emissiveIntensity: 0, color: "#eceeec", roughness: 0.5, side: THREE.DoubleSide }),
    /** the standing water in a cut housing: clear, faintly blue, refracting the media behind it */
    waterBody: new THREE.MeshPhysicalMaterial({
      color: "#c6e6f2",
      roughness: 0.05,
      metalness: 0,
      transmission: 0.55,
      ior: 1.33,
      thickness: 5,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
    /** the moving water: small glassy drops, tinted per instance from dirty to clean */
    water: new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      emissive: "#0c5a80",
      emissiveIntensity: 0.22,
      roughness: 0.08,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      transparent: true,
      opacity: 0.84,
    }),
    /** the floor the machine stands on */
    floor: new THREE.MeshStandardMaterial({ color: "#f2f3f3", roughness: 0.95, metalness: 0 }),
  };
}

/** every material that must be cut by a housing's section wedge */
export function cutMaterialsFor(m: MachineMaterials, i: number): THREE.Material[] {
  return [m.bowl[i], m.cartWhite, m.cartMid, m.cartFine, m.mesh2, m.kdf, m.gac, m.beads, m.core, m.capPlain, m.capBlue];
}

/** draw the cartridge media in idle time and swap them in; resolves when all are in */
const mediaDrawn = new WeakMap<MachineMaterials, Promise<void>>();
export function loadMachineMedia(m: MachineMaterials, size: number): Promise<void> {
  const known = mediaDrawn.get(m);
  if (known) return known;
  const job = (async () => {
    // the stage the visitor meets first is drawn first
    const order: MediaKind[] = ["fibreCoarse", "fibreMid", "fibreFine", "kdf", "gac", "beads"];
    for (const kind of order) {
      const drawn = await drawMedia(kind, size);
      if (drawn) applyMedia(m.media[kind], drawn);
    }
    if (typeof document !== "undefined") document.documentElement.dataset.ngmedia = "1";
  })();
  mediaDrawn.set(m, job);
  return job;
}
