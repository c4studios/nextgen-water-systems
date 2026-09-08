import * as THREE from "three";

/**
 * SURFACES — generated relief for the machine.
 *
 * The scene had roughness and colour maps but no normal maps at all, so every
 * surface was geometrically smooth: the brushing on the sumps was a shading
 * trick, the cast heads were flat charcoal, the powder-coat frame was a single
 * roughness value. Nothing caught the light the way a real surface does.
 *
 * Everything here is a height field drawn on a canvas and turned into a
 * tangent-space normal map with a Sobel filter. No image assets, no fetch, and
 * the same zero-network start the studio lighting already has. The maps are
 * tileable because the Sobel wraps at the edges.
 *
 * Conventions: three.js normal maps are OpenGL-style (green = up). A canvas has
 * y pointing DOWN, so the y gradient is used as-is rather than negated — the
 * sign is verified visually, not assumed, because getting it wrong inverts the
 * lighting on one axis and reads as "something's off" without saying what.
 */

const IS_CLIENT = typeof document !== "undefined";

function canvas(w: number, h: number) {
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  return cv;
}

/** Height (grey) canvas → tangent-space normal map. `strength` scales the
 *  gradient; 1 is subtle, 3 is pronounced. */
export function heightToNormal(height: HTMLCanvasElement, strength = 2): THREE.CanvasTexture {
  const w = height.width;
  const h = height.height;
  const src = height.getContext("2d", { willReadFrequently: true })!.getImageData(0, 0, w, h).data;
  const out = canvas(w, h);
  const g = out.getContext("2d", { willReadFrequently: true })!;
  const img = g.createImageData(w, h);
  const d = img.data;
  const at = (x: number, y: number) => src[(((y + h) % h) * w + ((x + w) % w)) * 4] / 255;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Sobel
      const tl = at(x - 1, y - 1), t = at(x, y - 1), tr = at(x + 1, y - 1);
      const l = at(x - 1, y), r = at(x + 1, y);
      const bl = at(x - 1, y + 1), b = at(x, y + 1), br = at(x + 1, y + 1);
      const dx = (tr + 2 * r + br) - (tl + 2 * l + bl);
      const dy = (bl + 2 * b + br) - (tl + 2 * t + tr);
      let nx = -dx * strength;
      let ny = dy * strength;
      let nz = 1;
      const len = Math.hypot(nx, ny, nz);
      nx /= len; ny /= len; nz /= len;
      const i = (y * w + x) * 4;
      d[i] = (nx * 0.5 + 0.5) * 255;
      d[i + 1] = (ny * 0.5 + 0.5) * 255;
      d[i + 2] = (nz * 0.5 + 0.5) * 255;
      d[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(out);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  // normal data is linear; marking it sRGB would bend every vector
  tex.colorSpace = THREE.NoColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function greyTex(cv: HTMLCanvasElement, repeat: [number, number] = [1, 1]) {
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.colorSpace = THREE.NoColorSpace;
  t.anisotropy = 8;
  return t;
}

/* ------------------------------------------------------------------------ */
/* Brushed stainless — the sumps                                             */
/* ------------------------------------------------------------------------ */

/**
 * A drawn-tube stainless sump has a fine linear grain running along its length
 * (vertical on the vessel), which is what the photograph the 3D hands off from
 * shows. So the grooves run along V. Three layers: the grain itself, a finer
 * secondary pass, and a handful of handling scratches at slight angles that
 * cross the grain — a surface that has been touched, not one fresh from CAD.
 *
 * Returns a normal map AND a roughness map derived from the same field, so
 * the grooves are rougher exactly where they are deeper. That coupling is
 * what makes brushing read as brushing rather than as stripes.
 */
export function makeBrushedSteel(): { normalMap: THREE.CanvasTexture; roughnessMap: THREE.CanvasTexture } | null {
  if (!IS_CLIENT) return null;
  const w = 1024, h = 512;
  const hc = canvas(w, h);
  const g = hc.getContext("2d", { willReadFrequently: true })!;
  g.fillStyle = "#808080";
  g.fillRect(0, 0, w, h);

  // primary grain: most columns carry a groove, varied depth and run
  for (let x = 0; x < w; x++) {
    if (Math.random() > 0.72) continue;
    const depth = 8 + Math.random() * 30;
    const tone = 128 - depth;
    g.globalAlpha = 0.35 + Math.random() * 0.5;
    g.strokeStyle = `rgb(${tone | 0},${tone | 0},${tone | 0})`;
    g.lineWidth = Math.random() < 0.8 ? 1 : 2;
    const y0 = Math.random() < 0.55 ? 0 : Math.random() * h * 0.6;
    const len = Math.random() < 0.55 ? h : h * (0.25 + Math.random() * 0.75);
    g.beginPath();
    g.moveTo(x + 0.5, y0);
    g.lineTo(x + 0.5, y0 + len);
    g.stroke();
  }
  // secondary: fine, shallow, dense — the texture between the grooves
  g.globalAlpha = 0.18;
  for (let x = 0; x < w; x += 1) {
    if (Math.random() > 0.5) continue;
    const tone = 128 + (Math.random() - 0.5) * 18;
    g.strokeStyle = `rgb(${tone | 0},${tone | 0},${tone | 0})`;
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(x + 0.5, 0);
    g.lineTo(x + 0.5, h);
    g.stroke();
  }
  // handling scratches: few, brighter (raised burr), crossing the grain
  g.globalAlpha = 0.7;
  g.lineCap = "round";
  for (let k = 0; k < 14; k++) {
    const x0 = Math.random() * w, y0 = Math.random() * h;
    const a = (Math.random() - 0.5) * 0.9 + (Math.random() < 0.5 ? 0 : Math.PI / 2);
    const len = 30 + Math.random() * 140;
    g.strokeStyle = Math.random() < 0.7 ? "#a8a8a8" : "#5c5c5c";
    g.lineWidth = 1 + Math.random() * 1.6;
    g.beginPath();
    g.moveTo(x0, y0);
    g.lineTo(x0 + Math.cos(a) * len, y0 + Math.sin(a) * len);
    g.stroke();
  }
  g.globalAlpha = 1;

  // roughness from the same field: valleys and scratches scatter more light
  const rc = canvas(w, h);
  const rg = rc.getContext("2d", { willReadFrequently: true })!;
  const hd = g.getImageData(0, 0, w, h).data;
  const rimg = rg.createImageData(w, h);
  for (let i = 0; i < hd.length; i += 4) {
    const dev = Math.abs(hd[i] - 128) / 128; // 0 flat, 1 deep
    const rough = 0.3 + dev * 0.55; // 0.30 on the flats, up to ~0.85 in a scratch
    const v = rough * 255;
    rimg.data[i] = rimg.data[i + 1] = rimg.data[i + 2] = v;
    rimg.data[i + 3] = 255;
  }
  rg.putImageData(rimg, 0, 0);

  const normalMap = heightToNormal(hc, 2.4);
  normalMap.repeat.set(3, 2);
  const roughnessMap = greyTex(rc, [3, 2]);
  return { normalMap, roughnessMap };
}

/* ------------------------------------------------------------------------ */
/* Cast / sandblast grain — the heads                                        */
/* ------------------------------------------------------------------------ */

/** Die-cast then blasted: a fine pitted grain with a few shallow dents. The
 *  real heads are matte charcoal and the pitting is what stops them reading as
 *  a painted cylinder. */
export function makeCastGrain(): THREE.CanvasTexture | null {
  if (!IS_CLIENT) return null;
  const s = 512;
  const hc = canvas(s, s);
  const g = hc.getContext("2d", { willReadFrequently: true })!;
  g.fillStyle = "#808080";
  g.fillRect(0, 0, s, s);
  for (let k = 0; k < 6500; k++) {
    const r = 1.2 + Math.random() * 4.5;
    const x = Math.random() * s, y = Math.random() * s;
    const up = Math.random() < 0.5;
    const amp = 6 + Math.random() * 20;
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    const tone = up ? 128 + amp : 128 - amp;
    grad.addColorStop(0, `rgba(${tone | 0},${tone | 0},${tone | 0},0.6)`);
    grad.addColorStop(1, "rgba(128,128,128,0)");
    g.fillStyle = grad;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }
  // shallow dents from the die
  for (let k = 0; k < 9; k++) {
    const r = 14 + Math.random() * 30;
    const x = Math.random() * s, y = Math.random() * s;
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, "rgba(110,110,110,0.5)");
    grad.addColorStop(1, "rgba(128,128,128,0)");
    g.fillStyle = grad;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }
  const n = heightToNormal(hc, 1.7);
  n.repeat.set(2, 1);
  return n;
}

/* ------------------------------------------------------------------------ */
/* Powder-coat orange peel — the frame                                       */
/* ------------------------------------------------------------------------ */

/** Powder-coat cures with a faint dimpled skin. Fine and low: at the frame's
 *  distance from camera it should be felt in the highlight, not seen. */
export function makeOrangePeel(): THREE.CanvasTexture | null {
  if (!IS_CLIENT) return null;
  const s = 256;
  const hc = canvas(s, s);
  const g = hc.getContext("2d", { willReadFrequently: true })!;
  g.fillStyle = "#808080";
  g.fillRect(0, 0, s, s);
  for (let k = 0; k < 9000; k++) {
    const r = 0.8 + Math.random() * 2.2;
    const x = Math.random() * s, y = Math.random() * s;
    const amp = 4 + Math.random() * 9;
    const tone = Math.random() < 0.5 ? 128 + amp : 128 - amp;
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `rgba(${tone | 0},${tone | 0},${tone | 0},0.55)`);
    grad.addColorStop(1, "rgba(128,128,128,0)");
    g.fillStyle = grad;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }
  const n = heightToNormal(hc, 0.9);
  n.repeat.set(4, 4);
  return n;
}

