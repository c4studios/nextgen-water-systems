import type { Metadata, Viewport } from "next";
import "./globals.css";
import { satoshi, hanken, geistMono } from "./fonts";
import { SmoothScroll } from "@/lib/providers/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { asset } from "@/lib/asset";
import { LAUNCHED } from "@/lib/seo";
import { localBusinessJsonLd } from "@/lib/jsonld";
import { Nav } from "@/components/Nav";
import { SiteFooter } from "@/components/site/SiteFooter";

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
    title: "Next Gen Water Systems | Whole-home water filtration, Perth",
    description: DESCRIPTION,
  },
  // Held out of the index until launch. Flip LAUNCHED in src/lib/seo.ts — it
  // drives this and robots.txt together so they can't drift apart.
  robots: LAUNCHED ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={`${satoshi.variable} ${hanken.variable} ${geistMono.variable}`}>
      <head>
        {/* the environment is a pure in-scene Lightformer studio now — no HDR
            file, nothing to preload, nothing to race */}
        {/* Routed Gothic (SIL OFL — the digitised Leroy/drafting-template
            lettering; licence in public/fonts). Declared here with asset()
            because CSS url("/fonts/…") would skip the basePath and 404 on
            Pages — the known raw-absolute-URL gotcha. */}
        <style
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
@font-face{font-family:"Routed Gothic";src:url(${asset("/fonts/routed-gothic.ttf")}) format("truetype");font-display:swap}
@font-face{font-family:"Routed Gothic Wide";src:url(${asset("/fonts/routed-gothic-wide.ttf")}) format("truetype");font-display:swap}
@font-face{font-family:"Routed Gothic Narrow";src:url(${asset("/fonts/routed-gothic-narrow.ttf")}) format("truetype");font-display:swap}
@font-face{font-family:"Routed Gothic Half Italic";src:url(${asset("/fonts/routed-gothic-half-italic.ttf")}) format("truetype");font-display:swap}
:root{--font-draft:"Routed Gothic";--font-draft-wide:"Routed Gothic Wide";--font-draft-narrow:"Routed Gothic Narrow";--font-draft-note:"Routed Gothic Half Italic"}`,
          }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <SmoothScroll>
          <Cursor />
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <Nav />
          {children}
          <SiteFooter />
        </SmoothScroll>
      </body>
    </html>
  );
}
