import { LivingDrawing } from "@/components/blueprint/LivingDrawing";
import { DrawingChrome } from "@/components/site/DrawingChrome";
import { Opening } from "@/components/site/Opening";
import { HowItWorks } from "@/components/site/HowItWorks";
import { FloorPlan } from "@/components/site/FloorPlan";
import { Band } from "@/components/site/Band";
import { Exhibit } from "@/components/site/Exhibit";
import { StaticStory } from "@/components/site/StaticStory";
import { Installer } from "@/components/site/Installer";
import { SiteSpine } from "@/components/site/SiteSpine";

/**
 * THE HOME PAGE IS A DRAWING SET: a cover, then five sheets.
 *
 *   COVER     the outcome, the machine, the taste check, who fits it
 *   SHEET 01  your water — the kettle, marked up like a site inspection
 *   SHEET 02  the fix, in section — the scroll-pinned journey through the
 *             machine, then the same three stages standing still
 *   SHEET 03  where it goes — the house plan, and the wall it hangs on
 *   SHEET 04  who fits it — the licensed plumber, servicing, the install day
 *   SHEET 05  book the test
 *
 * The machine is one WebGL scene fixed behind the page (LivingDrawing owns
 * it). The cover borrows it; the journey drives it; every other sheet is an
 * opaque page over it.
 */
export default function Home() {
  return (
    <>
      <DrawingChrome />
      <main id="main">
        <Opening />
        <Exhibit />
        <LivingDrawing />
        {/* reduced-motion fallback: the same story as a static document
            (display:none for everyone else — see globals.css) */}
        <StaticStory />
        <HowItWorks />
        <FloorPlan />
        {/* Where it actually goes. Warm raking light on purpose: this is the
            one moment in the site that is a place rather than an object. */}
        <Band
          src="/photos/installed.jpg"
          alt="A three-vessel filtration unit mounted on a rendered wall beside a raised garden bed, plumbed in with copper pipework and brass isolation valves"
          tag="NOTE 2 · WHERE IT GOES"
          caption="On the wall where the water comes into the property, with isolation either side so it can be serviced without shutting the house down. It needs clearance underneath for the bowls to come off. Visualisation, not a photograph of a completed job."
        />
        <Installer />
        <SiteSpine />
      </main>
    </>
  );
}
