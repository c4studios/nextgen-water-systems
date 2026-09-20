/**
 * WHAT THE VISITOR HAS SAID ABOUT THEIR OWN WATER, AS STAGES.
 *
 * Two places on the home page ask: the hero's question (content/asks.ts) and
 * the checklist under the kettle (content/signs.ts). Both already hand their
 * plain words to the booking form through sessionStorage. The journey reads the
 * same two keys, so the stage that is there for what the visitor picked can be
 * marked as theirs when they scroll to it.
 *
 * Nothing here says more than the hero and the checklist already say: a stage
 * "is there for" a complaint. It is never an outcome at the tap.
 */
import { ASKS, ASK_KEY } from "./asks";
import { SIGNS, SIGNS_KEY } from "./signs";

export type StageNo = 1 | 2 | 3;
/** the visitor's own words, grouped by the stage they point at */
export type Told = Record<StageNo, string[]>;

export const EMPTY_TOLD: Told = { 1: [], 2: [], 3: [] };
/** the window events the two controls dispatch when their answer changes */
export const TOLD_EVENTS = [ASK_KEY, SIGNS_KEY] as const;

export function readTold(): Told {
  const told: Told = { 1: [], 2: [], 3: [] };
  let ask = "";
  let signs = "";
  try {
    ask = sessionStorage.getItem(ASK_KEY) || "";
    signs = sessionStorage.getItem(SIGNS_KEY) || "";
  } catch {
    /* private mode: nothing was handed over, so nothing is marked */
    return told;
  }
  const add = (stage: StageNo, words: string) => {
    if (!told[stage].includes(words)) told[stage].push(words);
  };
  const a = ASKS.find((x) => x.plain === ask);
  if (a && a.stage !== null) add((a.stage + 1) as StageNo, a.plain);
  const ticked = signs.split(", ");
  for (const s of SIGNS) if (ticked.includes(s.plain)) add(s.stage, s.plain);
  return told;
}

/** "a, b and c" */
const sentence = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

/** the line a stage's beat carries when the visitor's words point at it */
export function toldLine(words: string[]): string {
  if (words.length === 0) return "";
  return `You mentioned ${sentence(words)}. This is the stage that is there for ${words.length > 1 ? "them" : "it"}.`;
}

/** the stages the visitor's words point at, in order */
export const toldStages = (t: Told): StageNo[] => ([1, 2, 3] as const).filter((n) => t[n].length > 0);
