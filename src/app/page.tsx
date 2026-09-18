import { Journey } from "@/components/journey/Journey";
import { Opening } from "@/components/site/Opening";
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

/**
 * THE HOME PAGE: the product, then the proof, then the test.
 *
 *   HERO       the closed Next Gen cover, live, and the outcome line
 *   KETTLE     the problem, pointed at: scale where the water sat
 *   JOURNEY    the cover comes off and each stage opens in section, on scroll
 *   STAGES     the same three stages, standing still, one tab each
 *   PATH       test, quote, install, looked after
 *   WHAT YOU GET  the system, the installation, the servicing
 *   SPEC       the manufacturer's numbers
 *   ON THE WALL  the brand concept, and where it goes
 *   WHO FITS IT  the licensed installer
 *   QUESTIONS  the five people ask first
 *   BOOK       the free water test
 *
 * The machine is one WebGL scene fixed behind the page (Journey owns it).
 * The hero borrows it; the journey drives it; every other section is an
 * opaque page over it.
 */
export default function Home() {
  return (
    <main id="main">
      <Opening />
      {/* opaque, and taller than a screen: the hero's machine and the journey's
          machine are never on screen together, so the scene changes hands unseen */}
      <Kettle />
      <Journey />
      {/* reduced-motion fallback: the same story as a static document */}
      <StaticStory />
      <HowItWorks />
      <Path />
      <Packages />
      <SpecSchedule />
      <ConceptBand />
      <Installer />
      <Questions />
      <SiteSpine />
    </main>
  );
}
