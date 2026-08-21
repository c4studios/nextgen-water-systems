import Link from "next/link";
import { ROUTES } from "@/content/site";
import { CONTACT } from "@/content/plates";
import C4FooterCredit from "@/components/c4-footer-credit/C4FooterCredit";
import { INSTALLER } from "@/lib/jsonld";

/**
 * The footer, on every page. Set out as the drawing set's index rather than as
 * four columns of links: sheet number, title, one line of what is on it. The
 * licences and the ABN are the trust block, and they are all real.
 */
export function SiteFooter() {
  return (
    <footer className="sfoot">
      <div className="sfoot-inner">
        <div className="sfoot-index">
          <span className="sfoot-cap">Drawing set</span>
          <ul>
            <li>
              <Link href="/">
                <b>01</b>
                <span>
                  <i>The machine</i>
                  Whole-home filtration, drawn from the mains in.
                </span>
              </Link>
            </li>
            {ROUTES.map((r) => (
              <li key={r.href}>
                <Link href={r.href}>
                  <b>{r.sheet}</b>
                  <span>
                    <i>{r.label}</i>
                    {r.blurb}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="sfoot-side">
          <span className="sfoot-cap">Talk to someone</span>
          <a className="sfoot-phone" href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>
            {CONTACT.phone}
          </a>
          <a className="sfoot-mail" href={`mailto:${CONTACT.email}`}>
            {CONTACT.email}
          </a>
          <p className="sfoot-fine">
            Installed Perth-wide by{" "}
            <a className="installer-link" href={INSTALLER.url} target="_blank" rel="noopener">
              Aqua-Safe Plumbing &amp; Maintenance
            </a>
            , licensed plumbers and gas fitters (PL10802 · GF22810), with a 12-month workmanship
            warranty on the installation.
          </p>
        </div>
      </div>

      <div className="sfoot-rule" aria-hidden="true" />

      <div className="sfoot-bottom">
        <span>© 2026 Next Gen Water Systems · ABN 25 770 821 226 · Perth, Western Australia</span>
        <C4FooterCredit />
      </div>
    </footer>
  );
}
