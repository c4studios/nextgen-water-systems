/**
 * THE STORY RIDES THE JOURNEY.
 *
 * Every beat is locked to the scroll window where the machine supports it:
 * the cover while it is on, the reveal while it lifts, the water on the
 * mains-in side, a stage while the camera is inside it and its section is
 * open, the house-out side, the installer on the orbit, servicing while the
 * bowls are down, and the hand-off on the settle. Windows are fractions of
 * the pinned journey scalar p in [0, 1]; the camera rail in MachineStage.tsx
 * is keyed to the same numbers.
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
  f: number;
  /** FULL literal class name: Tailwind's scanner purges classes it can't find */
  pos: "jb--left" | "jb--right";
  /** the line under the heading, plain words, no drawing references */
  eyebrow: string;
  h: string;
  body: string;
  stat?: string;
  rows?: [string, string][];
  cue?: string;
  /** a further sentence for wide screens; phones keep the body short */
  more?: string;
};

/** where each stage's beat parks, for the "watch this stage" jumps */
export const VESSEL_BEAT_P = [0.41, 0.55, 0.69] as const;

export const STORY_BEATS: Beat[] = [
  {
    id: "cover", a: -0.02, b: 0.06, f: 0.02, pos: "jb--right",
    eyebrow: "The cover",
    h: "Take the cover off.",
    body: "It clips on with no screws. Under it are three full-size housings on a steel frame. Keep scrolling and each one opens in turn.",
  },
  {
    id: "reveal", a: 0.19, b: 0.268, f: 0.02, pos: "jb--left",
    eyebrow: "The system",
    h: "Three housings. One pass.",
    body: "Water goes in on the left, comes out on the right, and every tap in the house runs through it. There is no pump, no power point and no tank.",
  },
  {
    id: "problem", a: 0.27, b: 0.338, f: 0.02, pos: "jb--left",
    eyebrow: "What arrives",
    h: "Perth water arrives safe. It also arrives tasting of chlorine.",
    body: "On the way to your tap it picks up grit and rust from the pipes, and the minerals in it end up on the kettle element and the shower screen. This is what the three stages deal with.",
  },
  {
    id: "s1", a: 0.345, b: 0.455, f: 0.02, pos: "jb--left",
    eyebrow: "Stage 1 of 3",
    h: "First, the grit.",
    body: "The first cartridge is three layers of fibre, coarse on the outside and fine in the middle, rated down to one micron. Sand, rust and silt stop here.",
    stat: "3-layer sediment · to 1 micron",
  },
  {
    id: "s2", a: 0.47, b: 0.605, f: 0.02, pos: "jb--left",
    eyebrow: "Stage 2 of 3",
    h: "Then the taste and the smell.",
    body: "Copper-zinc granules change the chlorine as the water passes through them, and coconut carbon behind them holds what is left. This is the stage you notice at the kitchen tap.",
    stat: "KDF 55 and 85 · coconut carbon",
  },
  {
    id: "s3", a: 0.62, b: 0.735, f: 0.02, pos: "jb--right",
    eyebrow: "Stage 3 of 3",
    h: "Then the scale.",
    body: "The last cartridge carries limescale-reduction media with a second bed of coconut carbon behind it, and filters to one micron on the way out.",
    stat: "Limescale reduction · carbon · to 1 micron",
  },
  {
    id: "out", a: 0.76, b: 0.828, f: 0.02, pos: "jb--right",
    eyebrow: "To the house",
    h: "One pass, then every tap.",
    body: "The kitchen tap, the shower, the washing machine and the ice maker all run off the same line. There is nothing to fill and nothing to switch on.",
  },
  {
    id: "cred", a: 0.838, b: 0.888, f: 0.02, pos: "jb--left",
    eyebrow: "Who fits it",
    h: "A licensed plumber fits it.",
    body: "Aqua-Safe Plumbing and Maintenance install every system: licensed Perth plumbers and gas fitters, with a 12-month workmanship warranty on the work.",
    stat: "PL10802 · GF22810",
  },
  {
    id: "service", a: 0.895, b: 0.942, f: 0.02, pos: "jb--right",
    eyebrow: "Servicing",
    h: "Servicing is a small job.",
    body: "Unscrew the bowl, lift the old cartridge out, drop the new one in. The manufacturer recommends a change every 12 months, and Aqua-Safe schedule it for you.",
  },
  {
    id: "handoff", a: 0.952, b: 2, f: 0.018, pos: "jb--left",
    eyebrow: "Next",
    h: "Find out what's in your water.",
    body: "Book the free test below. A licensed plumber tests your own supply at your own tap and tells you what is in it.",
    more: "No obligation after the test.",
    cue: "Book below",
  },
];

/** the stage marker under the nav: one line per beat */
export const STAGE_LABEL: Record<string, [string, string]> = {
  reveal: ["The system", "Three housings, one pass"],
  problem: ["The water", "What arrives at the tap"],
  s1: ["Stage 1 of 3", "Sediment"],
  s2: ["Stage 2 of 3", "Taste and smell"],
  s3: ["Stage 3 of 3", "Scale"],
  out: ["To the house", "Every tap"],
  cred: ["Who fits it", "Licensed plumbers"],
  service: ["Servicing", "A small job"],
  handoff: ["Next", "Book a free water test"],
};

export const stageAt = (p: number) => STORY_BEATS.find((b) => p >= b.a && p <= b.b)?.id ?? "";

/** the rail: one stop per beat, written in desktop time; phones hide the two
 *  beats their cut skips (journeyMap.ts) */
export const RAIL_STOPS = STORY_BEATS.filter((b) => STAGE_LABEL[b.id]).map((b) => ({
  id: b.id,
  p: Math.min(b.a + 0.012, 0.985),
  label: STAGE_LABEL[b.id][0],
  mobileHide: ["cred", "service"].includes(b.id),
}));
