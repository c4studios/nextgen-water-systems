import type { Metadata } from "next";
import { Sheet } from "@/components/site/Sheet";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";
import { pageOg } from "@/lib/seo";
import { QA } from "@/content/questions";
import { QAList } from "@/components/site/QAList";

export const metadata: Metadata = {
  title: "Questions",
  description:
    "Answers on whole-home water filtration in Perth, including what it does not remove and who fits it.",
  alternates: { canonical: "/questions/" },
  openGraph: pageOg("/questions/", "Questions | Next Gen Water Systems"),
};

export default function QuestionsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Questions" }])),
        }}
      />
      <Sheet
        sheet="05"
        kicker="Questions"
        title={
          <>
            Answers, including
            <br />
            the awkward ones.
          </>
        }
        lead="Filtration is a category with a lot of noise in it. Here is what this system does, what it does not, and where we would tell you to look elsewhere."
        photo="/photos/kitchen-glass.jpg"
        photoAlt="A plain glass of water standing on a dark benchtop beside a draining rack, window light from the left"
        photoNote="Visualisation, not a photograph of a Next Gen home."
      >
        <QAList items={QA} idPrefix="qa" className="qa-list" />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(QA)) }}
        />
      </Sheet>
    </>
  );
}
