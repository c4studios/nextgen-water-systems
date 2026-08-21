import { LivingDrawing } from "@/components/blueprint/LivingDrawing";
import { DrawingChrome } from "@/components/site/DrawingChrome";
import { Opening } from "@/components/site/Opening";
import { TasteKey } from "@/components/site/TasteKey";
import { HowItWorks } from "@/components/site/HowItWorks";
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
          src="/photos/kettle-scale.jpg"
          alt="Looking down into an open stainless kettle in a clean kitchen; the element and base are furred with white limescale"
          tag="DETAIL C · WHAT SCALE LOOKS LIKE"
          caption="Scale is the one you stop seeing. It builds on the kettle element, the shower screen and the glassware, and it comes back a week after you have scrubbed it off."
        />
        {/* the pinned 3D journey — now the proof rather than the pitch */}
        <LivingDrawing />
        {/* reduced-motion fallback: the same story as a static document
            (display:none for everyone else — see globals.css) */}
        <StaticStory />
        {/* The still version of what the journey just showed. People arrive
            expecting sections that explain a process and scroll past a pinned
            animation without registering that it WAS the process, so the site
            now says it both ways. This is also an index back INTO the journey:
            open a stage and it will take you to that vessel. */}
        <HowItWorks />
        {/* Coverage as the payoff, and the site's one scroll mechanic outside
            the journey: the water advances through a real house plan and each
            fitting lights as it is reached. */}
        <FloorPlan />
        {/* Where it actually goes. Warm raking light on purpose: this is the
            one moment in the site that is a place rather than an object. */}
        <Band
          src="/photos/installed.jpg"
          alt="A three-vessel filtration unit mounted on a rendered wall beside a raised garden bed, plumbed in with copper pipework and brass isolation valves"
          tag="NOTE 2 · WHERE IT GOES"
          caption="On the wall where the water comes into the property, with isolation either side so it can be serviced without shutting the house down. It needs clearance underneath for the bowls to come off. Visualisation, not a photograph of a completed job."
        />
        {/* the compact booking tail */}
        <SiteSpine />
      </main>
    </>
  );
}
