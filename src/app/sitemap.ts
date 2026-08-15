import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/jsonld";

/**
 * /sitemap.xml. Trailing slashes match `trailingSlash: true` — a sitemap
 * listing /x while the site serves /x/ makes every entry look like a redirect.
 *
 * One entry today because the site is a single page. That is itself the biggest
 * SEO constraint here: "water filter perth", "whole house filtration perth" and
 * "reverse osmosis perth" are separate intents and one page cannot rank for all
 * of them. Expanding this list is a content-architecture decision, not a
 * technical one.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_ORIGIN}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
  ];
}
