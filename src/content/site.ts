/**
 * The route map. One source for the nav, the footer and the sitemap, so a page
 * can never exist without being reachable or listed.
 *
 * `sheet` continues the drawing set the homepage opens: SHEET 01 is the living
 * drawing, 02 is the booking tail, and each page below takes the next number.
 * It is the site's own filing system rather than decoration.
 */
export type Route = {
  href: string;
  label: string;
  /** short line used in the footer and on link cards */
  blurb: string;
  sheet: string;
  /** nav shows a subset; everything appears in the footer and the sitemap */
  inNav: boolean;
};

export const ROUTES: Route[] = [
  {
    href: "/system/",
    label: "The system",
    blurb: "What the machine is, stage by stage, and what it deliberately does not do.",
    sheet: "03",
    inNav: true,
  },
  {
    href: "/installation/",
    label: "Installation",
    blurb: "Where it goes, who fits it, and what the day actually looks like.",
    sheet: "04",
    inNav: true,
  },
  {
    href: "/questions/",
    label: "Questions",
    blurb: "Straight answers, including the ones with an inconvenient answer.",
    sheet: "05",
    inNav: true,
  },
  {
    href: "/water-test/",
    label: "Free water test",
    blurb: "A technician tests your own supply at your own tap. No obligation after it.",
    sheet: "02",
    inNav: false,
  },
];

export const navRoutes = ROUTES.filter((r) => r.inNav);
export const routeFor = (href: string) => ROUTES.find((r) => r.href === href);
