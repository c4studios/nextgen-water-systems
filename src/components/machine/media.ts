/**
 * WHAT IS INSIDE THE CARTRIDGES, AS SURFACES.
 *
 * The section cut is the closest the camera ever gets, so the media carry the
 * most texture in the scene: the sediment cartridge's spun polypropylene in
 * three grades, the copper-zinc KDF granules (a brassy metal, so they glint),
 * the coconut-shell carbon (black, faceted, dull), and the limescale-reduction
 * media (small pale crystals). Each is drawn the way a macro photograph of the
 * material reads: grains packed in depth, the deeper ones darker, each grain
 * lit from one side, a cavity between them, and a colour, height and roughness
 * map drawn together so the relief and the sheen agree.
 *
 * All of it is generated on a canvas from a seeded random, so every load draws
 * the same bed and the stills match the page. It is heavy (hundreds of
 * thousands of fills), so it never runs on the critical path: the materials
 * start with neutral 1-pixel stand-ins in every slot (the shader programs are
 * compiled with the maps already in them) and the real maps are drawn in idle
 * time, a few hundred grains per slice, and swapped in when they finish.
 */
import * as THREE from "three";
import { heightToNormal } from "@/components/blueprint/surfaces";

export type MediaKind = "kdf" | "gac" | "beads" | "fibreCoarse" | "fibreMid" | "fibreFine";
export type MediaSet = { map: THREE.Texture; normalMap: THREE.Texture; roughnessMap: THREE.Texture };

const IS_CLIENT = typeof document !== "undefined";

/* ---- stand-ins, so the programs compile with every slot in place ----
   Plain textures over a 1-pixel canvas, not DataTextures: when the real bed is
   drawn it replaces the stand-in's SOURCE, so every clone of the material (each
   housing clips its own copy) picks it up through the same texture object, and
   a new source makes three allocate fresh storage at the new size. */
function pixel(r: number, g: number, b: number, srgb = false): THREE.Texture {
  const t = new THREE.Texture();
  if (IS_CLIENT) {
    const c = canvas(1);
    const g2 = c.getContext("2d")!;
    g2.fillStyle = `rgb(${r},${g},${b})`;
    g2.fillRect(0, 0, 1, 1);
    t.source = new THREE.Source(c);
    t.needsUpdate = true;
  }
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
export function standIn(repeatX = 1, repeatY = 1): MediaSet {
  const set = { map: pixel(255, 255, 255, true), normalMap: pixel(128, 128, 255), roughnessMap: pixel(255, 255, 255) };
  for (const t of Object.values(set)) t.repeat.set(repeatX, repeatY);
  return set;
}
/** put a drawn bed into the stand-in's texture objects */
export function applyMedia(into: MediaSet, drawn: MediaSet) {
  for (const k of ["map", "normalMap", "roughnessMap"] as const) {
    into[k].source = drawn[k].source;
    into[k].anisotropy = 8;
    into[k].needsUpdate = true;
  }
}

/* ---- a seeded random, so the bed is the same bed every time ---- */
function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const idle = () =>
  new Promise<void>((res) => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(() => res(), { timeout: 400 });
    else window.setTimeout(res, 16);
  });

function canvas(s: number) {
  const c = document.createElement("canvas");
  c.width = c.height = s;
  return c;
}

type Pal = { gap: string; deep: [number, number, number]; lit: [number, number, number]; rough: [number, number]; spark: number; sparkCol: string };

const PALETTES: Record<"kdf" | "gac" | "beads", Pal> = {
  // KDF 55 and 85: a copper-zinc alloy granule, brassy gold with a metal glint
  kdf: { gap: "#1c1308", deep: [92, 62, 26], lit: [236, 196, 116], rough: [0.28, 0.5], spark: 0.9, sparkCol: "255,244,208" },
  // coconut-shell carbon: black, sharp-faceted, a cool grey edge where a face turns to the light
  gac: { gap: "#020203", deep: [7, 8, 9], lit: [74, 79, 84], rough: [0.45, 0.8], spark: 0.55, sparkCol: "215,222,230" },
  // limescale-reduction media: small pale crystals, a little translucent
  beads: { gap: "#6d7478", deep: [168, 176, 180], lit: [252, 253, 250], rough: [0.18, 0.34], spark: 0.7, sparkCol: "255,255,255" },
};

