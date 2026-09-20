/**
 * Structured data for Next Gen Water Systems.
 *
 * Everything here is verifiable. "NEXT GEN WATER SYSTEMS" is a registered
 * business name under ABN 25 770 821 226 (public ABR record), which is the same
 * trading trust behind Aqua-Safe Plumbing & Maintenance.
 *
 * The telephone is Aaron's own published number (0473 072 642), the one the
 * site shows in the nav, the footer and every call button (docs/sources.md).
 *
 * Deliberately absent:
 *   - Product / Offer schema with contaminant-reduction figures. The figures
 *     have since been removed from the page entirely; they must not come back
 *     here as machine-readable claims, which would be the same Australian
 *     Consumer Law problem and harder to retract once cached.
 *   - aggregateRating. There are no reviews for THIS business yet. Aqua-Safe's
 *     real Google reviews belong to Aqua-Safe and are installer credibility,
 *     never product performance, so they are not borrowed here.
 */

/** The installer's live site. Aqua-Safe is the licensed plumbing business that
 *  fits every system, and per PRODUCT.md the installer is part of the product,
 *  so the relationship is stated in the markup rather than only in prose. */
export const INSTALLER = {
  name: "Aqua-Safe Plumbing & Maintenance",
  // canonical origin: the apex 308-redirects to www, so linking www avoids a
  // pointless redirect hop on every click
  url: "https://www.aquasafeplumbing.com.au/",
} as const;
export const SITE_ORIGIN = "https://nextgenwatersystems.com.au";
export const BUSINESS_ID = `${SITE_ORIGIN}/#business`;

export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
  "@id": BUSINESS_ID,
  name: "Next Gen Water Systems",
  // NO reverse-osmosis claim. The previous description offered "an under-sink
  // reverse-osmosis option", which directly contradicts what the site says on
  // the page (this is a KDF and carbon system and deliberately is not RO). A
  // machine-readable claim that contradicts the page is worse than a vague one.
  description:
    "Whole-home water filtration supplied and installed across the Perth metro by licensed plumbers. Three-stage systems fitted where the water enters the house, so every tap runs through one machine.",
  url: `${SITE_ORIGIN}/`,
  telephone: "+61 473 072 642",
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
  // The installation is carried out by a separate, licensed trading business.
  // Stating it as a Service with an explicit provider is the accurate shape:
  // it does not claim Aqua-Safe and Next Gen are one entity, and it gives the
  // installer's site a real, machine-readable relationship to this one.
  makesOffer: {
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: "Whole-home water filtration supply and installation",
      serviceType: "Water filtration installation",
      provider: {
        "@type": "PlumbingBusiness",
        name: INSTALLER.name,
        url: INSTALLER.url,
        areaServed: { "@type": "City", name: "Perth", addressRegion: "WA", addressCountry: "AU" },
      },
    },
  },
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

/** the plain text of a React node, for structured data */
function nodeText(node: unknown): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (typeof node === "object" && node && "props" in node) {
    const props = (node as { props?: { children?: unknown } }).props;
    const inner = nodeText(props?.children);
    const type = (node as { type?: unknown }).type;
    return type === "p" || type === "li" ? inner + " " : inner;
  }
  return "";
}

/** FAQPage: every question on the questions page with the answer it shows */
export function faqJsonLd(items: { q: string; a: unknown }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: nodeText(a).replace(/\s+/g, " ").trim() },
    })),
  };
}

/** Article: a piece under /resources/, published by the business itself */
export function articleJsonLd(a: { href: string; title: string; description: string; published: string }) {
  const org = { "@type": "Organization", "@id": BUSINESS_ID, name: "Next Gen Water Systems", url: `${SITE_ORIGIN}/` };
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    datePublished: a.published,
    dateModified: a.published,
    inLanguage: "en-AU",
    mainEntityOfPage: `${SITE_ORIGIN}${a.href}`,
    image: `${SITE_ORIGIN}/og.jpg`,
    author: org,
    publisher: org,
  };
}
