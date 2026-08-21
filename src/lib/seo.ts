/**
 * Launch switch.
 *
 * While false the site is held out of search: `noindex, nofollow` on every page
 * (layout.tsx) AND a blanket disallow in robots.txt. One edit, both places, so
 * they cannot drift apart and half-launch the site.
 *
 * Blocker status, checked 2026-08-21:
 *   ✅ Efficacy figures. The contaminant-reduction percentages are gone from
 *      src/content/booking.ts and from the structured data. Nothing on the site
 *      now quotes a number that cannot be sourced. Keep it that way: publishing
 *      unsubstantiated reduction claims about drinking water is misleading
 *      conduct under the Australian Consumer Law, and the ACCC has pursued
 *      water treatment companies for exactly this.
 *   ✅ The "(Concept demo — C4 Studios.)" marker is out of the description.
 *   ❌ ROOT DOMAIN. This is the only remaining blocker. The site still builds
 *      with a GitHub Pages basePath, so the emitted robots.txt lands under
 *      /nextgen-water-systems/robots.txt where no crawler will read it, and the
 *      canonical tags already point at nextgenwatersystems.com.au, which does
 *      not serve this build. Point the domain at the deployment, drop the
 *      basePath, then flip.
 */
export const LAUNCHED = false;

/**
 * Build a COMPLETE openGraph block for a page.
 *
 * Next.js metadata does not deep-merge `openGraph`: a page that sets
 * `openGraph: { title }` REPLACES the root object wholesale, which silently
 * dropped type, locale, siteName, url and the image from every interior page.
 * Going through this helper means a page cannot set one field and lose the
 * rest.
 */
export function pageOg(path: string, title: string, description?: string) {
  return {
    type: "website" as const,
    locale: "en_AU",
    siteName: "Next Gen Water Systems",
    url: path,
    title,
    ...(description ? { description } : {}),
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: OG_ALT }],
  };
}

/** Alt text for the share card. It is read aloud on some social clients, so it
 *  describes the card rather than repeating the headline. */
export const OG_ALT =
  "The NGW-01: three stainless filtration vessels on a wall bracket, beside the line \"Water that tastes of nothing.\"";
