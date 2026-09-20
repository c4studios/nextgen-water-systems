/**
 * THE SAME WATER, EVERYWHERE ELSE IN THE HOUSE.
 *
 * The checklist under the kettle photograph. Each sign names the stage whose
 * media is there for it, in the datasheet's own terms (FHWR-3S1-20, version
 * 1.1, 2024), under the same rules as content/taste.ts:
 *   1. a mechanism, never an outcome at the tap, and never a figure;
 *   2. nothing that implies the water is softened: Stage 3's media works on
 *      how the minerals behave, and the hardness stays in the water;
 *   3. where the water may not be the cause at all, say so.
 *
 * Ticked signs ride into the booking with the taste answers (BookingForm), so
 * the plumber knows what to look at before arriving.
 */
export type Sign = {
  id: string;
  label: string;
  /** what the booking form gets told, in plain words; also the readout's words */
  plain: string;
  stage: 1 | 2 | 3;
  /** a sentence only this sign needs, after its stage's job */
  aside?: string;
  /** the plain words are a plural ("spots ... are"), for the readout's verb */
  plural?: boolean;
};

/** each stage's job, as the end of the readout's sentence (the datasheet's
 *  own terms; the journey and the stage explorer say the same) */
export const STAGE_JOB: Record<1 | 2 | 3, string> = {
  1: "three layers of fibre, rated down to one micron, where sand, rust and silt stop.",
  2: "copper-zinc granules that change chlorine on contact, with coconut carbon behind them.",
  3: "limescale-reduction media, which works on how the minerals behave. The hardness itself stays in the water.",
};

export const SIGNS: Sign[] = [
  {
    id: "screen",
    label: "Spots on the shower screen",
    plain: "spots on the shower screen",
    stage: 3,
    plural: true,
  },
  {
    id: "glasses",
    label: "Cloudy glasses from the dishwasher",
    plain: "cloudy glasses from the dishwasher",
    stage: 3,
    plural: true,
    aside: "Cloudy glass can also be the detergent, so it is worth testing the water before you blame it.",
  },
  {
    id: "chlorine",
    label: "A chlorine smell in the shower",
    plain: "a chlorine smell in the shower",
    stage: 2,
    aside: "The shower runs off the same line as the kitchen tap.",
  },
  {
    id: "grit",
    label: "Grit in the tap aerators",
    plain: "grit in the tap aerators",
    stage: 1,
  },
];

/** sessionStorage key and window event the booking form listens for */
export const SIGNS_KEY = "ngw:signs";
