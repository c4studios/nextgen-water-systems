/**
 * THE RESOURCES: short reads on Perth's water.
 *
 * The reference sites all carry a reading section (Armour's "Perth Water
 * Quality Guide" is its best-linked page). These say what the water authority
 * and the health department actually publish, cite it, and connect it to what
 * a filter at the mains does. The rules are the site's: every figure from a
 * primary source (docs/research/perth-water-sources.md), no health-risk claim
 * about scheme water, and no outcome promised at the tap.
 */
export type Article = {
  slug: string;
  href: string;
  title: string;
  /** the listing line and the meta description */
  description: string;
  /** a short label for cards and crumbs */
  short: string;
  published: string;
  /** the primary sources the piece is written from, for its byline */
  from: string;
};

export const ARTICLES: Article[] = [
  {
    slug: "perth-water-hardness",
    href: "/resources/perth-water-hardness/",
    title: "How hard is Perth’s water? Area by area",
    short: "How hard is Perth’s water?",
    description:
      "Water Corporation's 2024-25 hardness figures for all 28 Perth water-quality areas, set against the national guideline, and what the numbers mean for your kettle and shower screen.",
    published: "2026-09-18",
    from: "Water Corporation, Drinking Water Quality Annual Report 2024-25; NHMRC, Australian Drinking Water Guidelines",
  },
  {
    slug: "chlorine-taste",
    href: "/resources/chlorine-taste/",
    title: "Why Perth tap water tastes of chlorine",
    short: "Why it tastes of chlorine",
    description:
      "Every Perth scheme is disinfected with chlorine. What that means for the taste, what WA Health says about safety, and what a filter at the mains does about it.",
    published: "2026-09-18",
    from: "Water Corporation; WA Health; NHMRC, Australian Drinking Water Guidelines",
  },
  {
    slug: "whole-house-or-under-sink",
    href: "/resources/whole-house-or-under-sink/",
    title: "Whole-house filter or under-sink: which one?",
    short: "Whole-house or under-sink?",
    description:
      "A filter at the mains treats every tap; an under-sink unit treats one. What each is for, what neither needs to fix in Perth, and where reverse osmosis comes in.",
    published: "2026-09-18",
    from: "WA Health; Water Corporation; WA Building and Energy",
  },
];

export const articleFor = (slug: string) => ARTICLES.find((a) => a.slug === slug);
