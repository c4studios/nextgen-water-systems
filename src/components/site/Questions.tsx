"use client";

import Link from "next/link";
import { useState } from "react";
import { FIRST_QUESTIONS, QA } from "@/content/questions";

/**
 * THE QUESTIONS PEOPLE ASK FIRST.
 *
 * Five answers from the questions page, open one at a time, with the rest a
 * link away. The answers are the page's own (content/questions.tsx), so the
 * two can never drift apart.
 */
export function Questions() {
  const items = FIRST_QUESTIONS.map((q) => QA.find((x) => x.q === q)).filter((x): x is (typeof QA)[number] => !!x);
  const [open, setOpen] = useState<number | null>(0);

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

        <div className="qs-list">
          {items.map((item, i) => {
            const on = open === i;
            return (
              <div key={item.q} className={`qs-item${on ? " is-open" : ""}`}>
                <h3 className="qs-q">
                  <button type="button" aria-expanded={on} aria-controls={`qs-a-${i}`} id={`qs-q-${i}`} onClick={() => setOpen(on ? null : i)}>
                    <span>{item.q}</span>
                    <i aria-hidden="true" />
                  </button>
                </h3>
                <div className="qs-a" id={`qs-a-${i}`} role="region" aria-labelledby={`qs-q-${i}`} hidden={!on}>
                  {item.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
