/**
 * THE STORY RIDES THE JOURNEY.
 *
 * Every beat is locked to the scroll window where the machine supports it:
 * the cover while it is on, the reveal while it lifts, the water on the
 * mains-in side, a stage while the camera is inside it and its section is
 * open, the house-out side, the installer on the orbit, servicing while the
 * bowls are down, and the hand-off on the settle. Windows are fractions of
 * the pinned journey scalar p in [0, 1]; the camera rail in MachineStage.tsx
 * is keyed to the same numbers. A beat is either in or out (Journey.tsx sets a
 * class as p crosses a or b, and its entrance and exit run on the clock), so a
 * window needs no fade width of its own. How much scroll a stretch of p gets is
 * a separate matter, settled in journeyMap.ts.
 *
 * Copy rules: every stage describes the physical job the media does, in the
 * datasheet's own terms, and never a percentage or an outcome at the tap. The
 * datasheet (FHWR-3S1-20, version 1.1, 2024) is the only source for what is
 * in each cartridge.
 */
export type Beat = {
  id: string;
  a: number;
  b: number;
  /** the same window on the phone cut, where it differs. A wide beat waits for
   *  the pipe to clear its column and leaves before the orbit crosses it; a
   *  phone's card stands on its own paper, so nothing can cross it, and every
   *  stretch with no card is a stretch with no Back or Next */
  aPhone?: number;
  bPhone?: number;
  /** FULL literal class name: Tailwind's scanner purges classes it can't find */
  pos: "jb--left" | "jb--right";
  /** the heading; a "\n" is a line break the wrap must keep */
  h: string;
  body: string;
  stat?: string;
  rows?: [string, string][];
  cue?: string;
  /** the same action as the filled pill, which is what a wide screen shows; a
   *  phone's action bar already carries the pill, so there the cue steps out */
  cuePill?: string;
  /** which stage this beat opens, for the visitor's own words (yourWater.ts) */
  stage?: 1 | 2 | 3;
  /** a further sentence for wide screens; phones keep the body short */
  more?: string;
};

/** where each stage's beat parks, for the "watch this stage" jumps */
export const VESSEL_BEAT_P = [0.41, 0.55, 0.69] as const;

export const STORY_BEATS: Beat[] = [
  {
    /* held past the start of the lift (0.045), so "take the cover off" is still
       on screen while it comes off; it is gone before the cover's edge reaches
       the copy column */
    id: "cover", a: -0.03, b: 0.095, pos: "jb--right",
    h: "Take the cover off.",
    body: "It clips on with no screws. Under it are three full-size housings on a steel frame. Keep scrolling and each one opens in turn.",
  },
  {
    id: "reveal", a: 0.19, b: 0.25, pos: "jb--left",
    h: "Three housings. One pass.",
    body: "Water goes in on the left, comes out on the right, and every tap in the house runs through it. There is no pump, no power point and no tank.",
    /* the scene has always taken a click on a housing as "go to its stage";
       nothing said so (design review, 19 Sep 2026) */
    more: "Click a housing to go straight to its stage.",
  },
  {
    /* ends at 0.314: past that the camera is closing on stage 1 and the
       supply pipe crosses the copy column */
    id: "problem", a: 0.256, b: 0.314, pos: "jb--left",
    h: "Perth water arrives safe.\nIt also arrives tasting of chlorine.",
    body: "On the way to your tap it picks up grit and rust from the pipes, and the minerals in it end up on the kettle element and the shower screen. Each of the three stages is there for one of those.",
  },
  {
    stage: 1,
    id: "s1", a: 0.345, b: 0.455, pos: "jb--left",
    h: "First, the grit.",
    body: "The first cartridge is three layers of fibre, coarse on the outside and fine in the middle, rated down to one micron. Sand, rust and silt stop here.",
    stat: "3-layer sediment · to 1 micron",
  },
  {
    stage: 2,
    /* opens at 0.49: the camera reaches stage 2 at 0.475 and its sideways
       step finishes at 0.495; opened at 0.47, the copy stood on the supply
       pipe and the frame post for its first third of a screen */
    id: "s2", a: 0.49, aPhone: 0.47, b: 0.605, pos: "jb--left",
    h: "Then the taste and the smell.",
    body: "Copper-zinc granules change the chlorine as the water passes through them, and coconut carbon behind them holds what is left. The manufacturer calls it the taste improvement cartridge.",
    stat: "KDF 55 and 85 · coconut carbon",
  },
  {
    stage: 3,
    /* opens at 0.643, for the same reason: before that the outlet pipe, its
       valve and the third housing are still crossing the copy column */
    id: "s3", a: 0.643, aPhone: 0.62, b: 0.735, pos: "jb--right",
    h: "Then the scale.",
    body: "The last cartridge carries limescale-reduction media with a second bed of coconut carbon behind it, and filters to one micron on the way out.",
    stat: "Limescale reduction · carbon · to 1 micron",
  },
  {
    /* closes at 0.815, where the camera's hold on this pose ends (CAM in
       MachineStage.tsx); the orbit that follows carries the machine across
       the column */
    id: "out", a: 0.76, b: 0.815, bPhone: 0.828, pos: "jb--right",
    h: "One pass, then every tap.",
    body: "The kitchen tap, the shower, the washing machine and the ice maker all run off the same line. There is nothing to fill and nothing to switch on.",
  },
  {
    /* closes at 0.88, with the hold on the installer's pose */
    id: "cred", a: 0.838, b: 0.88, pos: "jb--left",
    h: "A licensed plumber fits it.",
    body: "Aqua-Safe Plumbing and Maintenance install every system: licensed Perth plumbers and gas fitters, with a 12-month workmanship warranty on the work.",
    stat: "PL10802 · GF22810",
  },
  {
    id: "service", a: 0.895, b: 0.936, pos: "jb--right",
    h: "Servicing is a small job.",
    body: "Unscrew the bowl, lift the old cartridge out, drop the new one in. The manufacturer recommends a change every 12 months, and Aqua-Safe schedule it for you.",
  },
  {
    id: "handoff", a: 0.952, b: 2, pos: "jb--left",
    h: "Find out what’s in your water.",
    body: "The free test is the next step. A licensed plumber tests your own supply at your own tap and tells you what is in it.",
    more: "No obligation after the test.",
    cue: "Book below",
    cuePill: "Book a free water test",
  },
];

