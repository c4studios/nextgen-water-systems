"use client";

import { useState, type ReactNode } from "react";

/**
 * QUESTIONS THAT OPEN SMOOTHLY.
 *
 * One answer open at a time. The answer never pops: its row animates from
 * zero height to its own height (a grid track going from 0fr to 1fr, which a
 * browser can interpolate where it cannot interpolate `height: auto`), the
 * text lifts a few pixels into place as it arrives, and the plus turns into a
 * minus with it. Closed answers stay in the document, so every answer is
 * still readable by a search engine, but they are `inert` while closed, so
 * they are out of the tab order and out of the accessibility tree until they
 * are opened. Reduced motion gets the same states without the travel.
 */
export type QA = { q: string; a: ReactNode };

export function QAList({ items, idPrefix, initiallyOpen = 0, className = "" }: { items: QA[]; idPrefix: string; initiallyOpen?: number | null; className?: string }) {
  const [open, setOpen] = useState<number | null>(initiallyOpen);
  return (
    <div className={`qs-list ${className}`.trim()}>
      {items.map((item, i) => {
        const on = open === i;
        const qid = `${idPrefix}-q-${i}`;
        const aid = `${idPrefix}-a-${i}`;
        return (
          <div key={item.q} className={`qs-item${on ? " is-open" : ""}`}>
            <h3 className="qs-q">
              <button type="button" aria-expanded={on} aria-controls={aid} id={qid} onClick={() => setOpen(on ? null : i)}>
                <span>{item.q}</span>
                <i aria-hidden="true" />
              </button>
            </h3>
            <div
              className="qs-a-wrap"
              id={aid}
              role="region"
              aria-labelledby={qid}
              {...({ inert: on ? undefined : "" } as Record<string, unknown>)}
            >
              <div className="qs-a">{item.a}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
