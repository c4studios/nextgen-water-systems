/**
 * The route map. One source for the nav, the footer, the quick menu and the
 * sitemap, so a page can never exist without being reachable or listed.
 *
 * The pages follow the shape of the sites Aaron pointed at (the other
 * resellers of the same system): the product, the fitting, the servicing, the
 * free test, answers and reading, where it is available, who is behind it and
 * how to get in touch. `group` is the footer column a page sits in.
 */
export type RouteGroup = "product" | "help" | "company";

export type Route = {
  href: string;
  label: string;
  /** short line used in the footer and on link cards */
  blurb: string;
  /** retired sheet number, kept for the old interior pages' prop */
  sheet: string;
  group: RouteGroup;
  /** nav shows a subset; everything appears in the footer and the sitemap */
  inNav: boolean;
  /** where the same topic sits on the home page: there the nav glides to the
   *  section instead of leaving for the page */
  homeAnchor?: string;
};

export const ROUTES: Route[] = [
  {
    href: "/system/",
    label: "The system",
    blurb: "What the machine is, stage by stage, and what it deliberately does not do.",
    sheet: "03",
    group: "product",
    inNav: true,
    homeAnchor: "#journey",
  },
  {
    href: "/installation/",
    label: "Installation",
    blurb: "Who fits it at your mains, and what the day looks like.",
    sheet: "04",
    group: "product",
    inNav: true,
    homeAnchor: "#installer",
  },
  {
    href: "/servicing/",
    label: "Servicing",
    blurb: "A new set of cartridges once a year, fitted for you.",
    sheet: "06",
    group: "product",
    inNav: true,
  },
  {
    href: "/water-test/",
    label: "Free water test",
    blurb: "A licensed plumber tests your own supply at your own tap. No obligation after it.",
    sheet: "02",
    group: "product",
    inNav: false,
    homeAnchor: "#book",
  },
  {
    href: "/questions/",
    label: "Questions",
    blurb: "Straight answers, including the ones with an inconvenient answer.",
    sheet: "05",
    group: "help",
    inNav: true,
    homeAnchor: "#questions",
  },
  {
    href: "/resources/",
    label: "Resources",
    blurb: "Perth's water explained from the water authority's own figures.",
    sheet: "07",
    group: "help",
    inNav: false,
  },
  {
    href: "/service-areas/",
    label: "Service areas",
    blurb: "Every suburb on Aqua-Safe's list, region by region.",
    sheet: "08",
    group: "company",
    inNav: false,
  },
  {
    href: "/about/",
    label: "About",
    blurb: "A water brand from a Perth plumbing business.",
    sheet: "09",
    group: "company",
    inNav: false,
  },
  {
    href: "/contact/",
    label: "Contact",
    blurb: "Call Aqua-Safe, or leave your details for a call back.",
    sheet: "10",
    group: "company",
    inNav: false,
  },
];

export const navRoutes = ROUTES.filter((r) => r.inNav);

export const ROUTE_GROUPS: { id: RouteGroup; label: string }[] = [
  { id: "product", label: "The product" },
  { id: "help", label: "Answers" },
  { id: "company", label: "The business" },
];

/** the home page, or one of its hero-option previews (app/preview/[hero]):
 *  both carry every home section, so links there glide to sections */
export const isHomePath = (pathname: string) => pathname === "/" || pathname === "" || pathname.startsWith("/preview/");
export const routeFor = (href: string) => ROUTES.find((r) => r.href === href);
