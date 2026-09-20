import Link from "next/link";
import { ROUTES, ROUTE_GROUPS } from "@/content/site";
import { ARTICLES } from "@/content/articles";
import { CONTACT } from "@/content/plates";
import C4FooterCredit from "@/components/c4-footer-credit/C4FooterCredit";
import { INSTALLER } from "@/lib/jsonld";

/**
 * The footer, on every page. Every page on the site in three short columns
 * (the system, answers, the business), each link a title with one line of
 * what is on it; the reads sit under Answers. The licences and the ABN are
 * the trust block, and they are all real.
 */
export function SiteFooter() {
  return (
    <footer className="sfoot">
      <div className="sfoot-inner">
        <div className="sfoot-index sfoot-groups">
          {ROUTE_GROUPS.map((g) => (
            <div key={g.id} className="sfoot-group">
              <span className="sfoot-cap">{g.label}</span>
              <ul>
                {g.id === "product" && (
                  <li>
                    <Link href="/">
                      <span>
                        <i>Home</i>
                        Whole-home filtration for Perth, from the mains in.
                      </span>
                    </Link>
                  </li>
                )}
                {ROUTES.filter((r) => r.group === g.id).map((r) => (
                  <li key={r.href}>
                    <Link href={r.href}>
                      <span>
                        <i>{r.label}</i>
                        {r.blurb}
                      </span>
                    </Link>
                  </li>
                ))}
                {g.id === "help" &&
                  ARTICLES.map((a) => (
                    <li key={a.href} className="sfoot-read">
                      <Link href={a.href}>
                        <span>
                          <i>{a.short}</i>
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="sfoot-side">
          <span className="sfoot-cap">Talk to someone</span>
          <a className="sfoot-phone" href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>
            {CONTACT.phone}
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
        <span className="sfoot-credit">
          <C4FooterCredit />
        </span>
      </div>
    </footer>
  );
}
