import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/jsonld";
import { LAUNCHED } from "@/lib/seo";

/**
 * robots.txt.
 *
 * NOTE: robots.txt is only honoured at a DOMAIN ROOT. This project still builds
 * with a GitHub Pages basePath, so the emitted file lands under
 * /nextgen-water-systems/robots.txt and crawlers will never read it. It becomes
 * effective once the site is served from nextgenwatersystems.com.au, the same
 * migration Aqua-Safe already went through.
 */
export default function robots(): MetadataRoute.Robots {
  if (!LAUNCHED) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
