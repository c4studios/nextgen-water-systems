/**
 * THE WHOLE STORY RIDES THE JOURNEY (Slice 1 of the continuous-space rebuild).
 *
 * Every beat is locked to the scroll window where the machine supports it:
 * the contaminant problem while dirty water gathers at the V1 inlet, the
 * stage cards while the camera is parked inside each vessel, the proof
 * figures as clean water exits, credibility on the orbit, benefits on the
 * service explode, the install steps over the reassembly, and the hand-off
 * into the booking tail. No white sheets — the machine never leaves.
 *
 * Windows are fractions of the pinned journey scalar p∈[0,1] (the pin is
 * 1050svh — see LivingDrawing). `f` is the fade margin. Copy is capped at
 * ~2 sentences + 1 stat per beat; the vessel-to-vessel slides stay silent.
 *
 * ⚠️ Every performance/credibility figure stays PLACEHOLDER-flagged (*) —
 * filtration claims are regulated; only KDF/carbon-achievable claims appear
 * (no PFAS / fluoride / TDS — RO-only, see docs/filter-reference.md §5).
 */
export type Beat = {
  id: string;
  a: number;
  b: number;
  f: number;
  /** FULL literal class name — Tailwind's @layer scanner purges classes it
   *  can't find as literals in source, so never construct these */
  pos: "pb--left" | "pb--right" | "pb--tl" | "pb--bc" | "pb--below";
  eyebrow: string;
  h: string;
  body: string;
  stat?: string;
  /** drawn mini-schedule (label → value), dimension-lettered */
  rows?: [string, string][];
  cta?: boolean;
  cue?: string;
};

/** where each vessel's water-run beat parks — shared by the 3D vessel clicks
 *  AND the blueprint's clickable balloons/vessels */
export const VESSEL_BEAT_P = [0.425, 0.52, 0.635] as const;

/** drafted tooltip line per vessel (blueprint hover) */
export const VESSEL_TIPS = [
  "01 · GRADED SEDIMENT · 10/5/1 µm",
  "02 · KDF 55/85 + CARBON · REDOX",
  "03 · LIMESCALE CARBON · 1 µm",
] as const;

