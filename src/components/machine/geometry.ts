/**
 * THE PARTS, AS GEOMETRY.
 *
 * Pure builders, one per real part, all in centimetres and all reading
 * dims.ts. Turned parts are lathes of their measured profile (a bowl with its
 * wall thickness, a head with its skirt and shoulder), pressed parts are
 * extrusions of their outline (the cover's side panels with the port notch
 * bitten out of the corner), and repeated hardware is merged into one
 * geometry so a collar's twenty-eight ribs cost one draw call.
 */
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { BOWL, CARTRIDGE, COVER, FRAME, GAUGE, HEAD, TUBE } from "./dims";

const V2 = (r: number, y: number) => new THREE.Vector2(r, y);
export const lathe = (pts: [number, number][], segs = 96, phi0 = 0, phiLen = Math.PI * 2) =>
  new THREE.LatheGeometry(
    pts.map(([r, y]) => V2(r, y)),
    segs,
    phi0,
    phiLen,
  );

/* ---- housing bowl: a moulded shell with a domed foot, a grip collar and a
   threaded neck, outer surface then inner, so it is a real wall ---- */
export function bowlGeometry(): THREE.BufferGeometry {
  const b = BOWL.bottom;
  const n = 12;
  const pts: [number, number][] = [];
  pts.push([0, b], [BOWL.footR - 0.5, b], [BOWL.footR, b + 0.14]);
  for (let i = 1; i <= n; i++) {
    const a = (i / n) * (Math.PI / 2);
    pts.push([BOWL.footR + (BOWL.r - BOWL.footR) * Math.sin(a), b + 0.14 + BOWL.domeH * (1 - Math.cos(a))]);
  }
  pts.push([BOWL.r, BOWL.shoulder - 0.4]);
  pts.push([BOWL.collar.r, BOWL.shoulder], [BOWL.collar.r, BOWL.collar.y1 - 0.2], [BOWL.neck.r, BOWL.collar.y1 + 0.1], [BOWL.neck.r, BOWL.neck.y1]);
  // the inner wall, back down
  const ri = BOWL.neck.r - 0.4;
  const rb = BOWL.r - BOWL.wall;
  pts.push([ri, BOWL.neck.y1], [ri, BOWL.collar.y1], [rb, BOWL.shoulder - 1.2]);
  const fi = BOWL.footR - 0.3;
  for (let i = n; i >= 1; i--) {
    const a = (i / n) * (Math.PI / 2);
    pts.push([fi + (rb - fi) * Math.sin(a), b + BOWL.wall + 0.14 + (BOWL.domeH - 0.3) * (1 - Math.cos(a))]);
  }
  pts.push([fi, b + BOWL.wall + 0.14], [0, b + BOWL.wall + 0.14]);
  return lathe(pts, 112);
}

/** the collar's vertical grip ribs, merged */
export function collarRibsGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const h = BOWL.collar.y1 - BOWL.collar.y0 - 0.5;
  const cy = (BOWL.collar.y0 + BOWL.collar.y1) / 2;
  for (let i = 0; i < BOWL.collar.ribs; i++) {
    const a = (i / BOWL.collar.ribs) * Math.PI * 2;
    const g = new THREE.BoxGeometry(0.32, h, 0.36);
    g.translate(0, cy, BOWL.collar.r + 0.1);
    g.rotateY(a);
    parts.push(g);
  }
  return mergeGeometries(parts, false) ?? parts[0];
}

/** the neck threads: rings, hidden under the head until the bowl is unscrewed */
export function threadsGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const step = (BOWL.neck.y1 - BOWL.neck.y0 - 0.6) / (BOWL.neck.threads - 1);
  for (let i = 0; i < BOWL.neck.threads; i++) {
    const g = new THREE.TorusGeometry(BOWL.neck.r + 0.04, 0.2, 10, 96);
    g.rotateX(Math.PI / 2);
    g.translate(0, BOWL.neck.y0 + 0.3 + i * step, 0);
    parts.push(g);
  }
  return mergeGeometries(parts, false) ?? parts[0];
}

