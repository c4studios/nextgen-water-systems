import type { Metadata } from "next";
import Link from "next/link";
import { Sheet, Block } from "@/components/site/Sheet";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbJsonLd, INSTALLER } from "@/lib/jsonld";
import { pageOg } from "@/lib/seo";
import { CONTACT } from "@/content/plates";
import { asset } from "@/lib/asset";

/**
 * ABOUT. Who is behind the brand, from the brain's own record: Aaron owns
 * both Next Gen Water Systems and Aqua-Safe Plumbing & Maintenance (clients
 * table, 14 Sep 2026); Next Gen is a business name under the same ABN (public
 * ABR record, docs/sources.md); "family-owned" is Aqua-Safe's own description
 * of itself. The page also says how the site talks about water, because that
 * is the brand's position and it is checkable.
 */
export const metadata: Metadata = {
  title: "About",
  description:
    "Next Gen Water Systems is the whole-home filtration brand from the team behind Aqua-Safe Plumbing & Maintenance, a family-owned Perth plumbing business.",
  alternates: { canonical: "/about/" },
  openGraph: pageOg("/about/", "About | Next Gen Water Systems"),
};

const WA_HEALTH = "https://www.health.wa.gov.au/Articles/A_E/Chlorinated-drinking-water";

/* Aqua-Safe's own photographs, supplied by Aaron in July 2026 for
   aquasafeplumbing.com.au (public/partners/aquasafe, PROVENANCE.md) */
const JOBS = [
  { src: "/partners/aquasafe/job-hot-water.jpg", w: 640, h: 1022, label: "Hot water", alt: "A heat-pump hot water system installed against a brick wall, with its pipework run down the wall beside it." },
  { src: "/partners/aquasafe/job-gas.jpg", w: 640, h: 853, label: "Gas fitting", alt: "A commercial gas burner alight with a blue flame under a copper gas line." },
  { src: "/partners/aquasafe/job-maintenance.jpg", w: 640, h: 853, label: "Tap repairs", alt: "A plumber holding a replacement tap cartridge over a basin." },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About" }])} />
      <Sheet
        sheet="09"
        kicker="About"
        title={
          <>
            A water brand from
            <br />a Perth plumber.
          </>
        }
        lead="Next Gen Water Systems is Aaron’s filtration brand. Aaron also runs Aqua-Safe Plumbing & Maintenance, the licensed plumbers who fit every system and come back to service it."
        photo="/partners/aquasafe/fleet.jpg"
        photoW={1600}
        photoH={900}
        photoAlt="Five white Aqua-Safe vans and utes parked in a row at a Perth beach car park, with the ocean behind them."
        photoNote="The Aqua-Safe fleet, in their own photograph."
      >
        <Block title="Why a plumber sells it">
          <p>
            A whole-home system goes in where the water comes into the property, and connecting it is plumbing
            work. So the people selling Next Gen are the people who fit it at your mains, and they come back for
            the cartridge changes afterwards. There is no hand-off to a stranger after the sale.
          </p>
          <p>
            It also means the free test is done by a plumber at your own tap. If a system at the mains is not
            worth it for your house, that is what you get told.
          </p>
        </Block>

        <Block title="The same plumbers, on other jobs">
          <p>
            Aqua-Safe are a general plumbing and gas business as well as the people behind Next Gen, so the plumber
            who fits your filter has done a lot of other work around Perth homes first.
          </p>
          <ul className="doc-jobs" aria-label="From Aqua-Safe's own job photos">
            {JOBS.map((j) => (
              <li key={j.src}>
                <img src={asset(j.src)} alt={j.alt} width={j.w} height={j.h} loading="lazy" decoding="async" />
                <span>{j.label}</span>
              </li>
            ))}
          </ul>
          <p className="doc-note">From Aqua-Safe&rsquo;s own job photos.</p>
        </Block>

        <Block title="How we talk about water">
          <p>
            Perth&rsquo;s scheme water is safe to drink, and the site never sells against that. WA Health says
            adverse health effects have not been seen in people drinking chlorinated water. People fit a Next Gen
            because of the chlorine taste and smell, or the scale on the kettle and the shower screen.
          </p>
          <p>
            Each stage is described by what it physically does, in the manufacturer&rsquo;s own terms. You will not
            find a reduction percentage here, because the independent test report for this system is still to
            come. When it arrives, its figures will appear with the tester&rsquo;s name on them.
          </p>
          <p className="doc-note">
            Source:{" "}
            <a className="doc-inline" href={WA_HEALTH} target="_blank" rel="noopener">
              WA Health, Chlorinated drinking water
            </a>
            .
          </p>
        </Block>

        <Block title="The business">
          <dl className="spec">
            <div>
              <dt>Trading name</dt>
              <dd>Next Gen Water Systems, a registered business name under ABN 25 770 821 226</dd>
            </div>
            <div>
              <dt>Installer</dt>
              <dd>
                <a className="installer-link" href={INSTALLER.url} target="_blank" rel="noopener">
                  Aqua-Safe Plumbing &amp; Maintenance
                </a>
                , family-owned, under the same ABN
              </dd>
            </div>
            <div>
              <dt>Licences</dt>
              <dd>Plumbing PL10802, gas fitting GF22810</dd>
            </div>
            <div>
              <dt>Workmanship</dt>
              <dd>12-month warranty on the installation</dd>
            </div>
            <div>
              <dt>Area</dt>
              <dd>
                The Perth metro.{" "}
                <Link className="doc-inline" href="/service-areas/">
                  Every suburb on the list
                </Link>
              </dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>
                <a className="doc-inline" href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>
                  {CONTACT.phone}
                </a>
              </dd>
            </div>
          </dl>
        </Block>
      </Sheet>
    </>
  );
}
