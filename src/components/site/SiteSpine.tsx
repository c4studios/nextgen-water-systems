"use client";

import { useEffect, useRef, useState } from "react";
import { PROOF_ROWS } from "@/content/booking";
import { BookingForm } from "@/components/site/BookingForm";

/*
  THE TAIL (Slice 2) — the journey sells; this closes. One compact section in
  the same dark language: a REAL booking form (POSTs to FORM_ENDPOINT when
  configured; composes a prefilled email until then — never a dead button),
  the interactive test schedule, licences and the substantiation line.
*/

/**
 * THE SCHEDULE — what is in scope, and what is not.
 *
 * This sits directly under the booking form, which makes it the last thing a
 * visitor reads before deciding. It used to be a bare list of rows that
 * snapped open, under a red stamp reading NOT A PERFORMANCE CLAIM, followed by
 * a paragraph of everything the product does not do. All of it true, all of it
 * necessary, and all of it framed as an apology at the exact moment someone is
 * deciding whether to trust you.
 *
 * Same facts, read as a trade document instead. A plumber's quote has a scope
 * and it has exclusions, and nobody reads the exclusions as an admission of
 * failure. So the mechanism rows became the scope, the disclaimers became a
 * stated NOT IN SCOPE block, and the honesty now reads as precision.
 */
function Schedule() {
  const [open, setOpen] = useState<number | null>(null);
  const panels = useRef<Array<HTMLDivElement | null>>([]);

  // measured height, same as the stage panels above: `hidden` snaps, and an
  // fr track in an auto-height container jumps instead of interpolating
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    panels.current.forEach((el, i) => {
      if (!el) return;
      const on = i === open;
      if (reduced) {
        el.style.transition = "none";
        el.style.height = on ? "auto" : "0px";
        return;
      }
      el.style.transition = "";
      const from = el.style.height === "auto" ? `${el.scrollHeight}px` : el.style.height || "0px";
      el.style.height = from;
      void el.offsetHeight;
      el.style.height = on ? `${el.scrollHeight}px` : "0px";
      if (!on) return;
      const done = (e: TransitionEvent) => {
        if (e.propertyName !== "height") return;
        el.style.height = "auto";
        el.removeEventListener("transitionend", done);
      };
      el.addEventListener("transitionend", done);
    });
  }, [open]);

  return (
    <div className="sched">
      <div className="sched-head">
        <span className="sched-t">SCOPE OF WORKS</span>
        <span className="sched-stamp">NGW-01 · WHAT EACH STAGE DOES</span>
      </div>

      {PROOF_ROWS.map((r, i) => {
        const on = open === i;
        return (
          <div key={r.c} className={`sched-row${on ? " is-open" : ""}`}>
            <button type="button" onClick={() => setOpen(on ? null : i)} aria-expanded={on}>
              <span className="sched-c">{r.c}</span>
              <span className="sched-v">{r.v}</span>
              <i aria-hidden="true" />
            </button>
            <div
              className="sched-detail"
              aria-hidden={!on}
              ref={(el) => {
                panels.current[i] = el;
              }}
            >
              <div
                className="sched-detail-in"
                {...({ inert: on ? undefined : "" } as Record<string, unknown>)}
              >
                <p>{r.d}</p>
                <p className="sched-m">
                  <b>METHOD</b>
                  {r.m}. Your free in-home test measures this one.
                </p>
              </div>
            </div>
          </div>
        );
      })}

      <div className="sched-out">
        <span className="sched-out-t">NOT IN SCOPE</span>
        <ul>
          <li>
            <b>Figures.</b> We don&rsquo;t publish removal percentages. Independent certification is still
            in progress and we won&rsquo;t quote a number we can&rsquo;t point at.
          </li>
          <li>
            <b>PFAS, fluoride and TDS.</b> Those need reverse osmosis. This deliberately isn&rsquo;t
            that, and anyone telling you otherwise is selling you something else.
          </li>
          <li>
            <b>Softening.</b> It changes how scale behaves. It does not strip the minerals out, so your
            water still tastes like water.
          </li>
        </ul>
      </div>
    </div>
  );
}

export function SiteSpine() {
  return (
    <section id="plate-cta" className="tail" data-sheet="02" data-rev="D" data-name="BOOKING · APPROVED FOR ISSUE">
      <div className="tail-inner">
        <span className="tail-eyebrow">REV D · BOOKING · APPROVED FOR ISSUE</span>
        <h2 className="tail-h">
          Find out what&rsquo;s
          <br />
          in your <span className="tail-cyan">water.</span>
        </h2>
        <p className="tail-p">
          A free, no-obligation in-home water test. A qualified technician tests your actual supply at your kitchen
          tap and shows you exactly what the NGW-01 would change.
        </p>

        <BookingForm />

        <Schedule />

      </div>
    </section>
  );
}