/** a bed of packed grains: colour, height and roughness drawn together */
async function granules(kind: "kdf" | "gac" | "beads", S: number, seed: number): Promise<MediaSet> {
  const pal = PALETTES[kind];
  const R = rng(seed);
  const col = canvas(S), hc = canvas(S), rc = canvas(S);
  const gc = col.getContext("2d")!;
  const gh = hc.getContext("2d", { willReadFrequently: true })!;
  const gr = rc.getContext("2d")!;
  gc.fillStyle = pal.gap;
  gc.fillRect(0, 0, S, S);
  gh.fillStyle = "#000";
  gh.fillRect(0, 0, S, S);
  gr.fillStyle = "#fff";
  gr.fillRect(0, 0, S, S);

  const k = S / 1024;
  const size = kind === "kdf" ? [7, 19] : kind === "gac" ? [9, 26] : [8, 18];
  const N = Math.round((kind === "kdf" ? 3400 : kind === "gac" ? 2300 : 3000) * k * k);
  const sides = kind === "gac" ? [5, 7] : kind === "kdf" ? [7, 10] : [6, 8];
  const WRAP: [number, number][] = [[0, 0], [S, 0], [-S, 0], [0, S], [0, -S], [S, S], [-S, -S], [S, -S], [-S, S]];

  for (let i = 0; i < N; i++) {
    // later grains sit on top: they are nearer the cut face, so lighter
    const depth = i / N;
    const r = (size[0] + (size[1] - size[0]) * Math.pow(R(), 1.6)) * k;
    const x = R() * S;
    const y = R() * S;
    const n = sides[0] + Math.floor(R() * (sides[1] - sides[0] + 1));
    const rot = R() * Math.PI * 2;
    const stretch = 0.72 + R() * 0.5;
    const pts: [number, number][] = [];
    for (let v = 0; v < n; v++) {
      const a = rot + (v / n) * Math.PI * 2 + (R() - 0.5) * 0.5;
      const rr = r * (kind === "gac" ? 0.62 + R() * 0.55 : 0.8 + R() * 0.3);
      pts.push([Math.cos(a) * rr, Math.sin(a) * rr * stretch]);
    }
    const tone = 0.35 + 0.65 * Math.pow(depth, 0.7);
    const jit = (R() - 0.5) * 0.16;
    const c = (ch: number) => Math.round(pal.deep[ch] + (pal.lit[ch] - pal.deep[ch]) * Math.min(1, Math.max(0, tone + jit)));
    const mid = `rgb(${c(0)},${c(1)},${c(2)})`;
    const darkC = `rgb(${Math.round(c(0) * 0.42)},${Math.round(c(1) * 0.42)},${Math.round(c(2) * 0.42)})`;
    const hiC = `rgb(${Math.min(255, Math.round(c(0) * 1.28 + 18))},${Math.min(255, Math.round(c(1) * 1.28 + 18))},${Math.min(255, Math.round(c(2) * 1.28 + 18))})`;
    const rough = pal.rough[0] + (pal.rough[1] - pal.rough[0]) * R();
    const rv = Math.round(rough * 255);
    const hv = Math.round(90 + 165 * depth);

    for (const [dx, dy] of WRAP) {
      const cx = x + dx;
      const cy = y + dy;
      if (cx < -r * 1.4 || cx > S + r * 1.4 || cy < -r * 1.4 || cy > S + r * 1.4) continue;
      const path = new Path2D();
      if (kind === "gac") {
        pts.forEach(([px, py], v) => (v ? path.lineTo(cx + px, cy + py) : path.moveTo(cx + px, cy + py)));
        path.closePath();
      } else {
        // rounded grains: a closed quadratic spline through the midpoints
        const m = pts.map(([px, py], v) => {
          const [qx, qy] = pts[(v + 1) % n];
          return [(px + qx) / 2, (py + qy) / 2];
        });
        path.moveTo(cx + m[n - 1][0], cy + m[n - 1][1]);
        for (let v = 0; v < n; v++) path.quadraticCurveTo(cx + pts[v][0], cy + pts[v][1], cx + m[v][0], cy + m[v][1]);
        path.closePath();
      }
      // the cavity: a dark ring the grain sits in (a scaled copy of its own
      // outline; a canvas shadow blur per grain would cost seconds)
      gc.save();
      gc.translate(cx, cy);
      gc.scale(1.22, 1.22);
      gc.translate(-cx, -cy);
      gc.globalAlpha = 0.55;
      gc.fillStyle = pal.gap;
      gc.fill(path);
      gc.restore();
      // the grain, lit from the upper left
      const g1 = gc.createLinearGradient(cx - r * 0.8, cy - r * 0.8, cx + r * 0.8, cy + r * 0.8);
      g1.addColorStop(0, hiC);
      g1.addColorStop(0.45, mid);
      g1.addColorStop(1, darkC);
      gc.fillStyle = g1;
      gc.fill(path);
      if (kind === "gac") {
        // one flat facet catching the light
        const f = new Path2D();
        const a = Math.floor(R() * n);
        f.moveTo(cx, cy);
        f.lineTo(cx + pts[a][0], cy + pts[a][1]);
        f.lineTo(cx + pts[(a + 1) % n][0], cy + pts[(a + 1) % n][1]);
        f.closePath();
        gc.fillStyle = `rgba(150,160,170,${(0.1 + 0.25 * depth).toFixed(3)})`;
        gc.fill(f);
      }
      // height: a dome per grain, higher when nearer the face
      const g2 = gh.createRadialGradient(cx - r * 0.15, cy - r * 0.15, 0, cx, cy, r * 1.05);
      g2.addColorStop(0, `rgb(${hv},${hv},${hv})`);
      g2.addColorStop(0.75, `rgb(${Math.round(hv * 0.62)},${Math.round(hv * 0.62)},${Math.round(hv * 0.62)})`);
      g2.addColorStop(1, "rgb(0,0,0)");
      gh.fillStyle = g2;
      gh.fill(path);
      gr.fillStyle = `rgb(${rv},${rv},${rv})`;
      gr.fill(path);
    }
    if (i % 260 === 259) await idle();
  }
  // glints: the one cue that says metal, or crystal, at a glance
  const sparks = Math.round(900 * pal.spark * k * k);
  for (let i = 0; i < sparks; i++) {
    const x = R() * S;
    const y = R() * S;
    const s = (0.8 + R() * 1.8) * k;
    const a = 0.25 + R() * 0.65;
    const g = gc.createRadialGradient(x, y, 0, x, y, s * 2.2);
    g.addColorStop(0, `rgba(${pal.sparkCol},${a.toFixed(2)})`);
    g.addColorStop(1, `rgba(${pal.sparkCol},0)`);
    gc.fillStyle = g;
    gc.fillRect(x - s * 2.2, y - s * 2.2, s * 4.4, s * 4.4);
    gr.fillStyle = "rgb(20,20,20)";
    gr.fillRect(x - s * 0.6, y - s * 0.6, s * 1.2, s * 1.2);
  }
  await idle();
  return finish(col, hc, rc, kind === "gac" ? 3.2 : kind === "kdf" ? 2.6 : 2.2);
}