/* ---- the head: black moulding, skirt over the neck, shoulder, body to the plate ---- */
export function headGeometry(): THREE.BufferGeometry {
  const pts: [number, number][] = [
    [BOWL.neck.r + 0.12, HEAD.skirtY0],
    [HEAD.skirtR - 0.35, HEAD.skirtY0],
    [HEAD.skirtR, HEAD.skirtY0 + 0.35],
    [HEAD.skirtR, HEAD.skirtY1 - 0.5],
    [HEAD.bodyR, HEAD.bodyY0 + 0.2],
    [HEAD.bodyR, HEAD.top - 0.35],
    [HEAD.bodyR - 0.35, HEAD.top],
    [0, HEAD.top],
  ];
  return lathe(pts, 112);
}

/** the port bosses, one cylinder straight through the head along x */
export function portGeometry(): THREE.BufferGeometry {
  const len = 2 * (HEAD.bodyR + HEAD.port.len);
  const g = new THREE.CylinderGeometry(HEAD.port.r, HEAD.port.r, len, 40);
  g.rotateZ(Math.PI / 2);
  g.translate(0, HEAD.port.y, 0);
  return g;
}

/** a hex nut (or hex nipple body), axis along x */
export function hexGeometry(r: number, len: number): THREE.BufferGeometry {
  const g = new THREE.CylinderGeometry(r, r, len, 6);
  g.rotateZ(Math.PI / 2);
  return g;
}

/* ---- the frame ---- */
export function tubeGeometry(len: number, axis: "x" | "y" | "z"): THREE.BufferGeometry {
  const g = new RoundedBoxGeometry(axis === "x" ? len : TUBE, axis === "y" ? len : TUBE, axis === "z" ? len : TUBE, 2, 0.3);
  return g;
}
export function plateGeometry(): THREE.BufferGeometry {
  return new RoundedBoxGeometry(FRAME.plate.w, FRAME.plate.h, FRAME.plate.d, 3, 0.4);
}
/** the wall-mount upstand folded up along the plate's back edge, full width,
 *  rounded at both ends, a keyhole near each end (installed photograph) */
export const UPSTAND = { h: 5.8, r: 2.4, t: 0.3, holeInset: 3.4, holeR: 0.55, slot: 1.5, slotW: 0.28 } as const;
export function upstandGeometry(): THREE.BufferGeometry {
  const W = FRAME.plate.w;
  const { h: H, r: R, t, holeInset, holeR, slot, slotW } = UPSTAND;
  const s = new THREE.Shape();
  s.moveTo(-W / 2, 0);
  s.lineTo(W / 2, 0);
  s.lineTo(W / 2, H - R);
  s.absarc(W / 2 - R, H - R, R, 0, Math.PI / 2, false);
  s.lineTo(-W / 2 + R, H);
  s.absarc(-W / 2 + R, H - R, R, Math.PI / 2, Math.PI, false);
  s.lineTo(-W / 2, 0);
  for (const sx of [-1, 1]) {
    const cx = sx * (W / 2 - holeInset);
    const cy = H - 2.1;
    const k = new THREE.Path();
    const meet = Math.sqrt(holeR * holeR - slotW * slotW);
    const a0 = Math.asin(slotW / holeR);
    k.moveTo(cx + slotW, cy - meet);
    k.absarc(cx, cy, holeR, -Math.PI / 2 + a0, (3 * Math.PI) / 2 - a0, false);
    k.lineTo(cx - slotW, cy - slot);
    k.absarc(cx, cy - slot, slotW, Math.PI, 2 * Math.PI, false);
    k.lineTo(cx + slotW, cy - meet);
    s.holes.push(k);
  }
  const g = new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2, curveSegments: 18 });
  g.translate(0, 0, -t / 2);
  return g;
}
/** a pan-head screw with its washer, axis along z, head toward +z */
export function screwGeometry(): THREE.BufferGeometry {
  const washer = new THREE.CylinderGeometry(0.62, 0.62, 0.08, 28);
  washer.rotateX(Math.PI / 2);
  washer.translate(0, 0, 0.04);
  const head = new THREE.SphereGeometry(0.42, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2);
  head.scale(1, 1, 0.55);
  head.rotateX(Math.PI / 2);
  head.translate(0, 0, 0.08);
  const g = mergeGeometries([washer.toNonIndexed(), head.toNonIndexed()], false);
  return g ?? washer;
}

