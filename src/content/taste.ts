/**
 * "What's yours like?" — the recognition beat.
 *
 * ⚠️ COPY RULES, and they are the whole compliance surface of this component:
 *   1. Every answer describes a MECHANISM and hands to the free test. None of
 *      them promises an outcome, and none carries a figure.
 *   2. No quantifiers about people ("most people", "nine out of ten"). They
 *      read as evidence and there is none.
 *   3. The NOTHING path ACCEPTS the answer. Telling someone with no complaint
 *      that they have simply stopped noticing is the fear sell PRODUCT.md
 *      rejects, and it is the easiest line here to cross by accident.
 *   4. Nothing may imply PFAS, fluoride or dissolved-solids removal, or that
 *      the water is softened. This is a KDF/carbon system.
 */
export type TasteOption = {
  id: string;
  /** the drafted key label */
  label: string;
  /** what the booking form gets told, in plain words */
  plain: string;
  answer: string;
};

export const TASTE_OPTIONS: TasteOption[] = [
  {
    id: "chlorine",
    label: "CHLORINE",
    plain: "tastes of chlorine",
    answer:
      "That is the disinfectant still doing its job by the time it reaches you. Stage two changes chlorine on contact and the coconut carbon behind it catches what is left. It is the stage you notice at the kitchen tap.",
  },
  {
    id: "pool",
    label: "LIKE A POOL",
    plain: "tastes like a pool",
    answer:
      "Same chemistry as chlorine, usually stronger where the water has sat in the main or you are close to a dosing point. Stage two is the one that deals with it.",
  },
  {
    id: "metallic",
    label: "METALLIC",
    plain: "tastes metallic",
    answer:
      "Usually iron, or dissolved metal picked up from older fittings on the way to the tap. Copper-zinc granules hold that on their own surface instead of passing it on. Whether that is what yours is doing is a question for the test.",
  },
  {
    id: "flat",
    label: "FLAT",
    plain: "tastes flat",
    answer:
      "Flat is the hard one, and it is not always the water. Carbon changes how water carries taste, so this is worth testing before you assume the supply is the problem.",
  },
  {
    id: "earthy",
    label: "EARTHY OR MUSTY",
    plain: "tastes earthy or musty",
    answer:
      "Earthy and musty notes ride in on organic matter in the supply and tend to come and go with the season. Carbon is what handles that class of taste.",
  },
  {
    id: "smell",
    label: "IT'S THE SMELL",
    plain: "the smell is the problem",
    answer:
      "Smell and taste are the same complaint arriving by different routes. A rotten-egg note in particular is hydrogen sulphide, which stage two precipitates out as a solid rather than leaving dissolved.",
  },
  {
    id: "nothing",
    label: "TASTES OF NOTHING",
    plain: "no complaint about the taste",
    answer:
      "Then taste is not your reason, and we are not going to invent one for you. The other reason people fit this is scale: the kettle, the shower screen, the glassware out of the dishwasher. If none of that bothers you either, you do not need us yet.",
  },
  {
    id: "unsure",
    label: "NOT SURE",
    plain: "not sure what it tastes of",
    answer:
      "Hard to name is normal, and it is exactly what the free test is for. A technician tests your own supply at your own kitchen tap and tells you what is in it.",
  },
];
