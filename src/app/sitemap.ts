import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/jsonld";
import { ROUTES } from "@/content/site";

/**
 * /sitemap.xml. Trailing slashes match `trailingSlash: true` — a sitemap
 * listing /x while the site serves /x/ makes every entry look like a redirect.
 *
 * Generated from src/content/site.ts, which is also what builds the nav and the
 * footer, so a page cannot be added without turning up here.
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
  ];
}
