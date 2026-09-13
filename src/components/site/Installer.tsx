import { INSTALLER } from "@/lib/jsonld";
import { SheetStrip } from "@/components/site/SheetStrip";

/**
 * SHEET 04 — who fits it.
 *
 * The trust on this site does not come from the website; it comes from the
 * plumber. This sheet says so plainly, standing still, with the two licence
 * numbers and the warranty that are already public on the site, and a link
 * out to the installer's own site. It also carries the two beats that phones
 * do not get inside the journey (servicing, the install day), so nothing the
 * desktop journey says is missing on a handset.
 *
 * Nothing here is a review, a rating or a figure. Aqua-Safe's Google reviews
 * are real, but they are the installer's, and the site links to them from the
 * installer's own page rather than quoting them here as if they were about
 * this product.
 */
export function Installer() {
  return (
    <section className="who ground sheet-edge" id="installer" data-sheet="04" data-rev="D" data-name="WHO FITS IT" aria-labelledby="who-h">
      <SheetStrip n="04" title="Who fits it" note="Note 1 · installation" />
      <div className="who-inner">
        <div className="who-main">
          <h2 className="who-h" id="who-h">
            Fitted by licensed
            <br />
            Perth plumbers.
          </h2>
          <p className="who-lead">
            Every system is installed by Aqua-Safe Plumbing and Maintenance, licensed plumbers and gas
            fitters. The work carries a 12-month workmanship warranty. Nothing arrives in a box for you
            to work out yourself.
          </p>
          <dl className="who-facts">
            <div>
              <dt>PLUMBING LICENCE</dt>
              <dd>PL10802</dd>
            </div>
            <div>
              <dt>GAS FITTING LICENCE</dt>
              <dd>GF22810</dd>
            </div>
            <div>
              <dt>WORKMANSHIP</dt>
              <dd>12-month warranty</dd>
            </div>
            <div>
              <dt>AREA</dt>
              <dd>Perth metro</dd>
            </div>
          </dl>
          <a className="who-link" href={INSTALLER.url} target="_blank" rel="noopener">
            {INSTALLER.name}
            <i aria-hidden="true">→</i>
          </a>
        </div>
        <div className="who-notes">
          <article className="who-note">
            <h3>Servicing is a small job.</h3>
            <p>
              Unscrew the bowl, lift the old cartridge out, drop the new one in. Your plumber does it on
              a schedule, so it is one less thing you have to remember.
            </p>
          </article>
          <article className="who-note">
            <h3>It takes an afternoon.</h3>
            <p>
              A free test at your kitchen tap first, so you know what is actually in your water. Then
              a clean fit at the mains, usually inside a few hours. No obligation after the test.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
