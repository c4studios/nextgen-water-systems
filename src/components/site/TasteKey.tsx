"use client";

import { useState } from "react";
import { TASTE_OPTIONS } from "@/content/taste";

/**
 * "What's yours like?" — the one place on the site where the visitor is the
 * subject rather than the machine.
 *
 * Set as a drafted KEY, the way a drawing legends its own symbols: a ruled
 * leader running out to each term. Deliberately not a row of pill chips, which
 * is the same content in the generic grammar every other site uses.
 *
 * Answers are multi-select and each one describes a mechanism before handing to
 * the free test. The selection is then written to sessionStorage so the booking
 * form can carry it through as a plain sentence — which is a real handover to
 * the technician before he is on site, and the reason this is worth building
 * rather than being a toy.
 */

/** where the booking form picks the answer up */
export const TASTE_KEY = "ngw:taste";

export function TasteKey() {
  const [picked, setPicked] = useState<string[]>([]);

  const toggle = (id: string) => {
    const next = picked.includes(id) ? picked.filter((p) => p !== id) : [...picked, id];
    setPicked(next);
    const plain = TASTE_OPTIONS.filter((o) => next.includes(o.id))
      .map((o) => o.plain)
      .join(", ");
    try {
      if (plain) sessionStorage.setItem(TASTE_KEY, plain);
      else sessionStorage.removeItem(TASTE_KEY);
      window.dispatchEvent(new CustomEvent("ngw:taste", { detail: plain }));
    } catch {
      /* private mode: the component still works, the handover just doesn't */
    }
  };

  const answers = TASTE_OPTIONS.filter((o) => picked.includes(o.id));

  return (
    <section className="tk" aria-labelledby="tk-h">
      <div className="tk-inner">
        <h2 className="tk-h" id="tk-h">
          What does yours
          <br />
          taste like?
        </h2>

        <div className="tk-key" role="group" aria-labelledby="tk-h">
          {TASTE_OPTIONS.map((o) => {
            const on = picked.includes(o.id);
            return (
              <button
                key={o.id}
                type="button"
                className={`tk-term${on ? " is-on" : ""}`}
                aria-pressed={on}
                onClick={() => toggle(o.id)}
              >
                <i aria-hidden="true" />
                {o.label}
              </button>
            );
          })}
        </div>

        <div className="tk-answers" aria-live="polite">
          {answers.length === 0 ? (
            <p className="tk-idle">
              Pick whatever fits. You can pick more than one, and it goes with your booking so the
              technician knows before he arrives.
            </p>
          ) : (
            answers.map((o) => (
              <p key={o.id} className="tk-answer">
                <b>{o.label}</b>
                {o.answer}
              </p>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
