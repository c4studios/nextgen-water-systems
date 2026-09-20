"use client";

import Link from "next/link";
import { FIRST_QUESTIONS, QA } from "@/content/questions";
import { QAList } from "./QAList";

/**
 * THE QUESTIONS PEOPLE ASK FIRST.
 *
 * Five answers from the questions page, open one at a time, with the rest a
 * link away. The answers are the page's own (content/questions.tsx), so the
 * two can never drift apart.
 */
export function Questions() {
  const items = FIRST_QUESTIONS.map((q) => QA.find((x) => x.q === q)).filter((x): x is (typeof QA)[number] => !!x);

  return (
    <section className="qs" id="questions" aria-labelledby="qs-h">
      <div className="qs-inner">
        <header className="qs-head">
          <h2 className="qs-h" id="qs-h">
            The questions
            <br />
            people ask first.
          </h2>
          <p className="qs-lead">Including the ones with an answer we would rather give you now than after the test.</p>
          <Link className="qs-all" href="/questions/">
            All the questions
            <i aria-hidden="true" />
          </Link>
        </header>

        <QAList items={items} idPrefix="qs" />
      </div>
    </section>
  );
}
