import type { Metadata } from "next";
import { Sheet, Block } from "@/components/site/Sheet";
import { BookingForm } from "@/components/site/BookingForm";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { INSTALLER } from "@/lib/jsonld";
import { pageOg } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Free in-home water test",
  description:
    "Book a free in-home water test anywhere in the Perth metro. A technician tests your own supply at your own tap. No obligation.",
  alternates: { canonical: "/water-test/" },
  openGraph: pageOg("/water-test/", "Book a free in-home water test | Next Gen Water Systems"),
};

export default function WaterTestPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Free water test" }]),
          ),
        }}
      />
      <Sheet
        sheet="02"
        kicker="Free water test"
        title={
          <>
            Find out what&rsquo;s
            <br />
            in your water.
          </>
        }
        lead="Every house on the Perth network gets slightly different water by the time it reaches the tap, depending on the run and the age of the pipework. The only way to know what yours is doing is to test it where you drink it."
        photo="/photos/water-test.jpg"
        photoAlt="A handheld water testing meter beside a glass of water and a paper form on a kitchen benchtop"
      >
        <div className="doc-form">
          <BookingForm />
        </div>

        <Block title="What happens">
          <ol className="steps">
            <li>
              <b>You pick a time.</b> Leave your suburb and a number and we call to confirm a day that suits.
            </li>
            <li>
              <b>A technician tests your supply.</b> At your kitchen tap, on the spot, so the result is your
              water rather than a regional average.
            </li>
            <li>
              <b>You get the result explained.</b> What is in it, what the system would change, and what it
              would not. If filtration is not the answer for your house, you get told that.
            </li>
            <li>
              <b>Then nothing, unless you want it.</b> There is no obligation after the test and nobody comes
              back unless you ask.
            </li>
          </ol>
        </Block>

        <Block title="Straight up">
          <p>
            We do not publish reduction percentages. Independent certification is in progress, and until it is
            in hand we would rather tell you the physical job each stage does than quote a number we cannot
            stand behind. The test is the honest version of a sales pitch: it measures your water instead of
            describing someone else&rsquo;s.
          </p>
          <p className="doc-note">
            Tests are carried out across the Perth metro by{" "}
            <a className="installer-link" href={INSTALLER.url} target="_blank" rel="noopener">
              Aqua-Safe Plumbing &amp; Maintenance
            </a>
            , licensed plumbers and gas fitters (PL10802 · GF22810).
          </p>
        </Block>
      </Sheet>
    </>
  );
}
