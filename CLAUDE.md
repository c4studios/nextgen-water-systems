# NextGen Water Systems

Client site for Next Gen Water Systems, Perth whole-home water filtration. Brain `client_id`: `nextgen`. IN PROGRESS. Aqua-Safe Plumbing (`aquasafe`, same owner) are the installers and the site links there.
Next.js 14, App Router, TypeScript, React Three Fiber, GSAP. pnpm.

## The brain
The C4 business database is Cloudflare D1, id `8bb6ab46-8e88-47f8-adff-16316dd2f03e` (MCP tool `d1_database_query`).
Read it before asserting any business fact: `SELECT * FROM clients WHERE id = 'nextgen'`, and `site_issues` for open faults.
Before finishing a session that changed anything here, append a row to `work_log` (repo, client_id, what, why, files, shipped, verified_how).
The database wins over this file and every other markdown file.

## How it deploys
Two targets fire on every push to `main`, and both are live.
Vercel, project `nextgen-water-systems`, git-linked to `c4studios/nextgen-water-systems`. Serves https://nextgen-water-systems.vercel.app. No custom domain is attached to the project.
GitHub Pages, via `.github/workflows/deploy.yml`, still on a push trigger. Serves the static export under `/nextgen-water-systems/`. That is the preview link the client has in his inbox, so it is kept alive on purpose.

## Traps in this repo
nextgenwatersystems.com.au is NOT on Vercel. On 4 Sep 2026 apex and www both resolved to 103.42.108.46, a VentraIP parking page, and https fails. The brain says the domain is pointed at Vercel; it is not, and the Vercel project has no custom domain. Both the DNS change and the Vercel domain attachment are still to do.

`next.config.mjs` is dual-target, the same shape as Aqua-Safe. Without `VERCEL=1` a production build becomes `output: "export"` with a basePath, `headers()` would be ignored and `src/app/api/booking/route.ts` cannot build. Build with `VERCEL=1 pnpm build` to test what Vercel runs. Use `asset()` from `src/lib/asset.ts` for image URLs; a raw `/foo.jpg` 404s on Pages.

Indexing is held off by `LAUNCHED = false` in `src/lib/seo.ts`, which drives the robots meta and `robots.ts` together. Leave it False until the client signs off. `robots.txt` is only honoured at a domain root, so it does nothing on the Pages preview.

Every performance, health, award and finance figure on the site is a PLACEHOLDER flagged with `*`, pending NATA-accredited certificates. Filtration claims are regulated. Never replace a placeholder with a number that is not on a certificate.

`README.md` still calls this a concept exported to GitHub Pages. The Vercel target and the booking API were added 26 Aug 2026. Trust the config over the README.

`.gitignore` has an uncommitted line adding `.vercel`. Commit it on its own; do not sweep it into other work.

## Standing rules that bite here
Never fabricate a testimonial, review or figure. Use a visible `[PLACEHOLDER]` marker instead.
Verify in a real browser or with curl before reporting anything as done. Reading the source is not verification.
