/**
 * THE JOURNEY ON A PHONE IS A SHORTER CUT OF THE SAME FILM.
 *
 * The scroll-pinned journey is written once, in desktop time: a scalar p in
 * [0, 1] over a 1050svh pin, with every beat, camera pose and part movement
 * keyed to it. Phones flick rather than scrub, and a ten-screen pin is where
 * people give up, so the phone gets a cut: the dock and the drawing at speed,
 * the problem and the three stages at full dwell, then a straight cut past the
 * schedule, installer, service and install beats (their copy lives in the still
 * sections below) to the hand-off.
 *
 * The cut is a piecewise map from phone scroll m to desktop time p. Everything
 * downstream keeps reading p, so nothing in the scene knows it is on a phone,
 * and every jump target is written once in p and converted here.
 */
export const MOBILE_CUT_QUERY = "(max-width: 900px)";

export function isMobileCut(): boolean {
  return typeof window !== "undefined" && window.matchMedia(MOBILE_CUT_QUERY).matches;
}

/** [m0, m1, p0, p1]: phone scroll m0..m1 plays desktop time p0..p1 */
const SEGMENTS: [number, number, number, number][] = [
  [0, 0.05, 0, 0.06], // dock hold, under the sheet's title
  [0.05, 0.08, 0.06, 0.06], // hold while the picture dips…
  [0.08, 0.11, 0.262, 0.262], // …and comes back on the problem beat
  [0.11, 0.87, 0.262, 0.702], // problem → stage 3, full dwell
  [0.87, 0.9, 0.702, 0.702], // hold on the last stage while the picture dips
  [0.9, 0.93, 0.98, 0.98], // …and comes back on the settled machine
  [0.93, 1, 0.98, 1], // hand-off
];

/** where the cuts sit in m, and how wide each picture dip is either side.
 *  The drawing act (0.075–0.26 in p) is skipped on phones: at 350px wide it
 *  was a thumbnail of a drawing, and a thumbnail is not a figure. */
const CUTS_M = [0.095, 0.9];
const DIP_W = 0.03;

/** phone scroll → desktop time, plus the picture's dip (1 = full, 0 = black) */
export function mapM(m: number): { p: number; dip: number } {
  const x = Math.min(1, Math.max(0, m));
  let p = 1;
  for (const [m0, m1, p0, p1] of SEGMENTS) {
    if (x <= m1) {
      p = m1 === m0 ? p1 : p0 + ((x - m0) / (m1 - m0)) * (p1 - p0);
      break;
    }
  }
  let dip = 1;
  for (const c of CUTS_M) dip = Math.min(dip, 1 - Math.max(0, 1 - Math.abs(x - c) / DIP_W));
  return { p, dip };
}

/** desktop time → phone scroll, for jumps written in p. Time inside the cut
 *  lands on the cut itself. */
export function unmapP(p: number): number {
  const y = Math.min(1, Math.max(0, p));
  for (const [m0, m1, p0, p1] of SEGMENTS) {
    if (p1 === p0) continue;
    if (y >= p0 && y <= p1) return m0 + ((y - p0) / (p1 - p0)) * (m1 - m0);
  }
  // time inside a cut lands on the nearer cut
  return y < 0.262 ? CUTS_M[0] : CUTS_M[1];
}

/** the journey scalar that the plate's scroll position corresponds to, as
 *  the scene reads it */
export function journeyProgress(raw: number): { p: number; dip: number } {
  return isMobileCut() ? mapM(raw) : { p: raw, dip: 1 };
}

/** document y that puts the journey at desktop time p */
export function journeyY(p: number): number {
  const el = document.getElementById("drawing");
  if (!el) return 0;
  const frac = isMobileCut() ? unmapP(p) : p;
  return el.offsetTop + frac * (el.offsetHeight - window.innerHeight);
}

/** document y just past the journey's end */
export function journeyEndY(): number {
  const el = document.getElementById("drawing");
  if (!el) return 0;
  return el.offsetTop + el.offsetHeight - window.innerHeight * 0.98;
}
