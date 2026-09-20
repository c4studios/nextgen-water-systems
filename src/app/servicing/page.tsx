import type { Metadata } from "next";
import Link from "next/link";
import { Sheet, Block } from "@/components/site/Sheet";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbJsonLd, INSTALLER } from "@/lib/jsonld";
import { pageOg } from "@/lib/seo";
import { CONTACT } from "@/content/plates";

/**
 * SERVICING. The reference sites all sell the care after the fit (Just Water
 * Co's "care plan", Armour's cartridge reminders); this is Next Gen's, from
 * the facts on file: the datasheet's change interval (12 months recommended,
 * 18 at most; docs/sources.md), WA Building and Energy on who may change a
 * cartridge, and HealthyWA on filters left unmaintained
 * (docs/research/perth-water-sources.md). The price is not known yet, so it
 * is a visible placeholder.
 */
export const metadata: Metadata = {
  title: "Servicing and cartridge changes",
  description:
    "A Next Gen system takes a new set of cartridges every 12 months. Aqua-Safe Plumbing keep the date and change them at your house, anywhere in the Perth metro.",
  alternates: { canonical: "/servicing/" },
  openGraph: pageOg("/servicing/", "Servicing and cartridge changes | Next Gen Water Systems"),
};

const B_AND_E = "https://www.wa.gov.au/organisation/building-and-energy/plumbing-work-your-home";
const HEALTHY_WA = "https://www.healthywa.wa.gov.au/Articles/U_Z/Water-filters-for-your-home";

export default function ServicingPage() {
  const tel = CONTACT.phone.replace(/\s/g, "");
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Servicing" }])} />
      <Sheet
        sheet="06"
        kicker="Servicing"
        title={
          <>
            A new set of cartridges,
            <br />
            once a year.
          </>
        }
        lead="The manufacturer recommends changing all three cartridges every 12 months, and rates them to 18 at the most. Aqua-Safe keep the date and come to you, so it is one thing fewer to remember."
        photo="/photos/servicing.jpg"
        photoH={1072}
        photoWhole
        photoAlt="The filter unit with its three bowls unscrewed and standing on the floor beside it, and the three cartridges hanging from their heads, each cut open to show its media."
        photoNote="Rendered from this site’s own model of the machine, with each cartridge cut open to show its media."
      >
        <Block title="What happens at a service">
          <ol className="steps">
            <li>
              <b>The water goes off at the unit.</b> The plumber closes the isolation valves either side of it.
              Nothing else in the house needs touching.
            </li>
            <li>
              <b>Each bowl comes off.</b> The bowls unscrew from their heads, the old cartridges lift out and the
              new ones drop in. The O-rings get a look as the bowls go back on.
            </li>
            <li>
              <b>The water comes back on.</b> The two gauges on the top plate show the pressure through the
              system, which is how a cartridge that is filling up early gets noticed.
            </li>
            <li>
              <b>The next one goes in the diary.</b> Aqua-Safe get in touch when it is due.
            </li>
          </ol>
        </Block>

        <Block title="How often">
          <p>
            Every 12 months is the manufacturer&rsquo;s recommendation for all three stages, and 18 months is the
            most the cartridges are rated for. Use and sediment both load a cartridge, so a big household can reach
            the end of one sooner. The gauges show it when that happens.
          </p>
        </Block>

        <Block title="Can I change them myself?">
          <p>
            You can. In Western Australia, replacing a water filter cartridge is one of the few plumbing jobs a
            homeowner may do without a licence. Anything past that, like moving the unit or working on the pipes
            around it, is work for a licensed plumber.
          </p>
          <p>
            Most people would rather it sat on someone else&rsquo;s list, which is what the schedule is for.
          </p>
          <p className="doc-note">
            Source:{" "}
            <a className="doc-inline" href={B_AND_E} target="_blank" rel="noopener">
              WA Building and Energy, Plumbing work in your home
            </a>
            .
          </p>
        </Block>

        <Block title="Why it is worth keeping to">
          <p>
            A cartridge left in past its life stops doing its job. WA Health&rsquo;s advice on home filters also
            notes that a filter which is not maintained can let bacteria build up on it. The date in the diary is
            there so a cartridge is changed before either happens.
          </p>
          <p className="doc-note">
            Source:{" "}
            <a className="doc-inline" href={HEALTHY_WA} target="_blank" rel="noopener">
              HealthyWA, Water filters for your home
            </a>
            .
          </p>
        </Block>

        <Block title="What it costs">
          <p>
            <mark className="placeholder">[PLACEHOLDER: the price of a cartridge set and a service visit, to come from Aaron]</mark>
          </p>
          <p>
            Until then, call{" "}
            <a className="doc-inline" href={`tel:${tel}`}>
              {CONTACT.phone}
            </a>{" "}
            and ask. Services are carried out by{" "}
            <a className="installer-link" href={INSTALLER.url} target="_blank" rel="noopener">
              Aqua-Safe Plumbing &amp; Maintenance
            </a>{" "}
            across the Perth metro. For what the three cartridges each do, see{" "}
            <Link className="doc-inline" href="/system/">
              the system
            </Link>
            .
          </p>
        </Block>
      </Sheet>
    </>
  );
}
