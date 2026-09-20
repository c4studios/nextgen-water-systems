import type { Metadata } from "next";
import Link from "next/link";
import { Sheet, Block } from "@/components/site/Sheet";
import { HardnessChart } from "@/components/site/HardnessChart";
import { ArticleSources } from "@/components/site/ArticleSources";
import { JsonLd } from "@/components/site/JsonLd";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { pageOg } from "@/lib/seo";
import { articleFor } from "@/content/articles";
import { HARDNESS_SOURCE } from "@/content/perthWater";

/**
 * How hard Perth's water is, area by area. Every figure is Water
 * Corporation's 2024-25 annual report (content/perthWater.ts) or the national
 * guidelines' own table; see docs/research/perth-water-sources.md. Aaron's
 * brief rules out any talk of softening, and Water Corporation itself says the
 * minerals that make water hard cannot be filtered out, so the page says what
 * Stage 3 does and that the hardness stays.
 */
const A = articleFor("perth-water-hardness")!;

export const metadata: Metadata = {
  title: A.title,
  description: A.description,
  alternates: { canonical: A.href },
  openGraph: pageOg(A.href, `${A.title} | Next Gen Water Systems`, A.description),
};

const ADWG_HARDNESS =
  "https://guidelines.nhmrc.gov.au/australian-drinking-water-guidelines/part-5/physical-chemical-characteristics/hardness-as-calcium-carbonate";
const WC_HARD = "https://www.watercorporation.com.au/help-and-advice/water-issues/water-quality/hard-water";

export default function HardnessArticle() {
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
            How hard is
            <br />
            Perth&rsquo;s water?
          </>
        }
        lead="Water Corporation publishes how hard the water is in every part of the Perth scheme each year. Here are the 2024-25 figures for all 28 areas, set against the national guideline, and what they mean for scale at home."
        byline={
          <>
            From Water Corporation&rsquo;s {HARDNESS_SOURCE.title} and the Australian Drinking Water Guidelines.
            Published 18 September 2026.
          </>
        }
        after={
          <ArticleSources
            current={A.slug}
            sources={[
              { name: `${HARDNESS_SOURCE.publisher}, ${HARDNESS_SOURCE.title}`, url: HARDNESS_SOURCE.url, note: `${HARDNESS_SOURCE.table}; p. 39 on hardness` },
              { name: "Water Corporation, Perth aesthetic tables 2024-25", url: HARDNESS_SOURCE.tablesUrl },
              { name: "NHMRC, Australian Drinking Water Guidelines: hardness (as calcium carbonate)", url: ADWG_HARDNESS },
              { name: "Water Corporation, Hard water", url: WC_HARD },
            ]}
          />
        }
      >
        <Block title="What hardness is">
          <p>
            Hardness is the calcium and magnesium dissolved in the water. Water Corporation&rsquo;s report puts it
            plainly: hard water takes more soap to lather, and it can form scale on hot water pipes and fittings.
            It is also what stays behind as spots when water dries on a glass or a shower screen.
          </p>
        </Block>

        <Block title="The guideline">
          <p>
            The Australian Drinking Water Guidelines set an aesthetic guideline of 200 mg/L, written for scale in
            hot water systems. Their own table calls water under 60 mg/L soft, 60 to 200 mg/L good quality for all
            domestic uses, and says that above 200 mg/L scale forms faster.
          </p>
        </Block>

        <HardnessChart />

        <Block title="Reading the figures">
          <p>
            Most of Perth sits well under the guideline. The hard end is the northern corridor: Two Rocks averaged 228
            mg/L, the only area over 200, and Water Corporation notes that its hardness comes from the source that
            supplies it. Yanchep averaged 198 and Neerabup 190. At the other end, Dwellingup averaged 29, and
            Mandurah, Melville and Bold Park all sat around 50.
          </p>
          <p>
            Two cautions. Each figure is the average of a handful of samples taken over the year, between two and
            five per area. And the areas are Water Corporation&rsquo;s water-quality zones, which do not follow suburb
            boundaries; the report&rsquo;s Appendix B has the maps. What comes out of your own tap can differ, which
            is what the{" "}
            <Link className="doc-inline" href="/water-test/">
              free test
            </Link>{" "}
            is for.
          </p>
        </Block>

        <Block title="What it means at home">
          <p>
            Scale is an aesthetic problem. Harder water leaves more of it, and sooner, on anything that heats water
            or lets it dry: the kettle element, the hot water system, the shower screen, the glasses out of the
            dishwasher.
          </p>
          <p>
            Water Corporation says the calcium and magnesium that make water hard cannot be removed by filtration.
            The third stage of a Next Gen system carries limescale-reduction media, which works on how those
            minerals behave. The hardness itself stays in the water. For what each stage does, see{" "}
            <Link className="doc-inline" href="/system/">
              the system
            </Link>
            .
          </p>
        </Block>
      </Sheet>
    </>
  );
}
