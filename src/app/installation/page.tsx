import type { Metadata } from "next";
import Link from "next/link";
import { Sheet, Block } from "@/components/site/Sheet";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Installation",
  description:
    "Whole-home filtration fitted at the mains by Aqua-Safe Plumbing & Maintenance, licensed Perth plumbers and gas fitters (PL10802, GF22810), with a 12-month workmanship warranty.",
  alternates: { canonical: "/installation/" },
  openGraph: { title: "Installation | Next Gen Water Systems" },
};

export default function InstallationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Installation" }])),
        }}
      />
      <Sheet
        sheet="04"
        kicker="Installation"
        title={
          <>
            A licensed plumber,
            <br />
            for an afternoon.
          </>
        }
        lead="Nothing arrives in a box for you to work out. The system is fitted at your mains by the same licensed plumbers who service it afterwards, and the work carries a warranty."
        photo="/photos/installed.jpg"
        photoAlt="A three-vessel filtration unit mounted on a rendered wall beside a garden bed, plumbed in with copper pipework and isolation valves"
      >
        <Block title="Who does the work">
          <p>
            Every Next Gen system is installed by <b>Aqua-Safe Plumbing &amp; Maintenance</b>, a family-owned
            Perth business. Licensed plumbing PL10802, gas fitting GF22810, fully insured. The installation
            carries a 12-month workmanship warranty on top of whatever the manufacturer covers on the parts.
          </p>
          <p>
            That split matters more than it sounds. Filtration gets sold online by people who never see the
            house. Cutting into a live mains, sizing the run and making it comply is plumbing, and it belongs
            to someone whose licence is on it.
          </p>
        </Block>

        <Block title="What the day looks like">
          <ol className="steps">
            <li>
              <b>The test comes first.</b> A technician tests your actual supply at your kitchen tap and talks
              you through what is in it. Free, and you owe nothing afterwards.
            </li>
            <li>
              <b>We find the spot.</b> The system goes where the water enters the property, usually near the
              meter or in the garage. It needs a bit of clearance under it so the bowls can come off for
              servicing. The plumber works that out on site.
            </li>
            <li>
              <b>Water off, system in.</b> The frame is mounted, the unit is plumbed into the incoming line
              with isolation either side, and the joints are pressure-checked before the water goes back on.
            </li>
            <li>
              <b>Flush and hand over.</b> New cartridges are flushed through until the water runs clear, the
              gauges are read, and you get told when the first change is due and what it involves.
            </li>
          </ol>
          <p className="doc-note">
            Most jobs are done in an afternoon. Awkward runs, tight meter boxes and older pipework can add
            time, which is one of the things the visit is for.
          </p>
        </Block>

        <Block title="After it is in">
          <p>
            There is nothing to switch on, nothing to refill and no power to it. The only ongoing job is the
            cartridge change, and the interval gets set from your own water rather than a number on a box.
            Aqua-Safe schedule it, so it is one less thing to remember.
          </p>
          <p>
            <Link className="doc-inline" href="/system/">
              What is actually inside each vessel
            </Link>
            .
          </p>
        </Block>
      </Sheet>
    </>
  );
}
