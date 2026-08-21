import { LivingDrawing } from "@/components/blueprint/LivingDrawing";
import { DrawingChrome } from "@/components/site/DrawingChrome";
import { Opening } from "@/components/site/Opening";
import { TasteKey } from "@/components/site/TasteKey";
import { SetOut } from "@/components/site/SetOut";
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
        {/* the pinned 3D journey — now the proof rather than the pitch */}
        <LivingDrawing />
        {/* reduced-motion fallback: the same story as a static document
            (display:none for everyone else — see globals.css) */}
        <StaticStory />
        {/* Coverage as the payoff: you have just been inside the machine, now
            see everywhere it reaches. This is the honest version of "how much
            good does it do" — no figure, and a jug can't answer it. */}
        <SetOut />
        {/* the compact booking tail */}
        <SiteSpine />
      </main>
    </>
  );
}
