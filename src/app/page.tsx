import { LivingDrawing } from "@/components/blueprint/LivingDrawing";
import { DrawingChrome } from "@/components/site/DrawingChrome";
import { Opening } from "@/components/site/Opening";
import { TasteKey } from "@/components/site/TasteKey";
import { FloorPlan } from "@/components/site/FloorPlan";
import { Band } from "@/components/site/Band";
import { StaticStory } from "@/components/site/StaticStory";
import { SiteSpine } from "@/components/site/SiteSpine";

export default function Home() {
  return (
    <>
      <DrawingChrome />
      <main id="main">
        {/* Act 0 — the outcome, in the homeowner's terms. The machine used to
            open the page; per PRODUCT.md it now backs this up instead. */}
        <Opening />
        {/* Recognition, before the machine: the visitor's own water is the
            subject for one screen, and what they pick rides along to the
            booking so the technician knows before he arrives. */}
        <TasteKey />
        {/* The complaint, photographed. It is the scale you notice second and
            the taste you notice first. */}
        <Band
          src="/photos/shower-screen.jpg"
          alt="A glass shower screen covered in dried mineral spotting, raking window light, one corner wiped clean"
          tag="DETAIL C · WHAT SCALE LOOKS LIKE"
          caption="Scale is the one you stop seeing. It builds on the shower screen, the kettle element and the glassware, and it comes back a week after you have scrubbed it off."
        />
        {/* the pinned 3D journey — now the proof rather than the pitch */}
        <LivingDrawing />
        {/* reduced-motion fallback: the same story as a static document
            (display:none for everyone else — see globals.css) */}
        <StaticStory />
        {/* Coverage as the payoff, and the site's one scroll mechanic outside
            the journey: the water advances through a real house plan and each
            fitting lights as it is reached. */}
        <FloorPlan />
        {/* Where it actually goes. Warm raking light on purpose: this is the
            one moment in the site that is a place rather than an object. */}
        <Band
          src="/photos/where-it-goes.jpg"
          alt="Copper and PEX water pipework on the brick wall of an Australian suburban garage, late afternoon sun through a part-open roller door"
          tag="NOTE 2 · WHERE IT GOES"
          caption="On the wall where the water comes in, usually near the meter or in the garage. It needs a bit of clearance underneath so the bowls come off at service time. Your plumber works out the spot on the day."
        />
        {/* the compact booking tail */}
        <SiteSpine />
      </main>
    </>
  );
}
