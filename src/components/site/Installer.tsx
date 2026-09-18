import { INSTALLER } from "@/lib/jsonld";

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
    <section className="who ground" id="installer" aria-labelledby="who-h">
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
              <dt>Plumbing licence</dt>
              <dd>PL10802</dd>
            </div>
            <div>
              <dt>Gas fitting licence</dt>
              <dd>GF22810</dd>
            </div>
            <div>
              <dt>Workmanship</dt>
              <dd>12-month warranty</dd>
            </div>
            <div>
              <dt>Area</dt>
              <dd>Perth metro</dd>
            </div>
          </dl>
          <a className="who-link" href={INSTALLER.url} target="_blank" rel="noopener">
            {INSTALLER.name}
            <i aria-hidden="true" />
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
            <h3>The test comes first.</h3>
            <p>
              A free test at your kitchen tap, so you know what is actually in your water. Then the
              fit at the mains, with an isolation valve either side. No obligation after the test.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
