/** @type {import('next').NextConfig} */
/*
  Dual-target build, same shape as the Aqua-Safe project.

  • Vercel (production host) — a full Next app served at the ROOT domain
    (nextgenwatersystems.com.au). No basePath and no static export, so /api
    routes can run as serverless functions and the booking form can post
    somewhere real instead of handing off to the visitor's mail app.
  • GitHub Pages (preview) — a static export served under
    /nextgen-water-systems/. This is what the client has been reviewing. Kept
    working so the preview link in his inbox does not break the moment the
    domain goes live.

  Vercel sets process.env.VERCEL at build time; that is how the targets are
  told apart. asset() reads NEXT_PUBLIC_BASE_PATH so client-rendered <img>
  URLs match whichever target built them — a raw absolute /foo.jpg skips the
  basePath and 404s on Pages, which has bitten this project before.
*/
const repo = "nextgen-water-systems";
const isProd = process.env.NODE_ENV === "production";
const isVercel = !!process.env.VERCEL;

// Only the GitHub Pages build needs the sub-path prefix.
const isGitHubPages = isProd && !isVercel;
const basePath = isGitHubPages ? `/${repo}` : "";

const nextConfig = {
  reactStrictMode: true,
  // Static export only for Pages. On Vercel we keep the server runtime.
  ...(isGitHubPages ? { output: "export" } : {}),
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  // Inlined into the client bundle so asset() builds correct URLs on both.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
