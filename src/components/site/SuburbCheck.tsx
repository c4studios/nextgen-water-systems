"use client";

import { useId, useState, type FormEvent } from "react";
import { ALL_SUBURBS, areaFor } from "@/content/areas";
import { CONTACT } from "@/content/plates";

/**
 * "Is my suburb covered?" against Aqua-Safe's own service list
 * (content/areas.ts), with the answer carried into the booking form.
 *
 * Aqua-Safe cover the whole Perth metro, so a suburb that is not on the list
 * by name gets a phone number and an invitation to book, never a refusal.
 */
export const SUBURB_KEY = "ngw:suburb";

export type SuburbResult = { kind: "yes"; suburb: string; area: string } | { kind: "ask"; typed: string } | null;

export function SuburbCheck({ onResult, label = "Check your suburb" }: { onResult?: (r: SuburbResult) => void; label?: string }) {
  const id = useId();
  const [result, setResult] = useState<SuburbResult>(null);
  const tel = CONTACT.phone.replace(/\s/g, "");

  const check = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const typed = String(new FormData(e.currentTarget).get("suburb") || "").trim();
    if (!typed) return;
    const hit = areaFor(typed);
    const r: SuburbResult = hit ? { kind: "yes", suburb: hit.suburb, area: hit.area.name } : { kind: "ask", typed };
    setResult(r);
    onResult?.(r);
    try {
      const suburb = hit ? hit.suburb : typed;
      sessionStorage.setItem(SUBURB_KEY, suburb);
      window.dispatchEvent(new CustomEvent(SUBURB_KEY, { detail: suburb }));
    } catch {
      /* private mode */
    }
  };

  return (
    <form className="sub-check" onSubmit={check} role="search" aria-label={label}>
      <label className="sub-label" htmlFor={`${id}-in`}>
        {label}
      </label>
      <div className="sub-row">
        <input
          id={`${id}-in`}
          name="suburb"
          type="text"
          list={`${id}-list`}
          autoComplete="address-level2"
          placeholder="e.g. Joondalup"
          enterKeyHint="go"
        />
        <button type="submit" className="sub-go">
          Check
        </button>
      </div>
      <datalist id={`${id}-list`}>
        {ALL_SUBURBS.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
      <p className="sub-result" aria-live="polite">
        {result?.kind === "yes" && (
          <>
            <b>Yes, {result.suburb} is covered.</b> It is in Aqua-Safe&rsquo;s {result.area} area. Book the free test and
            your suburb goes with it.
          </>
        )}
        {result?.kind === "ask" && (
          <>
            <b>{result.typed} is not on the list by name.</b> Aqua-Safe cover the whole Perth metro, so book the test or
            call <a href={`tel:${tel}`}>{CONTACT.phone}</a> to check.
          </>
        )}
      </p>
    </form>
  );
}
