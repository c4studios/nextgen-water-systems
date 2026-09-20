/**
 * THE JOURNEY IS WRITTEN ONCE AND PACED TWICE.
 *
 * The scroll-pinned journey is written in one timeline: a scalar p in [0, 1],
 * with every beat, camera pose and part movement keyed to it (MachineStage.tsx,
 * journeyStory.ts). How much SCROLL each stretch of that timeline gets is a
 * separate decision, made here, as a piecewise map from the section's scroll
 * fraction m to p. Everything downstream keeps reading p, so nothing in the
 * scene knows which pacing it is on, and every jump target is written once in
 * p and converted here.
 *
 * THE WIDE CUT (19 Sep 2026). The design review timed the film as scrolled:
 * the cover's lift had about 140svh with nothing to read for most of it, and
 * the three beats that close the sale (who fits it, servicing, the hand-off)
 * had 45 to 55svh each, roughly one notch of a mouse wheel with their copy
 * fully up. The wide cut takes scroll from the lift and gives it to the end.
 * Its joins sit on the camera's own keys (CAM in MachineStage.tsx), where the
 * camera is at rest, so a change of pace is never felt as a jolt.
 *
 * THE PHONE CUT. Phones flick rather than scrub, and a ten-screen pin is where
 * people give up, so the phone gets a shorter film: the cover comes off at
 * speed, the water and the three stages play at full dwell, the house-out beat
 * goes by quickly, then a straight cut past the installer and servicing beats
 * (their copy lives in the still sections below) to the hand-off. The cut
 * itself is a timed dissolve (Journey.tsx), not a scrubbed one: a scrubbed
 * dip left a ghost of the machine on screen wherever a thumb happened to stop.
 */
export const MOBILE_CUT_QUERY = "(max-width: 900px)";

export function isMobileCut(): boolean {
  return typeof window !== "undefined" && window.matchMedia(MOBILE_CUT_QUERY).matches;
}

/** [m0, m1, p0, p1]: scroll m0..m1 plays journey time p0..p1 */
type Seg = [number, number, number, number];

/** the wide cut, of a 1050svh pin (950svh of travel) */
const WIDE: Seg[] = [
  [0, 0.0474, 0, 0.05], // the cover, and its beat: 45svh
  [0.0474, 0.1526, 0.05, 0.2], // the cover comes off: 100svh, was 143
  [0.1526, 0.3, 0.2, 0.34], // the machine, and what the water arrives with: 140svh
  [0.3, 0.4263, 0.34, 0.475], // stage 1: 120svh
  [0.4263, 0.5579, 0.475, 0.625], // stage 2: 125svh, was 143
  [0.5579, 0.6895, 0.625, 0.77], // stage 3: 125svh
  [0.6895, 0.7684, 0.77, 0.85], // out to the house: 75svh
  [0.7684, 0.8474, 0.85, 0.905], // who fits it: 75svh, was 52
  [0.8474, 0.9263, 0.905, 0.955], // servicing: 75svh, was 48
  [0.9263, 1, 0.955, 1], // the hand-off: 70svh, was 43
];

/** the phone cut, of a 620svh pin */
const PHONE: Seg[] = [
  [0, 0.05, 0, 0.045], // the cover, and its beat
  [0.05, 0.15, 0.045, 0.2], // the cover comes off, at speed
  [0.15, 0.21, 0.2, 0.27], // the machine, revealed
  [0.21, 0.28, 0.27, 0.335], // what the water arrives with
  [0.28, 0.79, 0.335, 0.74], // the three stages, full dwell
  [0.79, 0.88, 0.74, 0.83], // out to the house
  [0.88, 0.88, 0.83, 0.955], // THE CUT: past the installer and servicing beats
  [0.88, 1, 0.955, 1], // the hand-off
];
/** where the phone's cut sits, in scroll and in journey time either side */
export const PHONE_CUT = { m: 0.88, before: 0.83, after: 0.955 } as const;

const segs = () => (isMobileCut() ? PHONE : WIDE);

/** scroll fraction → journey time */
export function mapM(m: number, table: Seg[] = segs()): number {
  const x = Math.min(1, Math.max(0, m));
  for (const [m0, m1, p0, p1] of table) {
    if (m1 === m0) continue;
    if (x <= m1) return p0 + ((x - m0) / (m1 - m0)) * (p1 - p0);
  }
  return 1;
}

/** journey time → scroll fraction, for jumps written in p. Time inside the
 *  phone's cut lands on the cut itself. */
export function unmapP(p: number, table: Seg[] = segs()): number {
  const y = Math.min(1, Math.max(0, p));
  for (const [m0, m1, p0, p1] of table) {
    if (m1 === m0) {
      if (y > p0 && y < p1) return m0;
      continue;
    }
    if (y >= p0 && y <= p1) return m0 + ((y - p0) / (p1 - p0)) * (m1 - m0);
  }
  return 1;
}
/** the same, for a named layout: the rail draws its stops with it */
export const unmapWide = (p: number) => unmapP(p, WIDE);

/** the journey scalar that the section's scroll position corresponds to, as
 *  the scene reads it */
export function journeyProgress(raw: number): { p: number; m: number } {
  const m = Math.min(1, Math.max(0, raw));
  return { p: mapM(m), m };
}

export const JOURNEY_ID = "journey";

/** document y that puts the journey at journey time p */
export function journeyY(p: number): number {
  const el = document.getElementById(JOURNEY_ID);
  if (!el) return 0;
  return el.offsetTop + unmapP(p) * (el.offsetHeight - window.innerHeight);
}

/** document y of the first thing past the journey: "skip the section" means
 *  past it, with the next section's own top edge at the top of the screen */
export function journeyEndY(): number {
  const el = document.getElementById(JOURNEY_ID);
  if (!el) return 0;
  return el.offsetTop + el.offsetHeight;
}
