"use client";

import { useCallback, useState } from "react";
import { TASTE_OPTIONS } from "@/content/taste";

export const TASTE_KEY = "ngw:taste";

/**
 * "What does yours taste like?" Sits with the booking form. Ticked answers
 * ride into the booking, so the technician knows what he is walking into,
 * and each answer names the stage its media is for (mechanism only; the
 * copy rules are in content/taste.ts).
 */
export function TasteCheck() {
  const [picked, setPicked] = useState<string[]>([]);
  const [latest, setLatest] = useState<string | null>(null);

  const toggle = useCallback(
    (id: string) => {
      const on = picked.includes(id);
      const next = on ? picked.filter((p) => p !== id) : [...picked, id];
      const show = on ? (TASTE_OPTIONS.find((o) => o.id === next[next.length - 1]) ?? null) : (TASTE_OPTIONS.find((o) => o.id === id) ?? null);
      setPicked(next);
      setLatest(show?.id ?? null);
      const plain = TASTE_OPTIONS.filter((o) => next.includes(o.id))
        .map((o) => o.plain)
        .join(", ");
      try {
        if (plain) sessionStorage.setItem(TASTE_KEY, plain);
        else sessionStorage.removeItem(TASTE_KEY);
        window.dispatchEvent(new CustomEvent("ngw:taste", { detail: plain }));
      } catch {
        /* private mode: the check still works, the hand-over just doesn't */
      }
    },
    [picked],
  );

  const shown = latest ? TASTE_OPTIONS.find((o) => o.id === latest) : null;

  return (
    <div className="oc" role="group" aria-labelledby="oc-h">
      <p className="oc-h" id="oc-h">
        What does yours taste like? <span>Optional. Tick what fits and it goes with your booking.</span>
      </p>
      <div className="oc-list">
        {TASTE_OPTIONS.map((o) => {
          const on = picked.includes(o.id);
          return (
            <button key={o.id} type="button" className={`oc-chip${on ? " is-on" : ""}${shown?.id === o.id ? " is-live" : ""}`} aria-pressed={on} onClick={() => toggle(o.id)}>
              <i aria-hidden="true" />
              {o.label}
            </button>
          );
        })}
      </div>
      <p className="oc-answer" aria-live="polite">
        {shown ? (
          <>
            <b>{shown.stage ? `Stage ${shown.stage}` : "The test"}</b>
            {shown.short}
          </>
        ) : (
          <span className="oc-idle">Tick one to see which stage it relates to.</span>
        )}
      </p>
    </div>
  );
}
