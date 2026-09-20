import type { Metadata } from "next";
import Link from "next/link";
import { Sheet, Block } from "@/components/site/Sheet";
import { BookingForm } from "@/components/site/BookingForm";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbJsonLd, INSTALLER, SITE_ORIGIN } from "@/lib/jsonld";
import { pageOg } from "@/lib/seo";
import { CONTACT } from "@/content/plates";

/**
 * CONTACT. The phone and the call-back form. There is no Next Gen mailbox yet
 * (the brain, 17 Sep 2026), so no email address appears anywhere until one
 * exists.
 */
export const metadata: Metadata = {
  title: "Contact",
  description:
    "Call Aqua-Safe Plumbing on 0473 072 642 about a Next Gen system, or leave your details for a call back to book a free in-home water test in Perth.",
  alternates: { canonical: "/contact/" },
  openGraph: pageOg("/contact/", "Contact | Next Gen Water Systems"),
};

export default function ContactPage() {
  const tel = CONTACT.phone.replace(/\s/g, "");
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact" }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          url: `${SITE_ORIGIN}/contact/`,
          about: { "@id": `${SITE_ORIGIN}/#business` },
        }}
      />
      <Sheet
        sheet="10"
        kicker="Contact"
        title={
          <>
            Talk to the people
            <br />
            who fit it.
          </>
        }
        lead="Call Aqua-Safe, or leave your name, suburb and number below and they will ring you back to book the free test."
        cta={false}
      >
        <div className="contact-call">
          <a className="contact-phone" href={`tel:${tel}`}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5.5 3.5h3l1.6 4.4-2.2 1.4a11 11 0 0 0 6.8 6.8l1.4-2.2 4.4 1.6v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 3.5 5.7a2 2 0 0 1 2-2.2Z" />
            </svg>
            {CONTACT.phone}
          </a>
          <p>Aqua-Safe Plumbing &amp; Maintenance answer this number for Next Gen.</p>
        </div>

        <Block title="Or ask for a call back">
          <div className="doc-form">
            <BookingForm />
          </div>
        </Block>

        <Block title="Where and who">
          <dl className="spec">
            <div>
              <dt>Area</dt>
              <dd>
                The Perth metro.{" "}
                <Link className="doc-inline" href="/service-areas/">
                  Check your suburb
                </Link>
              </dd>
            </div>
            <div>
              <dt>Installer</dt>
              <dd>
                <a className="installer-link" href={INSTALLER.url} target="_blank" rel="noopener">
                  Aqua-Safe Plumbing &amp; Maintenance
                </a>
                , licensed plumbers and gas fitters, PL10802 and GF22810
              </dd>
            </div>
            <div>
              <dt>ABN</dt>
              <dd>25 770 821 226</dd>
            </div>
          </dl>
        </Block>
      </Sheet>
    </>
  );
}
