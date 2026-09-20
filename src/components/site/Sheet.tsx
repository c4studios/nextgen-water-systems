import Link from "next/link";
import { CONTACT } from "@/content/plates";
import { asset } from "@/lib/asset";

/**
 * The shell every page other than the homepage sits in.
 *
 * The homepage opens as SHEET 01 of a drawing set, so these are the rest of the
 * set: a title block at the top with the sheet number and the trail back, then
 * the body, then the one CTA. It gives the interior pages the same filing
 * system as the drawing instead of a generic article template, and it means the
 * back-to-home route is structural rather than bolted on.
 */
export function Sheet({
  sheet,
  kicker,
  title,
  lead,
  photo,
  photoAlt,
  photoNote,
  photoW = 1600,
  photoH = 1073,
  photoWhole = false,
  trail,
  byline,
  after,
  cta = true,
  children,
}: {
  sheet: string;
  kicker: string;
  /** crumbs between Home and this page (an article sits under Resources) */
  trail?: { name: string; href: string }[];
  /** a line under the lead: who wrote it, when, from what */
  byline?: React.ReactNode;
  /** after the body, before the closing action: an article's sources */
  after?: React.ReactNode;
  /** the closing "start with the test" card; off where the page is the booking */
  cta?: boolean;
  title: React.ReactNode;
  lead: string;
  /** every sheet carries one photograph under its title block — the pages read
   *  as documents without one, which is what made them feel dry */
  photo?: string;
  photoAlt?: string;
  /** every generated photograph says so where it is shown */
  photoNote?: string;
  /** the photograph's own pixel size, so its box is right before it loads */
  photoW?: number;
  photoH?: number;
  /** show the whole picture at its own proportions instead of the sheet's
   *  cropped band (a render whose subject runs edge to edge) */
  photoWhole?: boolean;
  children: React.ReactNode;
}) {
  return (
    <main id="main" className="doc ground ground--ruled">
      <div className="doc-inner">
        <nav className="doc-trail" aria-label="Breadcrumb">
          <Link className="doc-home" href="/">
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 5.5 8 12l6.5 6.5" />
            </svg>
            Home
          </Link>
          {trail?.map((c) => (
            <span key={c.href} className="doc-crumb">
              <span aria-hidden="true">/</span>
              <Link href={c.href}>{c.name}</Link>
            </span>
          ))}
          <span aria-hidden="true">/</span>
          <span aria-current="page">{kicker}</span>
        </nav>

        <header className="doc-head">
          <h1 className="doc-h">{title}</h1>
          <p className="doc-lead">{lead}</p>
          {byline && <p className="doc-byline">{byline}</p>}
        </header>

        {photo && (
          <figure className={`doc-photo${photoWhole ? " doc-photo--whole" : ""}`}>
            <img src={asset(photo)} alt={photoAlt || ""} width={photoW} height={photoH} loading="lazy" decoding="async" />
            {photoNote && <figcaption className="doc-photo-note">{photoNote}</figcaption>}
          </figure>
        )}

        <div className="doc-body">{children}</div>

        {after}

        {cta && (
        <aside className="doc-cta">
          <h2>Start with the test.</h2>
          <p>
            A licensed plumber tests your own supply at your own tap, tells you what is in it, and leaves. It costs
            nothing and there is no obligation afterwards.
          </p>
          <div className="doc-cta-actions">
            <Link className="doc-btn" href="/water-test/">
              Book your free water test
            </Link>
            <a className="doc-call" href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>
              or call {CONTACT.phone}
            </a>
          </div>
        </aside>
        )}
      </div>
    </main>
  );
}

/** A titled block inside a sheet. Plain heading and prose: no card, no icon. */
export function Block({ n, title, children }: { n?: string; title: string; children: React.ReactNode }) {
  return (
    <section className="doc-block">
      <h2>
        {n && <i aria-hidden="true">{n}</i>}
        {title}
      </h2>
      {children}
    </section>
  );
}
