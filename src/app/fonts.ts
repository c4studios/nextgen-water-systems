import localFont from "next/font/local";
import { Michroma } from "next/font/google";

/**
 * Self-hosted (no runtime CDN). Type system:
 * - Satoshi — display/headlines (clean modern geometric grotesque, the calm
 *   premium-engineering register; deliberately not Aqua Safe's Clash Display).
 * - Hanken Grotesk — body (shared sibling DNA, humanist readability).
 * - Geist Mono — engineering figures (the contaminant-reduction %, byline data).
 */
export const satoshi = localFont({
  src: [
    { path: "./fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Satoshi-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const hanken = localFont({
  src: "./fonts/HankenGrotesk-Variable.woff2",
  weight: "400 600",
  style: "normal",
  variable: "--font-hanken",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const geistMono = localFont({
  src: [
    { path: "./fonts/GeistMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/GeistMono-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

/**
 * Michroma — the Next Gen wordmark ONLY. Aaron's brand concept sets NEXT GEN in
 * a wide, squared face with rounded corners; Michroma is the closest open face
 * to it. It is the logo's lettering, never a text face on the site. Fetched and
 * self-hosted at build time by next/font. Swap for the master artwork when
 * Aaron supplies it (brain gap, 15 Sep 2026).
 */
export const michroma = Michroma({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-brand",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});
