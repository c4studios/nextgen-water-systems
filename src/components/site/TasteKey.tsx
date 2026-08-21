"use client";

import { useState } from "react";
import { TASTE_OPTIONS } from "@/content/taste";

/**
 * "What does yours taste like?" — the one place on the site where the visitor
 * is the subject rather than the machine.
 *
 * The first version set this as a drafted KEY: ruled leaders running out to
 * each term, the way a drawing legends its own symbols. It was a nice idea and
 * it failed as an interface, for a reason worth writing down. A legend is a
 * passive reference. It tells you what things mean; it does not invite you to
 * do anything. So the terms read as labels rather than as controls, the
 * instruction sat underneath them where nobody reads it first, and the right
 * half of the screen was empty. The client's note was that it was blank and
 * gave no direction, and that is exactly what a legend does.
 *
 * This is the same drawing language, but the reference is a job sheet rather
 * than a legend: the checklist a technician actually fills in on site. A
 * checklist is unambiguously something you complete. Boxes you can see, big
 * enough to hit, ticked with a drawn check, and a result panel that fills as
 * you go so the empty half becomes the payoff.
 *
 * Answers are multi-select, each describes a mechanism before handing to the
 * free test, and the selection is written to sessionStorage so the booking
 * form carries it as a plain sentence. That is a real handover to the
 * technician before he is on site, and the reason this is worth building
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
    <section className="tk ground ground--ruled sheet-edge" aria-labelledby="tk-h">
      <div className="tk-inner">
        <div className="tk-left">
          <span className="tk-stamp">
            <b>SITE CHECK</b>
            <span>TICK WHAT APPLIES</span>
          </span>
          <h2 className="tk-h" id="tk-h">
            What does yours
            <br />
            taste like?
          </h2>
          {/* the instruction leads, because an instruction underneath the
              controls is read after the decision it was meant to inform */}
          <p className="tk-lead">
            Tick anything that sounds like your water. More than one is normal. It goes with your
            booking, so the technician knows what he is looking for before he arrives.
          </p>

          <div className="tk-list" role="group" aria-labelledby="tk-h">
            {TASTE_OPTIONS.map((o) => {
              const on = picked.includes(o.id);
              return (
                <button
                  key={o.id}
                  type="button"
                  className={`tk-item${on ? " is-on" : ""}`}
                  aria-pressed={on}
                  onClick={() => toggle(o.id)}
                >
                  <span className="tk-box" aria-hidden="true">
                    <svg viewBox="0 0 20 20" focusable="false">
                      <path
                        d="M4 10.4l4 4 8-9"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="tk-label">{o.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* the right half used to be empty; it is the result now */}
        <div className="tk-right">
          <div className="tk-sheet">
            <div className="tk-sheet-head">
              <span>WHAT THAT MEANS</span>
              <span className="tk-count">
                {picked.length} / {TASTE_OPTIONS.length}
              </span>
            </div>
            <div className="tk-answers" aria-live="polite">
              {answers.length === 0 ? (
                <p className="tk-idle">
                  Nothing ticked yet. Pick one on the left and what causes it, and which stage deals
                  with it, gets written here.
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
            {answers.length > 0 && (
              <p className="tk-carry">
                <span>CARRIED TO BOOKING</span>
                {answers.map((o) => o.plain).join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
