import { Journey } from "@/components/journey/Journey";
import { Opening } from "@/components/site/Opening";
import { HowItWorks } from "@/components/site/HowItWorks";
import { ConceptBand } from "@/components/site/ConceptBand";
import { SpecSchedule } from "@/components/site/SpecSchedule";
import { StaticStory } from "@/components/site/StaticStory";
import { Installer } from "@/components/site/Installer";
import { SiteSpine } from "@/components/site/SiteSpine";

/**
 * THE HOME PAGE: the product, then the proof, then the test.
 *
 *   HERO       the closed Next Gen cover, live, and the outcome line
 *   JOURNEY    the cover comes off and each stage opens in section, on scroll
 *   STAGES     the same three stages, standing still
 *   SPEC       the manufacturer's numbers
 *   ON THE WALL  the brand concept, and where it goes
 *   WHO FITS IT  the licensed installer
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
      <Journey />
      {/* reduced-motion fallback: the same story as a static document */}
      <StaticStory />
      <HowItWorks />
      <SpecSchedule />
      <ConceptBand />
      <Installer />
      <SiteSpine />
    </main>
  );
}