/** the rail's name for each stop: where you are, then what it is */
export const STAGE_LABEL: Record<string, [string, string]> = {
  cover: ["The cover", "Clips on, no screws"],
  reveal: ["The system", "One pass"],
  problem: ["The water", "As it arrives"],
  s1: ["Stage 1 of 3", "Sediment"],
  s2: ["Stage 2 of 3", "Taste and smell"],
  s3: ["Stage 3 of 3", "Scale"],
  out: ["To the house", "Every tap"],
  cred: ["Who fits it", "Licensed plumbers"],
  service: ["Servicing", "A small job"],
  handoff: ["The free test", "What is in yours"],
};

/**
 * THE RAIL IS THE PASS. One line along the foot of the frame, read left to
 * right the way the water goes through the machine, with a stop for every beat
 * and a numbered disc for each of the three stages. It fills as the visitor
 * scrolls, so it is the progress, the chapter list and a diagram of the product
 * at once. Stops are written once, in desktop time; phones hide the two beats
 * their cut skips (journeyMap.ts) and space the rest evenly.
 */
export type RailStop = {
  id: string;
  /** where the stop stands on the line, and where the rail starts naming it:
   *  the start of its beat, to the digit (it used to trail by 0.008, and the
   *  rail named the last stop while the next one's copy was already up) */
  p: number;
  /** the same on the phone cut (Beat.aPhone) */
  pPhone: number;
  /** where a jump to it lands: the beat with its picture settled (a stage with
   *  its housing fully open, the servicing beat with the bowls set down) */
  park: number;
  key: string;
  title: string;
  n: 1 | 2 | 3 | null;
  mobileHide: boolean;
};
const PARK: Record<string, number> = {
  cover: 0,
  reveal: 0.222,
  problem: 0.288,
  s1: VESSEL_BEAT_P[0],
  s2: VESSEL_BEAT_P[1],
  s3: VESSEL_BEAT_P[2],
  out: 0.795,
  cred: 0.862,
  service: 0.925,
  handoff: 0.978,
};
export const RAIL_STOPS: RailStop[] = STORY_BEATS.filter((b) => STAGE_LABEL[b.id]).map((b) => ({
  id: b.id,
  p: Math.min(Math.max(b.a, 0), 0.985),
  pPhone: Math.min(Math.max(b.aPhone ?? b.a, 0), 0.985),
  park: PARK[b.id] ?? Math.min(Math.max(b.a + 0.012, 0), 0.985),
  key: STAGE_LABEL[b.id][0],
  title: STAGE_LABEL[b.id][1],
  n: b.stage ?? null,
  mobileHide: ["cred", "service"].includes(b.id),
}));
