import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/jsonld";
import { ROUTES } from "@/content/site";
import { ARTICLES } from "@/content/articles";

/**
 * /sitemap.xml. Trailing slashes match `trailingSlash: true` — a sitemap
 * listing /x while the site serves /x/ makes every entry look like a redirect.
 *
 * Generated from src/content/site.ts (which also builds the nav and the
 * footer) and src/content/articles.ts, so a page cannot be added without
 * turning up here. The hero-option previews (/preview/…) are deliberately
 * absent: they are noindex review copies of the home page.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_ORIGIN}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...ROUTES.map((r) => ({
      url: `${SITE_ORIGIN}${r.href}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: r.href === "/water-test/" ? 0.9 : 0.7,
    })),
    ...ARTICLES.map((a) => ({
      url: `${SITE_ORIGIN}${a.href}`,
      lastModified: new Date(a.published),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
