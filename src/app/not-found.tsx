import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES } from "@/content/site";

/**
 * 404.
 *
 * There was no not-found route, so a wrong URL fell through to Next.js's stock
 * page: a white screen with "This page could not be found." on it, inside a
 * site that is dark from top to bottom, with the site nav rendering over the
 * top of it. A white flash on a dark brand reads as the site having broken
 * rather than as a page being missing, and the stock page offers no route back,
 * which on a site whose only goal is a booked water test means a lost visitor.
 *
 * In the drawing language a missing page is the obvious thing: a sheet that is
 * not in this set. The drawing register makes the apology unnecessary, and the
 * sheet index doubles as the way back.
 */
export const metadata: Metadata = {
  title: "Sheet not found",
  description: "That page is not part of this drawing set.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main id="main" className="nf ground ground--ruled">
      <div className="nf-inner">
        <span className="nf-stamp">
          <b>404</b>
          <span>SHEET NOT IN SET</span>
        </span>

        <h1 className="nf-h">
          That sheet isn&rsquo;t
          <br />
          in this set.
        </h1>
        <p className="nf-lead">
          The address you followed doesn&rsquo;t match anything on the drawing. It may have been
          renamed, or the link may have been mistyped. Everything the set does contain is listed
          below.
        </p>

        <nav className="nf-index" aria-label="All pages">
          <span className="nf-index-head">SHEET INDEX</span>
          <Link href="/">
            <b>01</b>
            <span>Home</span>
            <i aria-hidden="true">The machine, end to end.</i>
          </Link>
          {/* sorted by sheet number so the index reads like a real one, and
              using each route's own blurb rather than inventing descriptions */}
          {[...ROUTES]
            .sort((a, b) => a.sheet.localeCompare(b.sheet))
            .map((r) => (
              <Link key={r.href} href={r.href}>
                <b>{r.sheet}</b>
                <span>{r.label}</span>
                <i aria-hidden="true">{r.blurb}</i>
              </Link>
            ))}
        </nav>

        <Link className="nf-cta" href="/water-test/">
          Book a free water test
        </Link>
      </div>
    </main>
  );
}