/** the paired moulded ribs down each bowl, following the profile over the
 *  domed foot; two pairs, opposite each other (installed photograph) */
export const BOWL_RIBS = { angles: [-40, 140], pairGap: 0.62, r: 0.2 } as const;
export function bowlRibsGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const { r: ribR, pairGap } = BOWL_RIBS;
  const b = BOWL.bottom + 0.14;
  const lift = ribR * 0.45;
  for (const deg of BOWL_RIBS.angles) {
    const c = (deg * Math.PI) / 180;
    const d = pairGap / 2 / BOWL.r;
    for (const phi of [c - d, c + d]) {
      const at = (rad: number, y: number) => new THREE.Vector3((rad + lift) * Math.sin(phi), y, (rad + lift) * Math.cos(phi));
      const pts: THREE.Vector3[] = [];
      const a0 = 0.34 * Math.PI;
      for (let k = 0; k <= 8; k++) {
        const a = a0 + ((0.5 * Math.PI - a0) * k) / 8;
        pts.push(at(BOWL.footR + (BOWL.r - BOWL.footR) * Math.sin(a), b + BOWL.domeH * (1 - Math.cos(a))));
      }
      pts.push(at(BOWL.r, BOWL.shoulder - 0.9));
      const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal");
      parts.push(new THREE.TubeGeometry(curve, 72, ribR, 10, false).toNonIndexed());
      for (const end of [pts[0], pts[pts.length - 1]]) {
        const cap = new THREE.SphereGeometry(ribR, 10, 8);
        cap.translate(end.x, end.y, end.z);
        parts.push(cap.toNonIndexed());
      }
    }
  }
  // drop the uv sets that differ between tubes and spheres
  for (const p of parts) p.deleteAttribute("uv");
  return mergeGeometries(parts, false) ?? parts[0];
}

/* ---- the gauges ---- */
export function gaugeCaseGeometry(): THREE.BufferGeometry {
  const g = new THREE.CylinderGeometry(GAUGE.r, GAUGE.r, GAUGE.depth, 72);
  g.rotateX(Math.PI / 2);
  return g;
}
export function gaugeBezelGeometry(): THREE.BufferGeometry {
  const g = new THREE.TorusGeometry(GAUGE.r - GAUGE.bezel * 0.5, GAUGE.bezel, 14, 72);
  g.translate(0, 0, GAUGE.depth / 2 + 0.1);
  return g;
}
/** a shallow domed lens over the dial */
export function gaugeGlassGeometry(): THREE.BufferGeometry {
  const rim = GAUGE.r - GAUGE.bezel;
  const sag = 0.32;
  const R = (rim * rim + sag * sag) / (2 * sag);
  const theta = Math.asin(rim / R);
  const g = new THREE.SphereGeometry(R, 64, 18, 0, Math.PI * 2, 0, theta);
  g.rotateX(Math.PI / 2);
  g.translate(0, 0, GAUGE.depth / 2 + 0.16 + sag - R);
  return g;
}
export function gaugeDialGeometry(): THREE.BufferGeometry {
  const g = new THREE.CircleGeometry(GAUGE.r - GAUGE.bezel - 0.05, 72);
  g.translate(0, 0, GAUGE.depth / 2 + 0.04);
  return g;
}

