import type { Metadata } from "next";
import Link from "next/link";
import { Sheet, Block } from "@/components/site/Sheet";
import { ArticleSources } from "@/components/site/ArticleSources";
import { JsonLd } from "@/components/site/JsonLd";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { pageOg } from "@/lib/seo";
import { articleFor } from "@/content/articles";

/**
 * Why Perth tap water tastes of chlorine. Written from Water Corporation's
 * annual report and taste page, WA Health and the national guidelines
 * (docs/research/perth-water-sources.md). It says plainly that the water is
 * safe: Water Corporation warned the public about filter companies making
 * health claims in April 2025, and this site does not sell that way.
 */
const A = articleFor("chlorine-taste")!;

export const metadata: Metadata = {
  title: A.title,
  description: A.description,
  alternates: { canonical: A.href },
  openGraph: pageOg(A.href, `${A.title} | Next Gen Water Systems`, A.description),
};

const AR =
  "https://pw-cdn.watercorporation.com.au/-/media/watercorp/documents/about-us/our-performance/drinking-water-quality/drinking-water-quality-annual-report-2024-25.pdf";
const WC_TASTE = "https://www.watercorporation.com.au/Help-and-advice/Water-issues/Water-quality/Taste-and-smell";
const WA_HEALTH = "https://www.health.wa.gov.au/Articles/A_E/Chlorinated-drinking-water";
const ADWG_CL = "https://guidelines.nhmrc.gov.au/australian-drinking-water-guidelines/part-5/physical-chemical-characteristics/chlorine";
const HEALTHY_WA_FILTERS = "https://www.healthywa.wa.gov.au/Articles/U_Z/Water-filters-for-your-home";

export default function ChlorineArticle() {
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
            Why Perth tap water
            <br />
            tastes of chlorine.
          </>
        }
        lead="Because it is meant to have chlorine in it. Every scheme Water Corporation runs is disinfected with chlorine, and some of it is still there when the water reaches your tap. Here is what that means, and what a filter at the mains does about the taste."
        byline={<>From Water Corporation, WA Health and the Australian Drinking Water Guidelines. Published 18 September 2026.</>}
        after={
          <ArticleSources
            current={A.slug}
            sources={[
              { name: "Water Corporation, Drinking Water Quality Annual Report 2024-25", url: AR, note: "p. 33, disinfection" },
              { name: "Water Corporation, Taste and smell", url: WC_TASTE },
              { name: "WA Health, Chlorinated drinking water", url: WA_HEALTH, note: "last reviewed 3 June 2022" },
              { name: "NHMRC, Australian Drinking Water Guidelines: chlorine", url: ADWG_CL },
              { name: "HealthyWA, Water filters for your home", url: HEALTHY_WA_FILTERS, note: "last reviewed 17 March 2021" },
            ]}
          />
        }
      >
        <Block title="Why it is there">
          <p>
            Water Corporation disinfects all of its drinking water schemes with chlorine, to protect against the
            microorganisms that can travel in water. Enough is added to leave a working amount in the water as it
            travels through the pipes, which the national guidelines call the disinfectant residual.
          </p>
          <p>
            The taste and the smell are not only the chlorine itself. Water Corporation explains that chlorine
            reacting with natural organic compounds in the water is what produces them.
          </p>
        </Block>

        <Block title="Is it safe?">
          <p>
            Yes. WA Health says adverse health effects have not been seen in people drinking chlorinated water, and
            that the chlorine in WA&rsquo;s scheme water usually sits between 0.5 and 1.5 milligrams per litre. The
            national guidelines set the health limit for total chlorine at 5 mg/L.
          </p>
          <p>
            WA Health&rsquo;s advice is that scheme water in WA does not need filtering, apart from where hardness
            is a problem. People fit one for the taste and the smell.
          </p>
        </Block>

        <Block title="Why some people notice it more">
          <p>
            The national guidelines put the odour threshold for chlorine in water at about 0.6 mg/L, and say some
            people can pick it up as low as 0.2. They also note that a water authority may need to go over the
            odour threshold to keep the disinfectant working. So the usual range in WA scheme water runs from just
            under to well over the point where most people can smell it, and some people notice it more than others.
          </p>
        </Block>

        <Block title="What a filter at the mains does">
          <p>
            The second stage of a Next Gen system is copper-zinc granules (the manufacturer&rsquo;s KDF 55 and 85)
            with coconut carbon behind them. The granules change chlorine as the water passes through, and the
            carbon holds what is left. The third stage has a second bed of coconut carbon.
          </p>
          <p>
            Because the system sits where the water comes into the property, the shower and the laundry get the
            same water as the kitchen tap. There is no figure here for how much chlorine it takes out: that waits
            for the independent test report. What is in your own water is what the{" "}
            <Link className="doc-inline" href="/water-test/">
              free test
            </Link>{" "}
            is for.
          </p>
        </Block>
      </Sheet>
    </>
  );
}
