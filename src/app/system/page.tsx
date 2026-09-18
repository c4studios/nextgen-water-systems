import type { Metadata } from "next";
import Link from "next/link";
import { Sheet, Block } from "@/components/site/Sheet";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { pageOg } from "@/lib/seo";

export const metadata: Metadata = {
  title: "The system",
  description:
    "Three full-size housings plumbed in series at the mains, behind a clip-on cover: sediment, copper-zinc and carbon, then limescale-reduction carbon. What each stage does.",
  alternates: { canonical: "/system/" },
  openGraph: pageOg("/system/", "The system | Next Gen Water Systems"),
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
            Three housings,
            <br />
            one pass.
          </>
        }
        lead="The system sits where the water comes into your house. Everything downstream of it runs filtered: the kitchen tap, the shower, the washing machine, the ice maker. There is nothing to fill and nothing to plug in."
        photo="/photos/cartridges.jpg"
        photoAlt="The three filter cartridges laid out in order: pleated sediment, carbon, and a scale-reduction cartridge with a blue collar band"
        photoNote="Visualisation, not a photograph of a real set."
      >
        <Block title="What it is">
          <p>
            Three full-size 20-inch housings hang from a steel frame, plumbed one into the next, and a steel
            cover clips over the lot. Water goes in the first, comes out the third, and carries on into the
            house. Brass connectors at each end, and two pressure gauges on the top plate so a plumber can see
            how the cartridges are doing without opening anything.
          </p>
          <p>
            Inside each housing the water does not fall straight through. It runs down the gap between the
            cartridge and the housing wall, gets pushed sideways through the media, and rises up the hollow core
            to the outlet. That sideways pass is where the work happens, and it is the reason a cartridge this
            size lasts as long as it does.
          </p>
        </Block>

        <Block title="Stage by stage">
          <dl className="spec">
            <div>
              <dt>
                Graded sediment
              </dt>
              <dd>
                One cartridge with three layers, down to one micron at the core. Sand, rust flakes and silt
                stop at whichever layer matches their size, which keeps the whole cartridge working instead of
                blinding off at the surface.
              </dd>
            </div>
            <div>
              <dt>
                Copper-zinc and coconut carbon
              </dt>
              <dd>
                The manufacturer&rsquo;s taste improvement stage. Copper-zinc granules change chlorine on
                contact and hold dissolved metal on their surface, and the coconut carbon behind them
                adsorbs what is left.
              </dd>
            </div>
            <div>
              <dt>
                Limescale-reduction carbon
              </dt>
              <dd>
                The last cartridge carries what the manufacturer calls limescale-reduction media, ahead of a
                second bed of coconut carbon, and filters to one micron on the way out. The datasheet does not
                say how the media works, so neither do we; what it changes in your house is what the free test
                and the coming independent report are for.
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
            Stage 3 does not take the calcium and magnesium out of the water. The manufacturer rates its
            limescale-reduction media by filter life, and that is the only number about it we can quote.
          </p>
          <p>
            You will not find a reduction percentage anywhere on this site. Independent testing is coming.
            Until the report is in hand, we would rather describe the mechanism than publish a number we cannot
            source.
          </p>
        </Block>

        <Block title="Living with it">
          <p>
            Cartridges are consumable. The manufacturer recommends a change every 12 months, and your
            supply can shorten that, so the interval is confirmed after the test. Changing one is a
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