/** the dial face: a kPa scale over 270 degrees, drawn once */
export function makeDialTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const S = 512;
  const cv = document.createElement("canvas");
  cv.width = S;
  cv.height = S;
  const g = cv.getContext("2d");
  if (!g) return null;
  g.fillStyle = "#f7f7f5";
  g.fillRect(0, 0, S, S);
  const cx = S / 2;
  const cy = S / 2;
  const R = S * 0.42;
  const a0 = Math.PI * 0.75; // 0 at seven o'clock
  const a1 = Math.PI * 2.25; // full scale at five o'clock
  g.strokeStyle = "#1c1d1f";
  g.lineCap = "butt";
  for (let i = 0; i <= 50; i++) {
    const t = i / 50;
    const a = a0 + (a1 - a0) * t;
    const major = i % 10 === 0;
    const mid = i % 5 === 0;
    const len = major ? 30 : mid ? 20 : 11;
    g.lineWidth = major ? 4 : mid ? 2.6 : 1.6;
    g.beginPath();
    g.moveTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
    g.lineTo(cx + Math.cos(a) * (R - len), cy + Math.sin(a) * (R - len));
    g.stroke();
    if (major) {
      g.fillStyle = "#1c1d1f";
      g.font = "600 34px Arial, Helvetica, sans-serif";
      g.textAlign = "center";
      g.textBaseline = "middle";
      const label = String(i * 20); // 0 .. 1000
      g.fillText(label, cx + Math.cos(a) * (R - 58), cy + Math.sin(a) * (R - 58));
    }
  }
  g.strokeStyle = "#1c1d1f";
  g.lineWidth = 3;
  g.beginPath();
  g.arc(cx, cy, R + 4, a0, a1);
  g.stroke();
  g.fillStyle = "#3a3c3f";
  g.font = "500 26px Arial, Helvetica, sans-serif";
  g.textAlign = "center";
  g.fillText("kPa", cx, cy + R * 0.42);
  g.fillStyle = "#8a8d90";
  g.font = "500 18px Arial, Helvetica, sans-serif";
  g.fillText("0 – 1000", cx, cy + R * 0.56);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/* ---- the cover: ONE folded sheet ----
   A pressed steel cover is a single sheet bent over a brake: every edge the
   eye reads is a bend with a radius, and a bend catches a line of light that
   a butt joint never does. So the shell is generated as one surface: the side
   profile (the leaning foot, the front, the chamfer, the lid) filleted at each
   fold, swept across the width with its two ends rolled round onto the side
   panels; the side panels fill the inset profile; the port notches are pressed
   pockets; and the open edges at the back and the foot are hemmed inward so
   the sheet has an edge with some substance to it. The same surface drawn a
   second time from behind is the inside of the cover. */
type ProfilePt = { z: number; y: number; nz: number; ny: number; s: number };
/** the outer bend radius of the folds: 1.6 mm sheet on a 3 mm tool */
export const COVER_BEND = 0.46;

function coverProfile(R: number): ProfilePt[] {
  const { h, d, chamferTop, crease, notch } = COVER;
  const zf = d / 2;
  const zb = -d / 2;
  const nb = notch.top - notch.h;
  const nt = notch.top;
  const P: [number, number][] = [
    [zf - crease.in, 0],
    [zf, crease.y],
    [zf, nb],
    [zf, nt],
    [zf, h - chamferTop.drop],
    [zf - chamferTop.back, h],
    [zb, h],
  ];
  const radius = [0, R * 2.2, 0, 0, R, R, 0];
  const unit = (dz: number, dy: number): [number, number] => {
    const l = Math.hypot(dz, dy);
    return [dz / l, dy / l];
  };
  // travelling up the profile, the outside is to the right
  const outward = (u: [number, number]): [number, number] => [u[1], -u[0]];
  const pts: [number, number, number, number][] = [];
  for (let i = 0; i < P.length; i++) {
    const [pz, py] = P[i];
    const prev = i > 0 ? unit(pz - P[i - 1][0], py - P[i - 1][1]) : null;
    const next = i < P.length - 1 ? unit(P[i + 1][0] - pz, P[i + 1][1] - py) : null;
    if (!prev || !next || radius[i] === 0) {
      const u = prev && next ? unit(prev[0] + next[0], prev[1] + next[1]) : (prev ?? next)!;
      const n = outward(u);
      pts.push([pz, py, n[0], n[1]]);
      continue;
    }
    const turn = Math.acos(THREE.MathUtils.clamp(prev[0] * next[0] + prev[1] * next[1], -1, 1));
    const n1 = outward(prev);
    const n2 = outward(next);
    const r = radius[i];
    const dt = r * Math.tan(turn / 2);
    const cz = pz - prev[0] * dt - n1[0] * r;
    const cy = py - prev[1] * dt - n1[1] * r;
    const a1 = Math.atan2(n1[1], n1[0]);
    let da = Math.atan2(n2[1], n2[0]) - a1;
    while (da > Math.PI) da -= 2 * Math.PI;
    while (da < -Math.PI) da += 2 * Math.PI;
    const segs = Math.max(3, Math.ceil(Math.abs(da) / 0.12));
    for (let k = 0; k <= segs; k++) {
      const a = a1 + (da * k) / segs;
      pts.push([cz + Math.cos(a) * r, cy + Math.sin(a) * r, Math.cos(a), Math.sin(a)]);
    }
  }
  let s = 0;
  return pts.map(([z, y, nz, ny], i) => {
    if (i > 0) s += Math.hypot(z - pts[i - 1][0], y - pts[i - 1][1]);
    return { z, y, nz, ny, s };
  });
}

