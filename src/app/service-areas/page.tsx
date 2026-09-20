import type { Metadata } from "next";
import Link from "next/link";
import { Sheet, Block } from "@/components/site/Sheet";
import { SuburbCheck } from "@/components/site/SuburbCheck";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbJsonLd, INSTALLER } from "@/lib/jsonld";
import { pageOg } from "@/lib/seo";
import { AREAS, ALL_SUBURBS } from "@/content/areas";

/**
 * SERVICE AREAS. One page with the whole list, region by region, in Aaron's
 * order (content/areas.ts). Deliberately not a page per suburb: pages that
 * differ only by a swapped-in name are doorway pages, which Google penalises
 * across the whole domain (the same call Aqua-Safe's own site made).
 */
export const metadata: Metadata = {
  title: "Service areas: whole-home water filtration across Perth",
  description: `Free water tests and whole-home filtration across the Perth metro, fitted by Aqua-Safe Plumbing. ${ALL_SUBURBS.length} suburbs listed by region.`,
  alternates: { canonical: "/service-areas/" },
  openGraph: pageOg("/service-areas/", "Service areas | Next Gen Water Systems"),
};

export default function ServiceAreasPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Service areas" }])} />
      <Sheet
        sheet="08"
        kicker="Service areas"
        title={
          <>
            Anywhere in
            <br />
            the Perth metro.
          </>
        }
        lead="Aqua-Safe work right across Perth. These are the suburbs on their list, region by region. If yours is not here by name, call and ask."
      >
        <div className="areas-check">
          <SuburbCheck label="Check your suburb" />
        </div>

        {AREAS.map((a) => (
          <Block key={a.slug} title={a.name}>
            <ul className="areas-list" aria-label={`Suburbs in ${a.name}`}>
              {a.suburbs.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </Block>
        ))}

        <Block title="The water differs across Perth">
          <p>
            How hard the water is changes a lot from one part of Perth to another. Water Corporation publishes the
            figures for every area each year.{" "}
            <Link className="doc-inline" href="/resources/perth-water-hardness/">
              See how hard the water is where you are
            </Link>
            .
          </p>
          <p className="doc-note">
            The list is{" "}
            <a className="installer-link" href={INSTALLER.url} target="_blank" rel="noopener">
              Aqua-Safe Plumbing &amp; Maintenance
            </a>
            &rsquo;s own service area.
          </p>
        </Block>
      </Sheet>
    </>
  );
}
