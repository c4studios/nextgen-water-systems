import type { Metadata } from "next";
import Link from "next/link";
import { Sheet } from "@/components/site/Sheet";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbJsonLd, SITE_ORIGIN } from "@/lib/jsonld";
import { pageOg } from "@/lib/seo";
import { ARTICLES } from "@/content/articles";

/** RESOURCES: the reading list. Every piece is written from primary sources
 *  and says which ones (content/articles.ts). */
export const metadata: Metadata = {
  title: "Resources: Perth water, explained",
  description:
    "Short reads on Perth's scheme water from the water authority's and the health department's own figures: hardness by area, the chlorine taste, and which kind of filter does what.",
  alternates: { canonical: "/resources/" },
  openGraph: pageOg("/resources/", "Resources | Next Gen Water Systems"),
};

export default function ResourcesPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Resources" }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: ARTICLES.map((a, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE_ORIGIN}${a.href}`,
            name: a.title,
          })),
        }}
      />
      <Sheet
        sheet="07"
        kicker="Resources"
        title={
          <>
            Perth water,
            <br />
            explained plainly.
          </>
        }
        lead="Short reads built on what Water Corporation, WA Health and the national drinking water guidelines actually publish. Each one says where its figures come from."
      >
        <ul className="res-list">
          {ARTICLES.map((a) => (
            <li key={a.slug}>
              <Link href={a.href} className="res-item">
                <span className="res-t">{a.title}</span>
                <span className="res-d">{a.description}</span>
                <span className="res-from">From {a.from}</span>
                <i aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
        <p className="res-more">
          Questions about the system itself are answered on{" "}
          <Link className="doc-inline" href="/questions/">
            the questions page
          </Link>
          .
        </p>
      </Sheet>
    </>
  );
}