export const STORY_BEATS: Beat[] = [
  {
    // Sits UNDER the resting machine as a caption, centred. The dock pose puts
    // the assembly high-centre, so the band beneath it is the one place copy
    // can live without touching a vessel. No CTA here — Act 0 has the primary
    // one a single screen above; repeating it is noise, not conversion.
    id: "hero", a: -0.05, b: 0.052, f: 0.022, pos: "pb--below",
    eyebrow: "NGW-01 · WHOLE-HOME FILTRATION",
    h: "One machine at the mains.",
    body: "Three stainless vessels sit where the water comes into your house. Every tap runs through them.",
    cta: false,
  },
  {
    // the PROBLEM — told while the camera holds the mains-in side of the
    // machine (V1 frames right of centre, so the words own the left)
    id: "problem", a: 0.268, b: 0.348, f: 0.02, pos: "pb--left",
    eyebrow: "DETAIL A · MAINS IN",
    h: "The kettle. The glassware. The taste.",
    body: "Perth mains water arrives safe and then spends the rest of its life being a nuisance. Chlorine you can taste. Scale that fogs the glassware. Grit and rust picked up from the pipes on the way. Here is what the machine does with it.",
    stat: "WHAT GOES IN · CHLORINE · SCALE · SEDIMENT · RUST",
  },
  {
    id: "s1", a: 0.378, b: 0.462, f: 0.02, pos: "pb--right",
    eyebrow: "SECTION A–A · STAGE 01",
    h: "First, the grit.",
    body: "Three layers, coarse through to fine, catch the sand and rust the pipes carry. Everything behind them stays clean and lasts longer for it.",
    stat: "10 / 5 / 1 µm",
  },
  {
    // the redox bed gets DOUBLE dwell — it's the machine's signature chemistry
    id: "s2", a: 0.452, b: 0.592, f: 0.02, pos: "pb--left",
    eyebrow: "SECTION B–B · STAGE 02",
    h: "Then the taste and the smell.",
    body: "Copper-zinc granules change the chlorine as the water passes through them, and the taste and the smell go with it. Coconut carbon behind them catches what is left. This is the stage you notice at the kitchen tap.",
    stat: "THE ONE YOU TASTE",
  },
  {
    id: "s3", a: 0.582, b: 0.702, f: 0.02, pos: "pb--right",
    eyebrow: "SECTION C–C · STAGE 03",
    h: "Last, the scale.",
    body: "The final stage changes the way the minerals behave, so they rinse away instead of baking onto your kettle, your glassware and the shower screen.",
    stat: "1 µm FINAL POLISH",
  },
  {
    // the PROOF — figures surface as clean water exits the house-out side
    // (machine frames left of centre here; the schedule owns the right)
    id: "proof", a: 0.708, b: 0.784, f: 0.02, pos: "pb--right",
    eyebrow: "SCHEDULE 1 · WHAT EACH STAGE DOES",
    h: "What each stage actually does.",
    body: "You will not find a percentage on this page. Independent testing is still in progress, and until it is in hand we would rather tell you the physical job each stage does than quote a number we cannot stand behind.",
    rows: [
      ["TASTE & SMELL", "Chlorine changed on contact, then carbon"],
      ["SCALE", "Minerals rinse instead of stick"],
      ["RUST & SAND", "Held in three graded layers"],
      ["DISSOLVED METAL", "Bound to the copper-zinc media"],
    ],
  },
  {
    // CREDIBILITY — while the camera orbits the settled machine
    // Credibility that is actually true. This beat previously claimed UNSW
    // and Curtin research partnerships and international design awards,
    // asterisked "pending permission" — invented endorsements on a client's
    // site, the same category of problem as fabricated reviews. Gone. What is
    // verifiable is the installer: Aqua-Safe Plumbing & Maintenance, licensed
    // (PL10802 / GF22810), with a real 12-month workmanship warranty.
    id: "cred", a: 0.790, b: 0.846, f: 0.02, pos: "pb--left",
    eyebrow: "NOTE 1 · INSTALLATION",
    h: "A licensed plumber fits it.",
    body: "Every system is installed by Aqua-Safe Plumbing and Maintenance, licensed Perth plumbers and gas fitters. The work carries a 12-month warranty. Nothing arrives in a box for you to work out yourself.",
    stat: "PL10802 · GF22810 · 12-MONTH WORKMANSHIP WARRANTY",
  },
  {
    // BENEFITS share the explode dwell — the machine is open on screen
    id: "service", a: 0.850, b: 0.940, f: 0.02, pos: "pb--tl",
    eyebrow: "DETAIL B · SERVICE",
    h: "Servicing is a small job.",
    body: "Unscrew the bowl, lift the old cartridge out, drop the new one in. Your plumber does it on a schedule, so it is one less thing you have to remember. Tap a label to see what each stage holds.",
  },
  {
    // INSTALL steps letter in while the machine reassembles
    id: "install", a: 0.944, b: 0.978, f: 0.018, pos: "pb--left",
    eyebrow: "SEQUENCE · INSTALL",
    h: "It takes an afternoon.",
    body: "A free test at your kitchen tap first, so you know what is actually in your water. Then a clean fit at the mains, usually inside a few hours.",
    stat: "NO OBLIGATION AFTER THE TEST",
  },
  {
    id: "handoff", a: 0.980, b: 2, f: 0.02, pos: "pb--left",
    eyebrow: "APPROVED FOR ISSUE",
    h: "Find out what's in your water.",
    body: "Book the free test below. A technician comes out and tests your own supply, at your own tap, and tells you what is in it.",
    cue: "BOOK YOUR FREE WATER TEST ↓",
  },
];
