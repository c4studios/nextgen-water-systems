/**
 * WHAT'S YOUR WATER DOING? The answers on the home page's first screen.
 *
 * Each answer names the stage whose media is there for it. The hero opens that
 * housing on the machine (heroes/HeroAsk.tsx), the journey marks the same stage
 * as the visitor's own (content/yourWater.ts), and the plain words ride into
 * the booking (BookingForm).
 *
 * Copy rules are the checklist's (content/signs.ts, content/taste.ts): a
 * mechanism in the datasheet's terms, never an outcome or a figure, and
 * nothing that implies the water is softened.
 */
export const ASK_KEY = "ngw:ask";

export type Ask = {
  id: string;
  label: string;
  /** what the booking form and the journey get told, in plain words */
  plain: string;
  /** the housing it opens, counted from 0; null when nothing is wrong */
  stage: 0 | 1 | 2 | null;
  answer: string;
};

export const ASKS: Ask[] = [
  {
    id: "chlorine",
    label: "It tastes or smells of chlorine",
    plain: "it tastes or smells of chlorine",
    stage: 1,
    answer:
      "Stage 2. Copper-zinc granules change chlorine on contact, and coconut carbon behind them holds what is left. It is the housing opened up in the machine.",
  },
  {
    id: "kettle",
    label: "The kettle keeps scaling up",
    plain: "the kettle keeps scaling up",
    stage: 2,
    answer:
      "Stage 3. The last cartridge carries limescale-reduction media, which works on how the minerals behave. The hardness itself stays in the water.",
  },
  {
    id: "screen",
    label: "There are spots on the shower screen",
    plain: "spots on the shower screen",
    stage: 2,
    answer: "Stage 3 again. The same minerals meet the same cartridge, which works on how they behave.",
  },
  {
    id: "grit",
    label: "There’s grit or rust in the water",
    plain: "grit or rust in the water",
    stage: 0,
    answer: "Stage 1. Three layers of fibre, coarse outside and fine in the middle, rated down to one micron. Sand, rust and silt stop there.",
  },
  {
    id: "curious",
    label: "Nothing’s wrong. I’m curious",
    plain: "no complaint, just curious",
    stage: null,
    answer: "Fair enough. Under the cover are three housings with one job each. The free test tells you what is in your own water first.",
  },
];
