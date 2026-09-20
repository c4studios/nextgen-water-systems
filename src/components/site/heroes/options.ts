/** The hero options the home page can open on (components/site/HomePage.tsx),
 *  and the one it does. /preview/<key>/ shows each with a switcher. */
export type HeroKey = "ask" | "suburb" | "open" | "original";

export const HERO_OPTIONS: { key: HeroKey; name: string; idea: string }[] = [
  { key: "ask", name: "The question", idea: "Asks what the water is doing; the machine opens the stage for the answer." },
  { key: "suburb", name: "The free test", idea: "Sells the free test first and checks the suburb against Aqua-Safe's list." },
  { key: "open", name: "The open machine", idea: "The cover comes off by itself; each housing is marked and opens on a tap." },
  { key: "original", name: "The original", idea: "The closed cover and the outcome line, as it was." },
];

export const DEFAULT_HERO: HeroKey = "ask";
