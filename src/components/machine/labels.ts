/**
 * THE LABELS ON THE HOUSINGS.
 *
 * The real FHWR-3S1-20 ships with a printed label on every bowl (the supplier's
 * photographs show a white label with type and a code block). These are the
 * Next Gen versions: the lockup at the top, the stage on a dark band, the media
 * in the datasheet's own words, the housing size and the change interval.
 * Drawn on a canvas, so the type is real and the scene still fetches nothing;
 * redrawn once the web fonts have loaded.
 */
import * as THREE from "three";
import { LOCKUP } from "./lockupPaths";

type Stage = { n: string; name: string; lines: [string, string] };

const STAGES: Stage[] = [
  { n: "STAGE 1", name: "Sediment", lines: ["Three-layer sediment cartridge", "Filtration to 1 micron"] },
  { n: "STAGE 2", name: "KDF and carbon", lines: ["KDF 55 · KDF 85", "Coconut carbon"] },
  { n: "STAGE 3", name: "Limescale and carbon", lines: ["Limescale-reduction media", "Coconut carbon · to 1 micron"] },
];

const W = 512;
const H = 704;

function fontVar(name: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v ? `${v}, ${fallback}` : fallback;
}

function draw(g: CanvasRenderingContext2D, stage: Stage) {
  const display = fontVar("--font-satoshi", "sans-serif");
  const body = fontVar("--font-hanken", "sans-serif");
  g.setTransform(1, 0, 0, 1, 0, 0);
  // the label stock: warm white, a little tooth
  g.fillStyle = "#f6f6f3";
  g.fillRect(0, 0, W, H);
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 900; i++) {
    g.fillStyle = `rgba(0,0,0,${0.012 + rnd() * 0.02})`;
    g.fillRect(rnd() * W, rnd() * H, 1.4, 1.4);
  }

  // the lockup, from the same outlines as the cover's lettering
  const s = 392 / 34;
  const top = 44;
  g.save();
  g.setTransform(s, 0, 0, -s, W / 2, top + 62.3 * s);
  g.fillStyle = "#1b1d1f";
  for (const line of LOCKUP) for (const d of line.paths) g.fill(new Path2D(d));
  g.fillRect(-17, 53.55, 34, 0.12);
  g.restore();

  // the stage, on a dark band
  const bandY = 196;
  g.fillStyle = "#1b1d1f";
  g.fillRect(0, bandY, W, 92);
  g.fillStyle = "#f6f6f3";
  g.font = `700 50px ${display}`;
  g.textBaseline = "middle";
  g.textAlign = "left";
  g.fillText(stage.n, 40, bandY + 48);

  // the media, in the datasheet's words
  g.fillStyle = "#1b1d1f";
  g.font = `700 44px ${display}`;
  g.textBaseline = "alphabetic";
  g.fillText(stage.name, 40, 360);
  g.fillStyle = "#3a3e42";
  g.font = `500 27px ${body}`;
  g.fillText(stage.lines[0], 40, 408);
  g.fillText(stage.lines[1], 40, 444);

  // the rule, then the housing and the change interval
  g.fillStyle = "rgba(27,29,31,0.35)";
  g.fillRect(40, 480, W - 80, 2);
  g.fillStyle = "#3a3e42";
  g.font = `500 22px ${body}`;
  g.fillText("Housing 20 in × 4.5 in", 40, 524);
  g.fillText("Change at 12 months, 18 months max", 40, 556);

  // the code block, bottom right
  const qx = W - 40 - 120;
  const qy = H - 40 - 120;
  g.fillStyle = "#1b1d1f";
  g.fillRect(qx, qy, 120, 120);
  g.fillStyle = "#f6f6f3";
  g.fillRect(qx + 6, qy + 6, 108, 108);
  g.fillStyle = "#1b1d1f";
  for (let y = 0; y < 12; y++) for (let x = 0; x < 12; x++) if ((x * 13 + y * 7 + ((x * y) % 5)) % 3 === 0) g.fillRect(qx + 9 + x * 8.5, qy + 9 + y * 8.5, 8, 8);
  for (const [cx, cy] of [
    [qx + 9, qy + 9],
    [qx + 85, qy + 9],
    [qx + 9, qy + 85],
  ]) {
    g.fillStyle = "#1b1d1f";
    g.fillRect(cx, cy, 26, 26);
    g.fillStyle = "#f6f6f3";
    g.fillRect(cx + 5, cy + 5, 16, 16);
    g.fillStyle = "#1b1d1f";
    g.fillRect(cx + 9, cy + 9, 8, 8);
  }
  g.fillStyle = "#6a6e72";
  g.font = `500 18px ${body}`;
  g.fillText("Whole-home filtration", 40, H - 76);
  g.fillText("Installed by licensed plumbers", 40, H - 50);
}

export function makeStageLabel(i: number): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d");
  if (!g) return null;
  const stage = STAGES[i] ?? STAGES[0];
  draw(g, stage);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  // the web fonts may not be ready on the first frame: draw again once they are
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      draw(g, stage);
      t.needsUpdate = true;
    });
  }
  return t;
}
