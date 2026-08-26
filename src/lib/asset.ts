/**
 * basePath-safe public asset URL.
 *
 * This used to hardcode "/nextgen-water-systems" whenever NODE_ENV was
 * production, which was correct while GitHub Pages was the only production
 * target. It is wrong the moment Vercel is one: Vercel builds with NODE_ENV
 * production and NO basePath, so every asset would have resolved to
 * /nextgen-water-systems/photos/... and 404'd — the whole site's photography,
 * the drafting fonts, and the OG image, all missing on the real domain.
 *
 * It now reads the prefix that next.config.mjs computes and inlines, so the
 * two can no longer disagree. Empty string on Vercel and in dev, the repo
 * sub-path on Pages.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const asset = (path: string): string => `${BASE_PATH}${path}`;
