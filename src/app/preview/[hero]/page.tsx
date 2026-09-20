import type { Metadata } from "next";
import { HomePage } from "@/components/site/HomePage";
import { HERO_OPTIONS, type HeroKey } from "@/components/site/heroes/options";
import { HeroSwitcher } from "@/components/site/heroes/HeroSwitcher";

/**
 * /preview/<option>/: the home page with one hero option, and a switcher to
 * compare them. For deciding, not for search: every one is noindex, none is
 * in the sitemap, and each declares the home page as its canonical.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return HERO_OPTIONS.map((o) => ({ hero: o.key }));
}

export const metadata: Metadata = {
  title: "Home page options",
  robots: { index: false, follow: false },
  alternates: { canonical: "/" },
};

export default function HeroPreview({ params }: { params: { hero: HeroKey } }) {
  return (
    <>
      <HomePage hero={params.hero} />
      <HeroSwitcher current={params.hero} />
    </>
  );
}
