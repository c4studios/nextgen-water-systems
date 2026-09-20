import { asset } from "@/lib/asset";
import { INSTALLER } from "@/lib/jsonld";
import { CONTACT } from "@/content/plates";

/**
 * WHO FITS IT: the installer's own page in this site.
 *
 * The trust on this site does not come from the website; it comes from the
 * plumber. So this one section is handed to Aqua-Safe Plumbing & Maintenance
 * and dressed in their livery rather than Next Gen's: their deep teal, their
 * white lockup, their display face (Clash Display) for the heading, their own
 * photograph of their vans and three of their own job photos. It reads as
 * the installer stepping in to introduce themselves, and it links straight
 * to their site and their Google listing. The body face is Hanken on both
 * sites, so the two brands share a voice in the sentences.
 *
 * Every fact here is Aaron's own published detail (the licences, the warranty,
 * the phone, "family-owned", the area; aquasafeplumbing.com.au's
 * src/content/business.ts). Nothing here is a review, a rating or a figure:
 * Aqua-Safe's Google reviews are real, but they are about their plumbing, so
 * the section links to them rather than quoting them beside a filter.
 */
const AQ = "/partners/aquasafe";
const REVIEWS_URL = "https://share.google/Yf1t8aThGAXZwWtMS";

const JOBS = [
  { src: `${AQ}/job-hot-water.jpg`, w: 640, h: 1022, label: "Hot water", alt: "A heat-pump hot water system installed against a brick wall, with its pipework run down the wall beside it." },
  { src: `${AQ}/job-gas.jpg`, w: 640, h: 853, label: "Gas fitting", alt: "A commercial gas burner alight with a blue flame under a copper gas line." },
  { src: `${AQ}/job-maintenance.jpg`, w: 640, h: 853, label: "Tap repairs", alt: "A plumber holding a replacement tap cartridge over a basin." },
];

export function Installer() {
  const tel = CONTACT.phone.replace(/\s/g, "");
  return (
    <section className="aq" id="installer" aria-labelledby="aq-h">
      <div className="aq-inner">
        <div className="aq-copy">
          <a className="aq-logo" href={INSTALLER.url} target="_blank" rel="noopener">
            <img src={asset(`${AQ}/logo-white.png`)} alt={INSTALLER.name} width={720} height={251} loading="lazy" decoding="async" />
          </a>
          <h2 className="aq-h" id="aq-h">
            Fitted by licensed
            <br />
            Perth plumbers.
          </h2>
          <p className="aq-lead">
            Aqua-Safe Plumbing &amp; Maintenance fit every system at the mains and come back each year to change
            the cartridges. They do the free test first. They&rsquo;re a family-owned Perth plumbing and gas
            business, and the work carries their 12-month workmanship warranty.
          </p>
          <dl className="aq-facts">
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
              <dd>All of the Perth metro</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>
                <a href={`tel:${tel}`}>{CONTACT.phone}</a>
              </dd>
            </div>
          </dl>
          <div className="aq-act">
            <a className="aq-cta" href={INSTALLER.url} target="_blank" rel="noopener">
              Visit aquasafeplumbing.com.au
              <i aria-hidden="true" />
            </a>
            <a className="aq-more" href={REVIEWS_URL} target="_blank" rel="noopener">
              Aqua-Safe on Google
              <i aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="aq-media">
          <figure className="aq-fleet">
            <img
              src={asset(`${AQ}/fleet.jpg`)}
              alt="Five white Aqua-Safe vans and utes parked in a row at a Perth beach car park, with the ocean behind them."
              width={1600}
              height={900}
              loading="lazy"
              decoding="async"
            />
            <figcaption>The Aqua-Safe fleet, in their own photograph.</figcaption>
          </figure>
          <ul className="aq-jobs" aria-label="From Aqua-Safe's own job photos">
            {JOBS.map((j) => (
              <li key={j.src}>
                <img src={asset(j.src)} alt={j.alt} width={j.w} height={j.h} loading="lazy" decoding="async" />
                <span>{j.label}</span>
              </li>
            ))}
          </ul>
          <p className="aq-jobs-cap">From Aqua-Safe&rsquo;s own job photos.</p>
        </div>
      </div>
    </section>
  );
}