class Sheet {
  pos: number[] = [];
  nor: number[] = [];
  uv: number[] = [];
  idx: number[] = [];
  vert(x: number, y: number, z: number, nx: number, ny: number, nz: number, u: number, v: number) {
    this.pos.push(x, y, z);
    this.nor.push(nx, ny, nz);
    this.uv.push(u, v);
    return this.pos.length / 3 - 1;
  }
  /** a quad whose winding is chosen so it faces along `want` */
  quad(a: number, b: number, c: number, d: number, want: [number, number, number]) {
    this.tri(a, b, c, want);
    this.tri(a, c, d, want);
  }
  tri(a: number, b: number, c: number, want: [number, number, number]) {
    const P = this.pos;
    const ax = P[b * 3] - P[a * 3], ay = P[b * 3 + 1] - P[a * 3 + 1], az = P[b * 3 + 2] - P[a * 3 + 2];
    const bx = P[c * 3] - P[a * 3], by = P[c * 3 + 1] - P[a * 3 + 1], bz = P[c * 3 + 2] - P[a * 3 + 2];
    const nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
    if (nx * want[0] + ny * want[1] + nz * want[2] >= 0) this.idx.push(a, b, c);
    else this.idx.push(a, c, b);
  }
  /** a flat polygon (possibly concave) in a plane, triangulated */
  poly(outline: [number, number][], place: (p: [number, number]) => [number, number, number], n: [number, number, number], uvOf: (p: [number, number]) => [number, number]) {
    const tris = THREE.ShapeUtils.triangulateShape(outline.map(([a, b]) => new THREE.Vector2(a, b)), []);
    const base = outline.map((p) => {
      const [x, y, z] = place(p);
      const [u, v] = uvOf(p);
      return this.vert(x, y, z, n[0], n[1], n[2], u, v);
    });
    for (const [a, b, c] of tris) this.tri(base[a], base[b], base[c], n);
  }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute("normal", new THREE.Float32BufferAttribute(this.nor, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(this.uv, 2));
    g.setIndex(this.idx);
    g.computeBoundingSphere();
    return g;
  }
}

