"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CONTACT } from "@/content/plates";
import { FORM_ENDPOINT } from "@/content/booking";

/*
  The booking form, lifted out of the homepage tail so the water-test page can
  carry the same one. POSTs to FORM_ENDPOINT when it is configured, and composes
  a prefilled email until then, so the button is never dead.
*/

type SubmitState = "idle" | "sending" | "logged" | "error";

export function BookingForm() {
  const [state, setState] = useState<SubmitState>("idle");
  // What the visitor told the taste key upstream. It rides along so the
  // technician knows what he is walking into before he is on the doorstep,
  // which is the whole reason that component earns its place.
  const [taste, setTaste] = useState("");

  useEffect(() => {
    const read = () => {
      try {
        setTaste(sessionStorage.getItem("ngw:taste") || "");
      } catch {
        /* private mode */
      }
    };
    read();
    const onTaste = (e: Event) => setTaste((e as CustomEvent<string>).detail || "");
    window.addEventListener("ngw:taste", onTaste);
    return () => window.removeEventListener("ngw:taste", onTaste);
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    // the site check rides along, so the technician knows what he is looking
    // for before he is on site
    if (taste) data.taste = taste;
    const mailto = () => {
      const said = taste ? `\nWhat I told you about my water: ${taste}` : "";
      const body = `Hi Next Gen,\n\nI'd like to book a free in-home water test.\n\nName: ${data.name}\nSuburb: ${data.suburb}\nBest contact number: ${data.phone}\nPreferred day: ${data.day || "any"}${said}\n\nThanks.`;
      window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
        "Free water test: booking request",
      )}&body=${encodeURIComponent(body)}`;
      setState("logged");
    };
    if (!FORM_ENDPOINT) {
      mailto();
      return;
    }
    try {
      setState("sending");
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setState("logged");
        return;
      }
      // The endpoint exists but could not send — most likely RESEND_API_KEY is
      // not set yet. Hand the visitor to their mail app rather than showing
      // them an error on the one action the site is for.
      mailto();
    } catch {
      mailto();
    }
  };

  if (state === "logged") {
    return (
      <div className="tform-logged" role="status">
        <span className="tform-stamp">REQUEST LOGGED · REV E</span>
        <p>
          {FORM_ENDPOINT
            ? "Done. We'll call to confirm a time, and there's no obligation after it."
            : "Your email is ready to send. Fire it off and we'll call to confirm a time."}
        </p>
      </div>
    );
  }

  return (
    <form className="tform" onSubmit={onSubmit}>
      {taste && (
        <p className="tform-carried">
          <span>WHAT YOU TOLD US</span>
          {taste}
          <input type="hidden" name="taste" value={taste} />
        </p>
      )}
      <div className="tform-grid">
        <label>
          <span>NAME</span>
          <input name="name" type="text" autoComplete="name" required placeholder="Jane Citizen" />
        </label>
        <label>
          <span>SUBURB</span>
          <input name="suburb" type="text" autoComplete="address-level2" required placeholder="e.g. Joondalup" />
        </label>
        <label>
          <span>PHONE</span>
          <input name="phone" type="tel" autoComplete="tel" required placeholder="04xx xxx xxx" />
        </label>
        <label>
          <span>PREFERRED DAY</span>
          <input name="day" type="text" placeholder="optional" />
        </label>
      </div>
      <div className="tform-actions">
        <button className="tform-submit lm" type="submit" disabled={state === "sending"}>
          {state === "sending" ? "Logging…" : "Book your free water test"}
        </button>
        <a className="tform-call" href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>
          or call {CONTACT.phone}
        </a>
      </div>
      {state === "error" && (
        <p className="tform-err" role="alert">
          That didn&rsquo;t send. Call us instead, or try again.
        </p>
      )}
    </form>
  );
}
