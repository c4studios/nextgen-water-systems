/**
 * Launch switch.
 *
 * While false the site is held out of search: `noindex, nofollow` on every page
 * (layout.tsx) AND a blanket disallow in robots.txt. One edit, both places, so
 * they cannot drift apart and half-launch the site.
 *
 * ⚠️ DO NOT flip this until the efficacy figures are resolved.
 * src/content/booking.ts carries contaminant-reduction percentages that are
 * explicitly placeholders pending NATA-accredited testing, and the page says so
 * on screen. Publishing unsubstantiated reduction claims about drinking water
 * is misleading conduct under the Australian Consumer Law, and the ACCC has
 * pursued water treatment companies for exactly this. Either replace them with
 * real test data or drop the numbers and describe the mechanism instead.
 *
 * Also before flipping:
 *   1. The site must be served from the ROOT domain. It currently builds with a
 *      GitHub Pages basePath, and robots.txt is only honoured at a domain root.
 *   2. Remove the "(Concept demo — C4 Studios.)" marker from the description.
 */
export const LAUNCHED = false;