export function coverShellGeometry(): THREE.BufferGeometry {
  const { w, h, d, notch } = COVER;
  const R = COVER_BEND;
  const W2 = w / 2;
  const zf = d / 2;
  const zb = -d / 2;
  const nb = notch.top - notch.h;
  const nt = notch.top;
  const xn = W2 - notch.w;
  const prof = coverProfile(R);
  const iNb = prof.findIndex((p) => Math.abs(p.y - nb) < 1e-6 && Math.abs(p.z - zf) < 1e-6);
  const iNt = prof.findIndex((p) => Math.abs(p.y - nt) < 1e-6 && Math.abs(p.z - zf) < 1e-6);
  const S = new Sheet();

  /* the band: the profile swept across the width. Columns: the left roll
     (onto the side panel), the two notch lines, the right roll. */
  type Col = { kind: "roll"; sgn: number; th: number } | { kind: "flat"; x: number };
  const ROLL = 8;
  const full: Col[] = [];
  for (let k = 0; k <= ROLL; k++) full.push({ kind: "roll", sgn: -1, th: (Math.PI / 2) * (1 - k / ROLL) });
  full.push({ kind: "flat", x: -xn }, { kind: "flat", x: xn });
  for (let k = 0; k <= ROLL; k++) full.push({ kind: "roll", sgn: 1, th: (Math.PI / 2) * (k / ROLL) });
  const inner: Col[] = [{ kind: "flat", x: -xn }, { kind: "flat", x: xn }];
  const rowVerts = (p: ProfilePt, cols: Col[]) =>
    cols.map((c) => {
      if (c.kind === "flat") return S.vert(c.x, p.y, p.z, 0, p.ny, p.nz, c.x, p.s);
      const sin = Math.sin(c.th);
      const cos = Math.cos(c.th);
      const x = c.sgn * (W2 - R) + c.sgn * R * sin;
      const k = R * (cos - 1);
      return S.vert(x, p.y + k * p.ny, p.z + k * p.nz, c.sgn * sin, cos * p.ny, cos * p.nz, x, p.s);
    });
  const sweep = (from: number, to: number, cols: Col[]) => {
    let prev = rowVerts(prof[from], cols);
    for (let j = from + 1; j <= to; j++) {
      const row = rowVerts(prof[j], cols);
      const pm = prof[j - 1];
      const pj = prof[j];
      for (let c = 0; c < cols.length - 1; c++) {
        const col = cols[c];
        const col2 = cols[c + 1];
        // the outward direction of this quad, from its middle
        let nx = 0;
        let ny = (pm.ny + pj.ny) / 2;
        let nz = (pm.nz + pj.nz) / 2;
        if (col.kind === "roll" && col2.kind === "roll") {
          const th = (col.th + col2.th) / 2;
          nx = col.sgn * Math.sin(th);
          ny *= Math.cos(th);
          nz *= Math.cos(th);
        }
        S.quad(prev[c], prev[c + 1], row[c + 1], row[c], [nx, ny, nz]);
      }
      prev = row;
    }
  };
  sweep(0, iNb, full);
  sweep(iNb, iNt, inner);
  sweep(iNt, prof.length - 1, full);

  /* the side panels: the profile inset by the bend, down to the foot and back
     to the wall, with the notch bitten out of the top front corner */
  const inset = (p: ProfilePt): [number, number] => [p.z - R * p.nz, p.y - R * p.ny];
  const foot = (() => {
    // where the inset foot line meets the floor
    const a = inset(prof[0]);
    const b = inset(prof[1]);
    const t = a[1] / (a[1] - b[1]);
    return [a[0] + (b[0] - a[0]) * t, 0] as [number, number];
  })();
  const outline: [number, number][] = [[zb, 0], foot];
  for (let j = 1; j <= iNb; j++) outline.push(inset(prof[j]));
  outline.push([zf - notch.d, nb], [zf - notch.d, nt]);
  for (let j = iNt; j < prof.length; j++) outline.push(inset(prof[j]));
  // drop any point that doubles its neighbour
  const clean = outline.filter((p, i) => i === 0 || Math.hypot(p[0] - outline[i - 1][0], p[1] - outline[i - 1][1]) > 1e-4);
  for (const sgn of [-1, 1]) {
    S.poly(clean, ([z, y]) => [sgn * W2, y, z], [sgn, 0, 0], ([z, y]) => [z, y]);
  }

  /* the notch pockets: a floor, a ceiling, a back wall and an inner wall,
     pressed in from the outer sheet; the floor and ceiling follow the roll */
  for (const sgn of [-1, 1]) {
    const cornerArc: [number, number][] = [];
    for (let k = 0; k <= ROLL; k++) {
      const th = (Math.PI / 2) * (k / ROLL);
      cornerArc.push([W2 - R + R * Math.sin(th), zf - R + R * Math.cos(th)]);
    }
    const plan: [number, number][] = [[xn, zf - notch.d], [W2, zf - notch.d], ...cornerArc.slice().reverse(), [xn, zf]];
    const planX = (p: [number, number]): [number, number] => [sgn * p[0], p[1]];
    S.poly(plan.map(planX), ([x, z]) => [x, nb, z], [0, 1, 0], ([x, z]) => [x, z]);
    S.poly(plan.map(planX), ([x, z]) => [x, nt, z], [0, -1, 0], ([x, z]) => [x, z]);
    S.poly(
      [[xn, nb], [W2, nb], [W2, nt], [xn, nt]].map(([x, y]) => [sgn * x, y] as [number, number]),
      ([x, y]) => [x, y, zf - notch.d],
      [0, 0, 1],
      ([x, y]) => [x, y],
    );
    S.poly(
      [[zf - notch.d, nb], [zf, nb], [zf, nt], [zf - notch.d, nt]],
      ([z, y]) => [sgn * xn, y, z],
      [sgn, 0, 0],
      ([z, y]) => [z, y],
    );
  }

  /* the hems: the open edges folded inward, so an edge has substance */
  const HEM = 1.4;
  for (const sgn of [-1, 1]) {
    // down the back edge of each side
    S.poly([[W2 - HEM, 0], [W2, 0], [W2, h - R], [W2 - HEM, h - R]].map(([x, y]) => [sgn * x, y] as [number, number]), ([x, y]) => [x, y, zb], [0, 0, -1], ([x, y]) => [x, y]);
    // along the foot of each side
    S.poly([[W2 - HEM, zb], [W2, zb], [W2, foot[0]], [W2 - HEM, foot[0] - 0.3]].map(([x, z]) => [sgn * x, z] as [number, number]), ([x, z]) => [x, 0, z], [0, -1, 0], ([x, z]) => [x, z]);
  }
  // under the back edge of the lid
  S.poly([[-(W2 - R), h - HEM], [W2 - R, h - HEM], [W2 - R, h], [-(W2 - R), h]], ([x, y]) => [x, y, zb], [0, 0, -1], ([x, y]) => [x, y]);
  // along the front foot
  const fz = prof[0].z;
  S.poly([[-(W2 - R), fz - HEM], [W2 - R, fz - HEM], [W2 - R, fz], [-(W2 - R), fz]], ([x, z]) => [x, 0, z], [0, -1, 0], ([x, z]) => [x, z]);

  return S.geometry();
}