/* ------------------------------------------------------------------------ */
/* Imperfections — the layer that makes it look handled                     */
/* ------------------------------------------------------------------------ */

/**
 * A fingerprint. Physically it is a film of oil, which does one thing to
 * brushed steel: it raises roughness, so the highlight goes dull and slightly
 * lighter exactly there. So this is a single grey texture used as BOTH the
 * alpha map (where the smudge is) and the roughness map (how dull), on a decal
 * whose material otherwise matches the steel. Ridges are concentric, slightly
 * wobbly ellipses; the whole patch fades to nothing at the edge.
 */
export function makeSmudge(): THREE.CanvasTexture | null {
  if (!IS_CLIENT) return null;
  const s = 256;
  const cv = canvas(s, s);
  const g = cv.getContext("2d", { willReadFrequently: true })!;
  g.fillStyle = "#000";
  g.fillRect(0, 0, s, s);
  const cx = s / 2, cy = s / 2, rx = 88, ry = 112, rot = 0.35;
  const img = g.createImageData(s, s);
  const d = img.data;
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      // ellipse-space coordinates
      const dx = x - cx, dy = y - cy;
      const ex = (dx * Math.cos(rot) + dy * Math.sin(rot)) / rx;
      const ey = (-dx * Math.sin(rot) + dy * Math.cos(rot)) / ry;
      const rr = Math.hypot(ex, ey); // 0 centre, 1 edge
      if (rr > 1) continue;
      // soft edge
      const fall = 1 - Math.pow(Math.max(0, (rr - 0.55) / 0.45), 1.6);
      // Ridges. The first pass read as a bullseye: perfectly concentric,
      // high-contrast rings. A real print on steel is an oily patch first and
      // whorls second, so the ridge contrast is low, the rings drift with two
      // wobble terms so no two are the same shape, and there is a broken
      // quality to them from a noise term that occasionally drops a ridge.
      const ang = Math.atan2(ey, ex);
      const wob = Math.sin(ang * 5 + rr * 9) * 0.02 + Math.sin(ang * 13 - rr * 4) * 0.011;
      const band = 0.5 + 0.5 * Math.sin((rr + wob) * 2 * Math.PI * 13);
      const drop = 0.75 + 0.25 * Math.sin(ang * 21 + rr * 31); // breaks the rings
      const ridge = Math.pow(band, 1.6) * drop;
      // mostly the patch (0.6), a little of the ridges (0.4); the film is
      // what dulls the steel, the ridges are just visible in it
      const v = fall * (0.6 + 0.4 * ridge) * 0.72;
      const i = (y * s + x) * 4;
      d[i] = d[i + 1] = d[i + 2] = v * 255;
      d[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.NoColorSpace;
  return t;
}

/**
 * Condensation. A cold mains pipe in a warm garage sweats, and beads sit on
 * the upper surface where they have not yet run. Each bead is a dome height
 * field, so the normal map lenses the light across it; the alpha map cuts the
 * decal to the beads only. Cheap to draw and cheap to render: no refraction,
 * just clearcoat and a normal.
 */
export function makeDroplets(count = 120): { normalMap: THREE.CanvasTexture; alphaMap: THREE.CanvasTexture } | null {
  if (!IS_CLIENT) return null;
  const s = 256;
  const hc = canvas(s, s);
  const ac = canvas(s, s);
  const hg = hc.getContext("2d", { willReadFrequently: true })!;
  const ag = ac.getContext("2d", { willReadFrequently: true })!;
  hg.fillStyle = "#808080";
  hg.fillRect(0, 0, s, s);
  ag.fillStyle = "#000";
  ag.fillRect(0, 0, s, s);
  const himg = hg.getImageData(0, 0, s, s);
  const aimg = ag.getImageData(0, 0, s, s);
  const beads: Array<[number, number, number]> = [];
  for (let k = 0; k < count; k++) {
    // beads gather toward the top of the tile (the upper surface of the pipe)
    const r = 2.2 + Math.random() * Math.random() * 7;
    beads.push([Math.random() * s, Math.pow(Math.random(), 1.5) * s, r]);
  }
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      let hgt = 0, a = 0;
      for (const [bx, by, r] of beads) {
        const dd = Math.hypot(x - bx, y - by);
        if (dd >= r) continue;
        const dome = Math.sqrt(1 - (dd / r) * (dd / r)); // hemisphere profile
        hgt = Math.max(hgt, dome);
        a = Math.max(a, Math.min(1, (r - dd) / 0.9)); // 1px soft edge
      }
      const i = (y * s + x) * 4;
      const hv = 128 + hgt * 110;
      himg.data[i] = himg.data[i + 1] = himg.data[i + 2] = hv;
      himg.data[i + 3] = 255;
      aimg.data[i] = aimg.data[i + 1] = aimg.data[i + 2] = a * 255;
      aimg.data[i + 3] = 255;
    }
  }
  hg.putImageData(himg, 0, 0);
  ag.putImageData(aimg, 0, 0);
  const normalMap = heightToNormal(hc, 3.2);
  normalMap.wrapS = normalMap.wrapT = THREE.ClampToEdgeWrapping;
  const alphaMap = new THREE.CanvasTexture(ac);
  alphaMap.colorSpace = THREE.NoColorSpace;
  return { normalMap, alphaMap };
}

