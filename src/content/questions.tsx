import { INSTALLER } from "@/lib/jsonld";

/**
 * THE QUESTIONS, in one place: the questions page lists them all and the home
 * page opens with the ones people ask first, so an answer can never say one
 * thing in one place and another somewhere else.
 */
/* Every answer here is either mechanism (checkable) or a fact about the
   installer. No performance figures, no service intervals and no prices,
   because none of those are substantiated yet. See src/lib/seo.ts. */
export const QA: { q: string; a: React.ReactNode }[] = [
  {
    q: "What will I actually notice?",
    a: (
      <p>
        That depends on what is in your water, which is why the test comes first. The carbon stages are there
        for the chlorine taste and smell, and the third stage carries the manufacturer's limescale-reduction
        media. We do not promise what you will notice at the tap. The free test tells you what is in your
        supply now, and the independent report, when it exists, will say what the system does to it.
      </p>
    ),
  },
  {
    q: "Does it remove PFAS or fluoride?",
    a: (
      <p>
        No. Both need reverse osmosis, which is a different machine with a membrane, a storage tank and a drain
        line. If PFAS is the reason you are looking, say so at the test and we will tell you honestly that this
        is not the product for it.
      </p>
    ),
  },
  {
    q: "Where does it go?",
    a: (
      <p>
        Where the water enters the property, usually near the meter or in the garage. It needs clearance
        underneath so the bowls can come off at service time. The plumber works out the spot on the day.
      </p>
    ),
  },
  {
    q: "Does it need power?",
    a: (
      <p>
        No. It runs on the pressure already in your line. There is no pump, no power point and nothing to
        switch on.
      </p>
    ),
  },
  {
    q: "Will my water pressure drop?",
    a: (
      <p>
        Any cartridge filter costs you some pressure, and a loaded cartridge costs more than a fresh one. That
        is what the two gauges on the top plate are for: your plumber reads them and changes the cartridges
        before you would ever notice it at a tap.
      </p>
    ),
  },
  {
    q: "How often do the cartridges get changed?",
    a: (
      <p>
        It depends on your supply and how much water the house uses, so the interval is set after the test
        rather than promised now. The change itself is a small job: the bowl unscrews, the old cartridge lifts
        out, the new one drops in.
      </p>
    ),
  },
  {
    q: "Do I still need a filter jug?",
    a: (
      <p>
        No. That is the point of fitting it at the mains rather than under one sink. Every tap in the house is
        downstream of it, including the ones you do not think about.
      </p>
    ),
  },
  {
    q: "I am on bore or tank water, not scheme water.",
    a: (
      <p>
        Different problem, and often a harder one. Bore and tank supplies vary enormously and can need
        pre-treatment this system does not include. Book the test anyway and you will get a straight answer
        about whether it suits.
      </p>
    ),
  },
  {
    q: "What does it cost?",
    a: (
      <p>
        There is no price on this page because the answer depends on your water, where the system has to go and
        what the existing pipework is like. The test is free and carries no obligation, and you get the number
        after it rather than before.
      </p>
    ),
  },
  {
    q: "Who fits it, and is it warranted?",
    a: (
      <p>
        <a className="installer-link" href={INSTALLER.url} target="_blank" rel="noopener">
          Aqua-Safe Plumbing &amp; Maintenance
        </a>
        , licensed Perth plumbers and gas fitters (PL10802 · GF22810), fully
        insured. The installation carries a 12-month workmanship warranty.
      </p>
    ),
  },
];

/** the ones the home page shows, in the order it shows them */
export const FIRST_QUESTIONS = [
  "Does it remove PFAS or fluoride?",
  "Where does it go?",
  "Does it need power?",
  "Will my water pressure drop?",
  "What does it cost?",
];
