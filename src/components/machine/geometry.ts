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
/** a wall-mount ear with a keyhole, standing in the x-y plane */
export function earGeometry(): THREE.BufferGeometry {
  const { w, h, holeR } = FRAME.ear;
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0);
  s.lineTo(w / 2, 0);
  s.lineTo(w / 2, h - 1.2);
  s.absarc(0, h - 1.2, w / 2, 0, Math.PI, false);
  s.lineTo(-w / 2, 0);
  const hole = new THREE.Path();
  hole.absarc(0, h - 1.5, holeR, 0, Math.PI * 2, true);
  const slot = new THREE.Path();
  slot.moveTo(-0.32, h - 1.5);
  slot.lineTo(0.32, h - 1.5);
  slot.lineTo(0.32, h - 3.0);
  slot.lineTo(-0.32, h - 3.0);
  slot.lineTo(-0.32, h - 1.5);
  s.holes.push(hole, slot);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.3, bevelEnabled: false });
  g.translate(0, 0, -0.15);
  return g;
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

/* ---- the cover: a folded sheet-steel shell, open at the back ---- */
type Pt = [number, number]; // (z, y) in the side-profile plane
export function coverGeometries() {
  const { w, h, d, t, chamferTop, crease, notch } = COVER;
  const zf = d / 2;
  const zb = -d / 2;
  const nb = notch.top - notch.h;
  const nt = notch.top;

  // side panel outline, with the port notch bitten out of the top front corner
  const side = new THREE.Shape();
  const sp: Pt[] = [
    [zb, 0],
    [zf - crease.in, 0],
    [zf, crease.y],
    [zf, nb],
    [zf - notch.d, nb],
    [zf - notch.d, nt],
    [zf, nt],
    [zf, h - chamferTop.drop],
    [zf - chamferTop.back, h],
    [zb, h],
  ];
  side.moveTo(sp[0][0], sp[0][1]);
  for (let i = 1; i < sp.length; i++) side.lineTo(sp[i][0], sp[i][1]);
  side.closePath();
  const sideGeo = new THREE.ExtrudeGeometry(side, { depth: t, bevelEnabled: false });
  // ExtrudeGeometry lays the shape in x-y and extrudes along z; the shape is
  // (z, y), so turn it so its first axis becomes world z and the extrusion
  // becomes world x
  sideGeo.rotateY(-Math.PI / 2);

  // the front-and-lid band: the outer polyline and its inner offset, closed
  const band = (outer: Pt[], inner: Pt[]) => {
    const s = new THREE.Shape();
    s.moveTo(outer[0][0], outer[0][1]);
    for (let i = 1; i < outer.length; i++) s.lineTo(outer[i][0], outer[i][1]);
    for (let i = inner.length - 1; i >= 0; i--) s.lineTo(inner[i][0], inner[i][1]);
    s.closePath();
    return s;
  };
  const outerFull: Pt[] = [
    [zf - crease.in, 0],
    [zf, crease.y],
    [zf, h - chamferTop.drop],
    [zf - chamferTop.back, h],
    [zb, h],
  ];
  const innerFull: Pt[] = [
    [zf - crease.in - t, 0],
    [zf - t, crease.y + 0.1],
    [zf - t, h - chamferTop.drop - 0.05],
    [zf - chamferTop.back - t * 0.4, h - t],
    [zb, h - t],
  ];
  const mid = new THREE.ExtrudeGeometry(band(outerFull, innerFull), { depth: w - 2 * t - 2 * notch.w, bevelEnabled: false });
  mid.rotateY(-Math.PI / 2);
  // the two edge strips beside the notches: below it, and the lid above it
  const outerLow: Pt[] = [
    [zf - crease.in, 0],
    [zf, crease.y],
    [zf, nb],
  ];
  const innerLow: Pt[] = [
    [zf - crease.in - t, 0],
    [zf - t, crease.y + 0.1],
    [zf - t, nb],
  ];
  const outerHigh: Pt[] = [
    [zf, nt],
    [zf, h - chamferTop.drop],
    [zf - chamferTop.back, h],
    [zb, h],
  ];
  const innerHigh: Pt[] = [
    [zf - t, nt],
    [zf - t, h - chamferTop.drop - 0.05],
    [zf - chamferTop.back - t * 0.4, h - t],
    [zb, h - t],
  ];
  const edgeLow = new THREE.ExtrudeGeometry(band(outerLow, innerLow), { depth: notch.w, bevelEnabled: false });
  edgeLow.rotateY(-Math.PI / 2);
  const edgeHigh = new THREE.ExtrudeGeometry(band(outerHigh, innerHigh), { depth: notch.w, bevelEnabled: false });
  edgeHigh.rotateY(-Math.PI / 2);
  // the notch's inner return: a small sheet closing the notch's inner wall so
  // the cut reads as a pressed pocket rather than a missing corner
  const pocket = new THREE.BoxGeometry(t, notch.h, notch.d);
  return { sideGeo, mid, edgeLow, edgeHigh, pocket };
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
