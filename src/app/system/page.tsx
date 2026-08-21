import type { Metadata } from "next";
import Link from "next/link";
import { Sheet, Block } from "@/components/site/Sheet";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "The system",
  description:
    "The NGW-01 is three stainless vessels plumbed in series at the mains: graded sediment, a copper-zinc and carbon bed, then limescale-reduction carbon. What each stage does, and what it deliberately does not.",
  alternates: { canonical: "/system/" },
  openGraph: { title: "The system | Next Gen Water Systems" },
};

export default function SystemPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "The system" }])),
        }}
      />
      <Sheet
        sheet="03"
        kicker="The system"
        title={
          <>
            Three vessels,
            <br />
            one pass.
          </>
        }
        lead="The NGW-01 sits where the water comes into your house. Everything downstream of it runs filtered: the kitchen tap, the shower, the washing machine, the ice maker. There is nothing to fill and nothing to plug in."
        photo="/photos/cartridges.jpg"
        photoAlt="The three filter cartridges laid out in order: pleated sediment, carbon, and a scale-reduction cartridge with a blue collar band"
      >
        <Block title="What it is">
          <p>
            Three 20-inch stainless vessels hang from a powder-coated steel frame, plumbed one into the next.
            Water goes in the first, comes out the third, and carries on into the house. Brass ports at each
            end, a pressure gauge on the top plate so a plumber can see how the cartridges are doing without
            opening anything.
          </p>
          <p>
            Inside each vessel the water does not fall straight through. It runs down the gap between the
            cartridge and the vessel wall, gets pushed sideways through the media, and rises up the hollow core
            to the outlet. That sideways pass is where the work happens, and it is the reason a cartridge this
            size lasts as long as it does.
          </p>
        </Block>

        <Block title="Stage by stage">
          <dl className="spec">
            <div>
              <dt>
                <b>01</b> Graded sediment
              </dt>
              <dd>
                One cartridge, three densities: 10 micron at the outside, then 5, then 1 at the core. Sand,
                rust flakes and silt stop at whichever layer matches their size, which keeps the whole
                cartridge working instead of blinding off at the surface.
              </dd>
            </div>
            <div>
              <dt>
                <b>02</b> Copper-zinc and coconut carbon
              </dt>
              <dd>
                The stage you taste. Copper-zinc granules change chlorine on contact and hold dissolved metal
                on their surface. The coconut carbon behind them catches what is left, including the flat
                swimming-pool note that survives the first pass.
              </dd>
            </div>
            <div>
              <dt>
                <b>03</b> Limescale-reduction carbon
              </dt>
              <dd>
                The last stage changes the way calcium and magnesium crystallise, so they travel through and
                rinse away instead of bonding to your kettle element and the shower screen. A final one-micron
                polish on the way out.
              </dd>
            </div>
          </dl>
        </Block>

        <Block title="What it does not do">
          <p>
            This is a three-stage cartridge system. It is not reverse osmosis, and it would be dishonest to let
            you assume otherwise: <b>it does not remove PFAS, fluoride or dissolved solids.</b> Those need a
            membrane, a storage tank and a drain line, which is a different machine with different running
            costs.
          </p>
          <p>
            It also reduces the scale that forms rather than removing hardness. Your water will not go
            &ldquo;soft&rdquo; in the way a salt softener makes it soft. What changes is what the minerals do
            once they get there.
          </p>
          <p>
            You will not find a reduction percentage anywhere on this site. Independent testing is in progress.
            Until it is in hand, we would rather describe the mechanism than publish a number we cannot source.
          </p>
        </Block>

        <Block title="Living with it">
          <p>
            Cartridges are consumable. How long a set lasts depends on your supply and how much water the house
            gets through, so the interval is set after the test rather than guessed at now. Changing one is a
            small job: the bowl unscrews, the old cartridge lifts out, the new one drops in.
          </p>
          <p>
            <Link className="doc-inline" href="/installation/">
              How it gets fitted
            </Link>{" "}
            covers the day itself, and{" "}
            <Link className="doc-inline" href="/questions/">
              the questions page
            </Link>{" "}
            has the rest.
          </p>
        </Block>
      </Sheet>
    </>
  );
}