/**
 * One scratch. A hairline where something metal was dragged across a head:
 * bright (the raised burr) with a dark shadow line beside it. Used as an
 * alpha-cut decal with its own normal so it catches light as a ridge.
 */
export function makeScratch(): { normalMap: THREE.CanvasTexture; alphaMap: THREE.CanvasTexture } | null {
  if (!IS_CLIENT) return null;
  const w = 256, h = 64;
  const hc = canvas(w, h);
  const ac = canvas(w, h);
  const hg = hc.getContext("2d", { willReadFrequently: true })!;
  const ag = ac.getContext("2d", { willReadFrequently: true })!;
  hg.fillStyle = "#808080";
  hg.fillRect(0, 0, w, h);
  ag.fillStyle = "#000";
  ag.fillRect(0, 0, w, h);
  // a slightly curved path, thicker in the middle where the pressure was
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    pts.push([12 + t * (w - 24), h / 2 + Math.sin(t * Math.PI) * 6 + Math.sin(t * 19) * 1.2]);
  }
  const stroke = (ctx: CanvasRenderingContext2D, style: string, width: number, dy: number) => {
    ctx.strokeStyle = style;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y + dy) : ctx.moveTo(x, y + dy)));
    ctx.stroke();
  };
  stroke(hg, "#5a5a5a", 2.2, 1.1); // the groove
  stroke(hg, "#b8b8b8", 1.2, -0.6); // the burr beside it
  stroke(ag, "#fff", 3.4, 0);
  const normalMap = heightToNormal(hc, 3);
  normalMap.wrapS = normalMap.wrapT = THREE.ClampToEdgeWrapping;
  const alphaMap = new THREE.CanvasTexture(ac);
  alphaMap.colorSpace = THREE.NoColorSpace;
  return { normalMap, alphaMap };
}

