import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./brand.css";
import "./world.css";
import "./sections.css";
import { satoshi, hanken, michroma, clash } from "./fonts";
import { SmoothScroll } from "@/lib/providers/SmoothScroll";
import { DirectionContract } from "@/components/site/DirectionContract";
import { Cursor } from "@/components/Cursor";
import { LiquidMetalDefs } from "@/components/ui/LiquidMetal";
import { LAUNCHED, OG_ALT } from "@/lib/seo";
import { localBusinessJsonLd } from "@/lib/jsonld";
import { Nav } from "@/components/Nav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MobileBar } from "@/components/site/MobileBar";

const DESCRIPTION =
  "Whole-home water filtration for Perth. One three-stage system at the mains, installed by licensed plumbers. Book a free in-home water test.";

export const metadata: Metadata = {
  metadataBase: new URL("https://nextgenwatersystems.com.au"),
  title: {
    default: "Next Gen Water Systems | Whole-home water filtration, Perth",
    template: "%s | Next Gen Water Systems",
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "Next Gen Water Systems",
    url: "/",
    title: "Next Gen Water Systems | Whole-home water filtration, Perth",
    description: DESCRIPTION,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: OG_ALT }],
  },
  // summary_large_image, not summary: the card is a 1200x630 composition and
  // the small card crops it to a square thumbnail
  twitter: {
    card: "summary_large_image",
    title: "Next Gen Water Systems | Whole-home water filtration, Perth",
    description: DESCRIPTION,
    images: ["/og.jpg"],
  },
  // Held out of the index until launch. Flip LAUNCHED in src/lib/seo.ts — it
  // drives this and robots.txt together so they can't drift apart.
  robots: LAUNCHED ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#eef0f1",
  colorScheme: "light",
  // The stylesheet reads env(safe-area-inset-*) in several places, and those
  // resolve to zero unless the viewport opts into the full screen. Without this
  // that CSS was inert. Note it does NOT disable user scaling: pinch-zoom stays
  // available, which is a WCAG requirement people break with this meta tag.
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={`${satoshi.variable} ${hanken.variable} ${michroma.variable} ${clash.variable}`}>
      <head>
        {/* the environment is a pure in-scene Lightformer studio now — no HDR
            file, nothing to preload, nothing to race */}
        {/* The drafting face (Routed Gothic) went with the drawing-set world.
            Its three @font-face rules stayed here for a while after; nothing
            rendered in them (document.fonts showed all three unloaded on every
            page, 19 Sep 2026), so they are gone, and world.css points the old
            --font-draft variables at the body face. The woff2 files are still
            in public/fonts with their licence. */}
      </head>
      <body>
        <DirectionContract />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <SmoothScroll>
          <LiquidMetalDefs />
          <Cursor />
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <Nav />
          {children}
          <SiteFooter />
          <MobileBar />
        </SmoothScroll>
      </body>
    </html>
  );
}
