import { LivingDrawing } from "@/components/blueprint/LivingDrawing";
import { DrawingChrome } from "@/components/site/DrawingChrome";
import { Opening } from "@/components/site/Opening";
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
        {/* the pinned 3D journey — now the proof rather than the pitch */}
        <LivingDrawing />
        {/* reduced-motion fallback: the same story as a static document
            (display:none for everyone else — see globals.css) */}
        <StaticStory />
        {/* the compact booking tail */}
        <SiteSpine />
      </main>
    </>
  );
}
