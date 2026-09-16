import * as THREE from "three";
import { heightToNormal } from "./surfaces";

/**
 * The Next Gen lockup, drawn for the front of the 3D cover.
 *
 * Same construction as the site's Wordmark component: NEXT GEN sets the
 * measure, and WATER SYSTEMS, the rule and the tagline are spread letter by
 * letter across it. Drawn in the page's own loaded faces (read from the CSS
 * variables next/font sets), so the cover and the nav letter identically.
 *
 * The lettering on the concept is recessed into the powder coat, so the same
 * canvas also yields a normal map: the letters sit a fraction below the face
 * and catch the light on their lower edges.
 */
function family(varName: string, fallback: string) {
  if (typeof document === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return v || fallback;
}

function spread(g: CanvasRenderingContext2D, text: string, x0: number, width: number, y: number) {
  const chars = text.split("");
  const widths = chars.map((c) => (c === " " ? g.measureText("M").width * 0.9 : g.measureText(c).width));
  const total = widths.reduce((a, b) => a + b, 0);
  const gap = chars.length > 1 ? (width - total) / (chars.length - 1) : 0;
  let x = x0;
  chars.forEach((c, i) => {
    if (c !== " ") g.fillText(c, x, y);
    x += widths[i] + gap;
  });
}

export async function makeCoverWordmark(): Promise<{ map: THREE.CanvasTexture; normalMap: THREE.CanvasTexture; aspect: number } | null> {
  if (typeof document === "undefined") return null;
  const brand = family("--font-brand", "sans-serif");
  const text = family("--font-satoshi", "sans-serif");
  try {
    await Promise.all([document.fonts.load(`400 200px ${brand}`), document.fonts.load(`500 80px ${text}`)]);
  } catch {
    /* draw with whatever is available rather than not at all */
  }

  const W = 2048;
  const H = 1024;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d", { willReadFrequently: true });
  if (!g) return null;
  g.textBaseline = "alphabetic";
  g.fillStyle = "#26282b";
  g.strokeStyle = "#26282b";

  // NEXT GEN sets the measure
  const aSize = 250;
  g.font = `400 ${aSize}px ${brand}`;
  const aW = g.measureText("NEXT GEN").width;
  const scale = Math.min(1, (W * 0.9) / aW);
  const size = aSize * scale;
  g.font = `400 ${size}px ${brand}`;
  const measure = g.measureText("NEXT GEN").width;
  const x0 = (W - measure) / 2;
  const capA = size * 0.72;
  const yA = H * 0.1 + capA;
  g.lineWidth = size * 0.035; // the concept's NEXT GEN is heavier than the face
  g.lineJoin = "round";
  g.strokeText("NEXT GEN", x0, yA);
  g.fillText("NEXT GEN", x0, yA);

  // WATER SYSTEMS, spread to the measure
  const bSize = size * 0.44;
  g.font = `500 ${bSize}px ${text}`;
  const yB = yA + size * 0.34 + bSize * 0.72;
  spread(g, "WATER SYSTEMS", x0, measure, yB);

  // the rule
  const yR = yB + bSize * 0.62;
  g.fillRect(x0, yR, measure, Math.max(3, size * 0.028));

  // the tagline
  const cSize = size * 0.2;
  g.font = `500 ${cSize}px ${text}`;
  const yC = yR + size * 0.1 + cSize * 0.72;
  spread(g, "NEXT GENERATION WATER PROTECTION", x0, measure, yC);

  // trim the canvas to the ink so the plane can be sized to the letters
  const bottom = Math.min(H, Math.ceil(yC + cSize * 0.35));
  const top = Math.max(0, Math.floor(yA - capA - size * 0.06));
  const out = document.createElement("canvas");
  out.width = W;
  out.height = bottom - top;
  const og = out.getContext("2d", { willReadFrequently: true })!;
  og.drawImage(cv, 0, top, W, bottom - top, 0, 0, W, bottom - top);

  // height field for the recess: letters low, face high
  const hc = document.createElement("canvas");
  hc.width = out.width;
  hc.height = out.height;
  const hg = hc.getContext("2d", { willReadFrequently: true })!;
  hg.fillStyle = "#ffffff";
  hg.fillRect(0, 0, hc.width, hc.height);
  hg.globalCompositeOperation = "destination-out";
  hg.filter = "blur(2px)";
  hg.drawImage(out, 0, 0);
  hg.globalCompositeOperation = "destination-over";
  hg.filter = "none";
  hg.fillStyle = "#6a6a6a";
  hg.fillRect(0, 0, hc.width, hc.height);

  const map = new THREE.CanvasTexture(out);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  const normalMap = heightToNormal(hc, 2.2);
  return { map, normalMap, aspect: out.width / out.height };
}