/* ---- the cartridges ---- */
/** a closed annular layer between two radii, from y0 to y1 */
export function annulusGeometry(r0: number, r1: number, y0: number, y1: number, segs = 96): THREE.BufferGeometry {
  return lathe(
    [
      [r0, y0],
      [r1, y0],
      [r1, y1],
      [r0, y1],
      [r0, y0],
    ],
    segs,
  );
}
/** an end cap with a centre hole for the core */
export function capGeometry(r: number, h: number, y0: number): THREE.BufferGeometry {
  const rc = CARTRIDGE.coreR + 0.15;
  return lathe(
    [
      [rc, y0],
      [r - 0.25, y0],
      [r, y0 + 0.25],
      [r, y0 + h - 0.25],
      [r - 0.25, y0 + h],
      [rc, y0 + h],
      [rc, y0],
    ],
    96,
  );
}
/** the perforated core tube: a thin open cylinder */
export function coreGeometry(y0: number, y1: number): THREE.BufferGeometry {
  return annulusGeometry(CARTRIDGE.coreR - 0.18, CARTRIDGE.coreR, y0, y1, 64);
}

/** a copper run: straight lengths and a 90 degree bend, along a polyline */
export function pipeGeometry(points: THREE.Vector3[], r: number): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.0);
  return new THREE.TubeGeometry(curve, Math.max(8, points.length * 12), r, 24, false);
}
/** a soldered elbow between two straight lengths, so bends read as fittings */
export function elbowGeometry(r: number): THREE.BufferGeometry {
  return new THREE.SphereGeometry(r * 1.18, 24, 16);
}
