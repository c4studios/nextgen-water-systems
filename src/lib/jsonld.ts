/**
 * Structured data for Next Gen Water Systems.
 *
 * Everything here is verifiable. "NEXT GEN WATER SYSTEMS" is a registered
 * business name under ABN 25 770 821 226 (public ABR record), which is the same
 * trading trust behind Aqua-Safe Plumbing & Maintenance.
 *
 * Deliberately absent:
 *   - telephone. No real number has been supplied; the form placeholder is a
 *     dummy. An invented number in structured data is worse than none.
 *   - Product / Offer schema with contaminant-reduction figures. Those numbers
 *     are placeholders pending NATA testing (see src/lib/seo.ts). Publishing
 *     them as machine-readable claims would be the same ACL problem as putting
 *     them on the page, only harder to retract once cached.
 *   - aggregateRating. There are no reviews for this business yet.
 */
export const SITE_ORIGIN = "https://nextgenwatersystems.com.au";
export const BUSINESS_ID = `${SITE_ORIGIN}/#business`;

export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
  "@id": BUSINESS_ID,
  name: "Next Gen Water Systems",
  description:
    "Whole-home water filtration supplied and installed across the Perth metro by licensed plumbers — three-stage systems fitted where the water enters the house, with an under-sink reverse-osmosis option.",
  url: `${SITE_ORIGIN}/`,
  email: "hello@nextgenwatersystems.com.au",
  identifier: {
    "@type": "PropertyValue",
    propertyID: "ABN",
    value: "25 770 821 226",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Perth",
    addressRegion: "WA",
    addressCountry: "AU",
  },
  areaServed: { "@type": "City", name: "Perth", addressRegion: "WA", addressCountry: "AU" },
} as const;

/** BreadcrumbList for a page's trail. Last crumb omits `item` — it is the
 *  current page, per Google's guidance. */
export function breadcrumbJsonLd(trail: { name: string; path?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.path ? { item: `${SITE_ORIGIN}${c.path}` } : {}),
    })),
  };
}
