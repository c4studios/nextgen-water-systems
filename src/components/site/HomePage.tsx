import { Journey } from "@/components/journey/Journey";
import { Opening } from "@/components/site/Opening";
import { HeroAsk } from "@/components/site/heroes/HeroAsk";
import { HeroSuburb } from "@/components/site/heroes/HeroSuburb";
import { HeroOpen } from "@/components/site/heroes/HeroOpen";
import { Kettle } from "@/components/site/Kettle";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Path } from "@/components/site/Path";
import { Packages } from "@/components/site/Packages";
import { Questions } from "@/components/site/Questions";
import { ConceptBand } from "@/components/site/ConceptBand";
import { SpecSchedule } from "@/components/site/SpecSchedule";
import { StaticStory } from "@/components/site/StaticStory";
import { Installer } from "@/components/site/Installer";
import { SiteSpine } from "@/components/site/SiteSpine";
import { DEFAULT_HERO, type HeroKey } from "./heroes/options";

/**
 * THE HOME PAGE: the product, then the proof, then the test.
 *
 *   HERO       one of the hero options below, with the machine live in it
 *   KETTLE     the problem, pointed at, then the rest of the house
 *   JOURNEY    the cover comes off and each stage opens in section, on scroll
 *   PATH       test, quote, install, looked after
 *   WHAT YOU GET  the system, the installation, the servicing
 *   WHO FITS IT  the installer, in the installer's own livery
 *   STAGES     the same three stages, standing still, one tab each
 *   SPEC       the manufacturer's numbers
 *   ON THE WALL  the brand concept, and where it goes
 *   QUESTIONS  the five people ask first
 *   BOOK       the free test
 *
 * THE ORDER (19 Sep 2026). The film ends on "find out what's in your water",
 * and the stage explorer used to follow it: the same three stages again, at the
 * moment the visitor had just finished them, with seven sections still between
 * them and the form. Now the film hands to the buying path (which starts with
 * that free test), then what you get and who fits it. The reference material
 * (the stages standing still, the manufacturer's sheet, the cover on a wall)
 * sits after the people, for the careful buyer, and the questions and the
 * booking close the page. The grounds still alternate: paper, white, the
 * installer's teal, white, paper, white, paper, white.
 *
 * The machine is one WebGL scene fixed behind the page (Journey owns it).
 * The hero borrows it; the journey drives it; every other section is an
 * opaque page over it.
 *
 * THE HERO OPTIONS (18 Sep 2026). The first screen was judged bland and not
 * pointing anywhere, so it now comes in four versions over the same page and
 * the same machine, each a different answer to "what should a visitor do
 * first?". /preview/<key>/ shows each one with a switcher (noindex);
 * DEFAULT_HERO is the one the home page uses.
 */
export { HERO_OPTIONS, DEFAULT_HERO, type HeroKey } from "./heroes/options";

function Hero({ which }: { which: HeroKey }) {
  if (which === "ask") return <HeroAsk />;
  if (which === "suburb") return <HeroSuburb />;
  if (which === "open") return <HeroOpen />;
  return <Opening />;
}

export function HomePage({ hero = DEFAULT_HERO }: { hero?: HeroKey }) {
  return (
    <main id="main">
      <Hero which={hero} />
      {/* opaque, and at least a screen tall: the hero's machine and the
          journey's machine are never on screen together */}
      <Kettle />
      <Journey />
      {/* reduced-motion fallback: the same story as a static document */}
      <StaticStory />
      <Path />
      <Packages />
      <Installer />
      <HowItWorks />
      <SpecSchedule />
      <ConceptBand />
      <Questions />
      <SiteSpine />
    </main>
  );
}
