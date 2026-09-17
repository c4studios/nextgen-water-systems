/**
 * THE JOURNEY ON A PHONE IS A SHORTER CUT OF THE SAME FILM.
 *
 * The scroll-pinned journey is written once, in desktop time: a scalar p in
 * [0, 1] over a 1050svh pin, with every beat, camera pose and part movement
 * keyed to it (MachineStage.tsx, journeyStory.ts). Phones flick rather than
 * scrub, and a ten-screen pin is where people give up, so the phone gets a
 * cut: the cover comes off at speed, the water and the three stages play at
 * full dwell, the house-out beat goes by quickly, then a straight cut past
 * the installer and servicing beats (their copy lives in the still sections
 * below) to the hand-off.
 *
 * The cut is a piecewise map from phone scroll m to desktop time p.
 * Everything downstream keeps reading p, so nothing in the scene knows it is
 * on a phone, and every jump target is written once in p and converted here.
 */
export const MOBILE_CUT_QUERY = "(max-width: 900px)";

export function isMobileCut(): boolean {
  return typeof window !== "undefined" && window.matchMedia(MOBILE_CUT_QUERY).matches;
}

/** [m0, m1, p0, p1]: phone scroll m0..m1 plays desktop time p0..p1 */
const SEGMENTS: [number, number, number, number][] = [
  [0, 0.05, 0, 0.045], // the cover, and its beat
  [0.05, 0.15, 0.045, 0.2], // the cover comes off, at speed
  [0.15, 0.21, 0.2, 0.27], // the machine, revealed
  [0.21, 0.28, 0.27, 0.335], // what the water arrives with
  [0.28, 0.79, 0.335, 0.74], // the three stages, full dwell
  [0.79, 0.85, 0.74, 0.83], // out to the house
  [0.85, 0.88, 0.83, 0.83], // hold while the picture dips…
  [0.88, 0.91, 0.955, 0.955], // …and comes back on the settled machine
  [0.91, 1, 0.955, 1], // hand-off
];

/** where the cut sits in m, and how wide the picture dip is either side */
const CUTS_M = [0.895];
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
  return CUTS_M[0];
}

/** the journey scalar that the section's scroll position corresponds to, as
 *  the scene reads it */
export function journeyProgress(raw: number): { p: number; dip: number } {
  return isMobileCut() ? mapM(raw) : { p: raw, dip: 1 };
}

export const JOURNEY_ID = "journey";

/** document y that puts the journey at desktop time p */
export function journeyY(p: number): number {
  const el = document.getElementById(JOURNEY_ID);
  if (!el) return 0;
  const frac = isMobileCut() ? unmapP(p) : p;
  return el.offsetTop + frac * (el.offsetHeight - window.innerHeight);
}

/** document y just past the journey's end */
export function journeyEndY(): number {
  const el = document.getElementById(JOURNEY_ID);
  if (!el) return 0;
  return el.offsetTop + el.offsetHeight - window.innerHeight * 0.98;
}
