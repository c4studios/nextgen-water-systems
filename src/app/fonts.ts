import localFont from "next/font/local";
import { Michroma } from "next/font/google";

/**
 * Self-hosted (no runtime CDN). Type system:
 * - Satoshi — display/headlines (clean modern geometric grotesque, the calm
 *   premium-engineering register; deliberately not Aqua Safe's Clash Display).
 * - Hanken Grotesk — body (shared sibling DNA, humanist readability).
 * Geist Mono set engineering figures in the drawing-set world. Nothing on the
 * white launch page is set in a monospace (DESIGN.md, the Two Faces Rule), and
 * its variable on <html> was what made --font-mono resolve to a monospace for
 * the placeholder mark, so the layout no longer applies it. The declaration
 * stays for /dev pages that may still want it.
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
 * Clash Display — Aqua-Safe's display face, for the heading of the installer's
 * own band (Installer.tsx) and nowhere else. It is the one bounded exception to
 * the Two Faces Rule: that section is dressed in the installer's livery, so it
 * speaks in their type. Not preloaded: it sits far down the home page and must
 * never compete with the hero. Same file as aquasafeplumbing.com.au ships
 * (Fontshare, ITF Free Font License).
 */
export const clash = localFont({
  src: "./fonts/ClashDisplay-Semibold.woff2",
  weight: "600",
  style: "normal",
  variable: "--font-clash",
  display: "swap",
  preload: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
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