/**
 * GRANULAR MEDIA in section — KDF 55 (copper-zinc, brass-gold) or coconut-
 * shell GAC (glossy black shards). The old bed was a copper tint with pixel
 * speckle and read as cork. Here every grain is its own jittered polygon with
 * a highlight and a shadow side, drawn over a dark gap colour so the bed has
 * air in it, and a height dome per grain drives a normal map so the grains
 * catch the key light individually. Tiles in both axes (grains near an edge
 * are drawn again across it).
 */
export function makeGranules(kind: "kdf" | "gac"): { map: THREE.CanvasTexture; normalMap: THREE.CanvasTexture } | null {
  if (!IS_CLIENT) return null;
  const s = 512;
  const col = canvas(s, s), hc = canvas(s, s);
  const gc = col.getContext("2d", { willReadFrequently: true })!;
  const gh = hc.getContext("2d", { willReadFrequently: true })!;
  const pal =
    kind === "kdf"
      ? { gap: "#1a1208", hi: "#f6dc94", mid: "#c99a45", lo: "#5e3f16", spark: "rgba(255,246,214,0.55)" }
      : { gap: "#040506", hi: "#6a7178", mid: "#1c2024", lo: "#07090b", spark: "rgba(210,220,228,0.35)" };
  gc.fillStyle = pal.gap;
  gc.fillRect(0, 0, s, s);
  gh.fillStyle = "#000000";
  gh.fillRect(0, 0, s, s);
  const WRAP: [number, number][] = [[0, 0], [s, 0], [-s, 0], [0, s], [0, -s], [s, s], [-s, -s], [s, -s], [-s, s]];
  const grain = (x: number, y: number, r: number, rot: number) => {
    const n = 7;
    const pts: [number, number][] = [];
    for (let k = 0; k < n; k++) {
      const a = rot + (k / n) * Math.PI * 2;
      const rr = r * (0.72 + Math.random() * 0.36);
      pts.push([Math.cos(a) * rr, Math.sin(a) * rr]);
    }
    for (const [dx, dy] of WRAP) {
      const cx = x + dx, cy = y + dy;
      if (cx < -r || cx > s + r || cy < -r || cy > s + r) continue;
      const path = new Path2D();
      pts.forEach(([px, py], k) => (k ? path.lineTo(cx + px, cy + py) : path.moveTo(cx + px, cy + py)));
      path.closePath();
      // colour: lit from the upper left, falling to the shadow side
      const g1 = gc.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.1, cx, cy, r * 1.05);
      g1.addColorStop(0, pal.hi);
      g1.addColorStop(0.45, pal.mid);
      g1.addColorStop(1, pal.lo);
      gc.fillStyle = g1;
      gc.fill(path);
      // height: a dome, so the normal map rounds each grain
      const g2 = gh.createRadialGradient(cx, cy, 0, cx, cy, r);
      g2.addColorStop(0, "#ffffff");
      g2.addColorStop(0.7, "#9a9a9a");
      g2.addColorStop(1, "#000000");
      gh.fillStyle = g2;
      gh.fill(path);
    }
  };
  const N = kind === "kdf" ? 1500 : 1100;
  for (let k = 0; k < N; k++) {
    const r = kind === "kdf" ? 5 + Math.random() * 6 : 6 + Math.random() * 8;
    grain(Math.random() * s, Math.random() * s, r, Math.random() * Math.PI * 2);
  }
  // specular pinpoints: the one cue that says metal, or glassy carbon, at a glance
  for (let k = 0; k < 500; k++) {
    gc.fillStyle = pal.spark;
    gc.fillRect(Math.random() * s, Math.random() * s, 1.2, 1.2);
  }
  const map = new THREE.CanvasTexture(col);
  map.colorSpace = THREE.SRGBColorSpace;
  const normalMap = heightToNormal(hc, kind === "kdf" ? 2.2 : 2.6);
  for (const t of [map, normalMap]) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 8;
  }
  return { map, normalMap };
}
