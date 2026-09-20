import type { Metadata } from "next";
import Link from "next/link";
import { Sheet, Block } from "@/components/site/Sheet";
import { ArticleSources } from "@/components/site/ArticleSources";
import { JsonLd } from "@/components/site/JsonLd";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { pageOg } from "@/lib/seo";
import { articleFor } from "@/content/articles";

/**
 * Whole-house or under-sink. The comparison every reference site sells
 * around. It keeps to what is on file: what a Next Gen does (the datasheet),
 * what it deliberately does not do (fluoride, PFAS, dissolved solids need
 * reverse osmosis: the site's standing answer), WA Health on fluoride, Water
 * Corporation on PFAS, and WA Building and Energy on licensed work
 * (docs/research/perth-water-sources.md).
 */
const A = articleFor("whole-house-or-under-sink")!;

export const metadata: Metadata = {
  title: A.title,
  description: A.description,
  alternates: { canonical: A.href },
  openGraph: pageOg(A.href, `${A.title} | Next Gen Water Systems`, A.description),
};

const FLUORIDE = "https://www.healthywa.wa.gov.au/Articles/F_I/Fluoride-facts-for-Western-Australia";
const PFAS = "https://www.watercorporation.com.au/about-us/our-performance/drinking-water-quality/monitoring-for-pfas";
const B_AND_E = "https://www.wa.gov.au/organisation/building-and-energy/plumbing-work-your-home";

const ROWS: [string, string, string][] = [
  ["Which taps", "Every tap, the shower, the laundry and the hot water system", "The one tap it is fitted to"],
  ["Where it goes", "Where the water comes into the property, usually an outside wall or the garage", "In the cupboard under that sink"],
  ["Chlorine taste and smell", "Treated for the whole house, shower included", "Treated at that tap"],
  ["Fluoride, PFAS, dissolved solids", "Not this system: those take reverse osmosis", "Reverse osmosis units are the ones built for these"],
  ["Who fits it", "A licensed plumber", "A licensed plumber"],
];

export default function WholeHouseArticle() {
  return (
    <>
      <JsonLd data={articleJsonLd(A)} />
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Resources", path: "/resources/" }, { name: A.short }])}
      />
      <Sheet
        sheet="07"
        kicker={A.short}
        trail={[{ name: "Resources", href: "/resources/" }]}
        title={
          <>
            Whole-house filter,
            <br />
            or under the sink?
          </>
        }
        lead="They answer different questions. A whole-house system treats the water for every tap as it comes into the property; an under-sink unit treats the water at one tap. Which one makes sense depends on what is bothering you."
        byline={<>From WA Health, Water Corporation and WA Building and Energy. Published 18 September 2026.</>}
        after={
          <ArticleSources
            current={A.slug}
            sources={[
              { name: "HealthyWA, Fluoride facts for Western Australia", url: FLUORIDE, note: "last reviewed 10 November 2025" },
              { name: "Water Corporation, Monitoring for PFAS", url: PFAS },
              { name: "WA Building and Energy, Plumbing work in your home", url: B_AND_E, note: "last updated 1 July 2026" },
            ]}
          />
        }
      >
        <Block title="At the mains">
          <p>
            A whole-house system, also called point of entry, sits where the water comes into the property. Every
            outlet downstream gets the same water: the kitchen tap, the showers, the washing machine, the hot water
            system. A Next Gen system is this kind. It is three cartridges in a row: a sediment stage to one micron,
            copper-zinc granules with coconut carbon, and limescale-reduction media with a second bed of carbon.
          </p>
          <p>
            That makes it the kind to look at when the problem is all over the house, like the chlorine smell in
            the shower as well as the taste at the kitchen tap.
          </p>
        </Block>

        <Block title="Under the sink">
          <p>
            An under-sink unit, or point of use, treats the water at one tap, usually the kitchen. That is where
            reverse osmosis units live. Reverse osmosis is the kind of filter that takes out dissolved things like
            fluoride and the total dissolved solids, and it is a different machine from a Next Gen system, which
            does not claim to remove either.
          </p>
        </Block>

        <Block title="Side by side">
          {/* scrolls sideways on a phone, so a keyboard has to be able to reach it */}
          <div className="cmp-scroll" role="region" aria-label="Whole-house and under-sink, side by side" tabIndex={0}>
            <table className="cmp">
              <thead>
                <tr>
                  <th scope="col">
                    <span className="hc-sr">Question</span>
                  </th>
                  <th scope="col">At the mains</th>
                  <th scope="col">Under the sink</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([q, mains, sink]) => (
                  <tr key={q}>
                    <th scope="row">{q}</th>
                    <td>{mains}</td>
                    <td>{sink}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Block>

        <Block title="If fluoride or PFAS is the worry">
          <p>
            Fluoride is added to Perth&rsquo;s water on purpose. WA Health&rsquo;s target for the Perth metro is 0.9
            milligrams per litre, within a range of 0.7 to 1.0. Water Corporation says the scheme water it supplies
            complies with the guideline limits for PFAS, including the newer draft ones. If you still want
            either taken out at the kitchen tap, that is a reverse osmosis job, and a Next Gen system is not the
            thing to buy for it.
          </p>
        </Block>

        <Block title="Either way, a plumber">
          <p>
            In WA a homeowner may replace a filter cartridge themselves. Connecting a filter to the water supply is
            licensed plumbing work, whichever kind it is, and a whole-house system is the bigger job because it goes
            in on the main line. See{" "}
            <Link className="doc-inline" href="/installation/">
              what the installation involves
            </Link>
            , or book the{" "}
            <Link className="doc-inline" href="/water-test/">
              free test
            </Link>{" "}
            and ask the plumber which one your house needs.
          </p>
        </Block>
      </Sheet>
    </>
  );
}
