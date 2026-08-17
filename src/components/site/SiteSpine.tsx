"use client";

import { useState } from "react";
import { PROOF_ROWS } from "@/content/booking";
import { BookingForm } from "@/components/site/BookingForm";

/*
  THE TAIL (Slice 2) — the journey sells; this closes. One compact section in
  the same dark language: a REAL booking form (POSTs to FORM_ENDPOINT when
  configured; composes a prefilled email until then — never a dead button),
  the interactive test schedule, licences and the substantiation line.
*/

function ProofTable() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="proof">
      <div className="proof-head">
        <span>WHAT EACH STAGE DOES</span>
        <span className="proof-stamp">MECHANISM · NOT A PERFORMANCE CLAIM</span>
      </div>
      {PROOF_ROWS.map((r, i) => (
        <div key={r.c} className={`proof-row${open === i ? " is-open" : ""}`}>
          <button type="button" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
            <span className="proof-c">{r.c}</span>
            <span className="proof-v">{r.v}</span>
            <i aria-hidden="true">{open === i ? "–" : "+"}</i>
          </button>
          <div className="proof-detail" hidden={open !== i}>
            <p>{r.d}</p>
            <p className="proof-m">METHOD · {r.m} · your free in-home test measures this</p>
          </div>
        </div>
      ))}
      <p className="proof-note">
        This describes what each stage physically does to the water. It does not say how much of anything
        comes out, because independent certification is still in progress and we won&rsquo;t quote a figure we
        can&rsquo;t source. There are no PFAS, fluoride or TDS claims here either: those need reverse osmosis,
        and this system deliberately isn&rsquo;t that.
      </p>
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

        <ProofTable />

      </div>
    </section>
  );
}