const FIBRE = {
  // outer wrap: the coarsest grade, a warm off-white, open and lumpy
  fibreCoarse: { base: [214, 206, 190], light: [240, 234, 222], dark: [150, 140, 122], clump: [60, 170], clumpA: 0.34, len: [70, 190], w: [1.0, 1.8], n: 16000, pills: 900, normal: 1.0 },
  // middle: finer and denser, a touch greyer
  fibreMid: { base: [220, 216, 206], light: [242, 239, 232], dark: [166, 160, 148], clump: [40, 120], clumpA: 0.24, len: [50, 140], w: [0.8, 1.4], n: 20000, pills: 600, normal: 0.8 },
  // inner: the finest grade, near white, closed and smooth
  fibreFine: { base: [236, 234, 228], light: [252, 251, 248], dark: [192, 189, 180], clump: [24, 80], clumpA: 0.16, len: [34, 100], w: [0.6, 1.1], n: 24000, pills: 300, normal: 0.6 },
} as const;

/** melt-blown polypropylene reads as felt: a soft, lumpy, matte bed with a
 *  haze of long fine fibres over it, never as grains or as plaster */
async function fibre(kind: "fibreCoarse" | "fibreMid" | "fibreFine", S: number, seed: number): Promise<MediaSet> {
  const F = FIBRE[kind];
  const R = rng(seed);
  const col = canvas(S), hc = canvas(S), rc = canvas(S);
  const gc = col.getContext("2d")!;
  const gh = hc.getContext("2d", { willReadFrequently: true })!;
  const gr = rc.getContext("2d")!;
  const k = S / 1024;
  const rgb = (c: readonly number[], a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
  gc.fillStyle = rgb(F.base);
  gc.fillRect(0, 0, S, S);
  gh.fillStyle = "#7a7a7a";
  gh.fillRect(0, 0, S, S);
  const WRAP5 = [[0, 0], [S, 0], [-S, 0], [0, S], [0, -S]];
  // the lumps: soft light and shadow in the bed, drawn into colour and height together
  for (let i = 0; i < 520; i++) {
    const x = R() * S;
    const y = R() * S;
    const r = (F.clump[0] + (F.clump[1] - F.clump[0]) * R()) * k;
    const up = R() < 0.55;
    const a = F.clumpA * (0.35 + 0.65 * R());
    for (const [dx, dy] of WRAP5) {
      const cx = x + dx;
      const cy = y + dy;
      if (cx < -r || cx > S + r || cy < -r || cy > S + r) continue;
      const g = gc.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, rgb(up ? F.light : F.dark, a));
      g.addColorStop(1, rgb(up ? F.light : F.dark, 0));
      gc.fillStyle = g;
      gc.fillRect(cx - r, cy - r, r * 2, r * 2);
      const h = gh.createRadialGradient(cx, cy, 0, cx, cy, r);
      h.addColorStop(0, up ? `rgba(255,255,255,${a * 0.9})` : `rgba(0,0,0,${a * 0.9})`);
      h.addColorStop(1, up ? "rgba(255,255,255,0)" : "rgba(0,0,0,0)");
      gh.fillStyle = h;
      gh.fillRect(cx - r, cy - r, r * 2, r * 2);
    }
  }
  await idle();
  // the fibre haze: long, fine, faint, curling strokes in every direction
  gc.lineCap = gh.lineCap = "round";
  const N = Math.round(F.n * k * k);
  for (let i = 0; i < N; i++) {
    const x = R() * S;
    const y = R() * S;
    const len = (F.len[0] + (F.len[1] - F.len[0]) * R()) * k;
    const a = R() * Math.PI * 2;
    const bend = (R() - 0.5) * 0.7 * len;
    const x2 = x + Math.cos(a) * len;
    const y2 = y + Math.sin(a) * len;
    const mx = (x + x2) / 2 - Math.sin(a) * bend;
    const my = (y + y2) / 2 + Math.cos(a) * bend;
    const lit = R() < 0.6;
    const alpha = (lit ? 0.07 + 0.1 * R() : 0.04 + 0.07 * R()).toFixed(3);
    const width = (F.w[0] + (F.w[1] - F.w[0]) * R()) * Math.max(0.7, k);
    for (const [dx, dy] of WRAP5) {
      if (dx !== 0 || dy !== 0) {
        const near = Math.min(x, y, S - x, S - y) < len * 1.2;
        if (!near) continue;
      }
      const path = new Path2D();
      path.moveTo(x + dx, y + dy);
      path.quadraticCurveTo(mx + dx, my + dy, x2 + dx, y2 + dy);
      gc.strokeStyle = rgb(lit ? F.light : F.dark, Number(alpha));
      gc.lineWidth = width;
      gc.stroke(path);
      gh.strokeStyle = lit ? `rgba(255,255,255,${(Number(alpha) * 1.4).toFixed(3)})` : `rgba(0,0,0,${alpha})`;
      gh.lineWidth = width * 1.6;
      gh.stroke(path);
    }
    if (i % 2600 === 2599) await idle();
  }
  // pills: the small knots of fibre that stand out of the bed
  for (let i = 0; i < Math.round(F.pills * k * k); i++) {
    const x = R() * S;
    const y = R() * S;
    const r = (1.5 + R() * 3.5) * k;
    const g = gc.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
    g.addColorStop(0, rgb(F.light, 0.55));
    g.addColorStop(1, rgb(F.light, 0));
    gc.fillStyle = g;
    gc.fillRect(x - r, y - r, r * 2, r * 2);
    const h = gh.createRadialGradient(x, y, 0, x, y, r);
    h.addColorStop(0, "rgba(255,255,255,0.5)");
    h.addColorStop(1, "rgba(255,255,255,0)");
    gh.fillStyle = h;
    gh.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // matte everywhere, the shadowed hollows a touch more so
  const img = gh.getImageData(0, 0, S, S).data;
  const rimg = gr.createImageData(S, S);
  for (let q = 0; q < S * S; q++) {
    const v = 255 - Math.round((img[q * 4] / 255) * 26);
    rimg.data[q * 4] = rimg.data[q * 4 + 1] = rimg.data[q * 4 + 2] = v;
    rimg.data[q * 4 + 3] = 255;
  }
  gr.putImageData(rimg, 0, 0);
  await idle();
  return finish(col, hc, rc, F.normal);
}

function finish(col: HTMLCanvasElement, hc: HTMLCanvasElement, rc: HTMLCanvasElement, strength: number): MediaSet {
  const map = new THREE.CanvasTexture(col);
  map.colorSpace = THREE.SRGBColorSpace;
  const normalMap = heightToNormal(hc, strength);
  const roughnessMap = new THREE.CanvasTexture(rc);
  for (const t of [map, normalMap, roughnessMap]) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 8;
    t.needsUpdate = true;
  }
  return { map, normalMap, roughnessMap };
}

export async function drawMedia(kind: MediaKind, size: number): Promise<MediaSet | null> {
  if (!IS_CLIENT) return null;
  const seed = { kdf: 11, gac: 23, beads: 37, fibreCoarse: 41, fibreMid: 53, fibreFine: 67 }[kind];
  if (kind === "kdf" || kind === "gac" || kind === "beads") return granules(kind, size, seed);
  return fibre(kind, size, seed);
}
