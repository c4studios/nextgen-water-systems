import Link from "next/link";
import { CONTACT } from "@/content/plates";

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
  children,
}: {
  sheet: string;
  kicker: string;
  title: React.ReactNode;
  lead: string;
  children: React.ReactNode;
}) {
  return (
    <main id="main" className="doc">
      <div className="doc-inner">
        <nav className="doc-trail" aria-label="Breadcrumb">
          <Link className="doc-home" href="/">
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 5.5 8 12l6.5 6.5" />
            </svg>
            Sheet 01
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{kicker}</span>
        </nav>

        <header className="doc-head">
          <span className="doc-no">
            <i>SHEET</i>
            {sheet} / 09
          </span>
          <h1 className="doc-h">{title}</h1>
          <p className="doc-lead">{lead}</p>
        </header>

        <div className="doc-body">{children}</div>

        <aside className="doc-cta">
          <h2>Start with the test.</h2>
          <p>
            A technician tests your own supply at your own tap, tells you what is in it, and leaves. It costs
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
