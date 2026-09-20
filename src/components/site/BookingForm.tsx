"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { SIGNS_KEY } from "@/content/signs";

/* what the hero options hand over (components/site/heroes): the answer to
   "what's your water doing?" and a checked suburb */
const ASK_KEY = "ngw:ask";
const SUBURB_KEY = "ngw:suburb";
import { CONTACT } from "@/content/plates";
import { FORM_ENDPOINT } from "@/content/booking";

/*
  The booking form, lifted out of the homepage tail so the water-test page can
  carry the same one. POSTs to FORM_ENDPOINT when it is configured, and composes
  a prefilled email until then, so the button is never dead.
*/

type SubmitState = "idle" | "sending" | "logged" | "error";

export type BookingKind = "test" | "quote";

/**
 * `extra` is an optional block set between the fields and the button (the home
 * page's taste check). The fields come first: they are the booking. When the
 * visitor has already said what their water is doing, further up the page, the
 * extra folds away behind one quiet line instead of asking again.
 */
export function BookingForm({ kind = "test", extra }: { kind?: BookingKind; extra?: ReactNode }) {
  const [state, setState] = useState<SubmitState>("idle");
  const [extraOpen, setExtraOpen] = useState(false);
  // What the visitor told the taste key upstream. It rides along so the
  // technician knows what he is walking into before he is on the doorstep,
  // which is the whole reason that component earns its place.
  const [tasteOnly, setTasteOnly] = useState("");
  // and what they ticked under the kettle photograph (content/signs.ts)
  const [signs, setSigns] = useState("");
  const [ask, setAsk] = useState("");
  const taste = [ask, signs && `noticed ${signs}`, tasteOnly].filter(Boolean).join("; ");
  const suburbRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const read = () => {
      try {
        setTasteOnly(sessionStorage.getItem("ngw:taste") || "");
        setSigns(sessionStorage.getItem(SIGNS_KEY) || "");
        setAsk(sessionStorage.getItem(ASK_KEY) || "");
        fillSuburb(sessionStorage.getItem(SUBURB_KEY) || "");
      } catch {
        /* private mode */
      }
    };
    read();
    const onTaste = (e: Event) => setTasteOnly((e as CustomEvent<string>).detail || "");
    const onSigns = (e: Event) => setSigns((e as CustomEvent<string>).detail || "");
    const onAsk = (e: Event) => setAsk((e as CustomEvent<string>).detail || "");
    const onSuburb = (e: Event) => fillSuburb((e as CustomEvent<string>).detail || "");
    // a checked suburb fills the field only while it is empty: never over
    // something the visitor typed themselves
    function fillSuburb(v: string) {
      const input = suburbRef.current;
      if (v && input && !input.value.trim()) input.value = v;
    }
    window.addEventListener("ngw:taste", onTaste);
    window.addEventListener(SIGNS_KEY, onSigns);
    window.addEventListener(ASK_KEY, onAsk);
    window.addEventListener(SUBURB_KEY, onSuburb);
    return () => {
      window.removeEventListener("ngw:taste", onTaste);
      window.removeEventListener(SIGNS_KEY, onSigns);
      window.removeEventListener(ASK_KEY, onAsk);
      window.removeEventListener(SUBURB_KEY, onSuburb);
    };
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    data.kind = kind;
    // the site check rides along, so the technician knows what he is looking
    // for before he is on site
    if (taste) data.taste = taste;
    // There is no Next Gen mailbox yet, so nothing here composes an email: when
    // the form cannot post (the static preview has no endpoint, or the endpoint
    // cannot send), the visitor gets the phone number, which is real.
    const handOff = () => setState("error");
    if (!FORM_ENDPOINT) {
      handOff();
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
      // The endpoint exists but could not send (most likely RESEND_API_KEY is
      // not set yet): the phone number is the fallback.
      handOff();
    } catch {
      handOff();
    }
  };

  if (state === "logged") {
    // The moment after someone hands over a phone number is the one they are
    // least sure about. Say what happens next, in order, and promise nothing
    // about timing that the installer has not agreed to.
    return (
      <div className="tform-logged" role="status">
        <span className="tform-stamp">Request logged</span>
        <p>
          {kind === "quote"
            ? "Done. Here is what happens now."
            : "Done, and there is no obligation after the test. Here is what happens now."}
        </p>
        <ol className="tform-next">
          <li>We call you on the number you left to agree a day.</li>
          <li>A licensed plumber tests your water at your own kitchen tap.</li>
          <li>
            {kind === "quote"
              ? "You get the result explained, and the quote is written for your house."
              : "You get the result explained. A quote follows only if you ask for one."}
          </li>
        </ol>
        <p className="tform-next-call">
          Rather not wait? Call <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>{CONTACT.phone}</a>.
        </p>
      </div>
    );
  }

  return (
    <form className="tform" onSubmit={onSubmit}>
      {taste && (
        <p className="tform-carried">
          <span>What you told us</span>
          <b>{taste}</b>
          <input type="hidden" name="taste" value={taste} />
        </p>
      )}
      <div className="tform-grid">
        <label>
          <span>Name</span>
          <input name="name" type="text" autoComplete="name" required placeholder="Jane Citizen" />
        </label>
        <label>
          <span>Suburb</span>
          <input ref={suburbRef} name="suburb" type="text" autoComplete="address-level2" required placeholder="e.g. Joondalup" />
        </label>
        <label>
          <span>Phone</span>
          <input name="phone" type="tel" autoComplete="tel" required placeholder="04xx xxx xxx" />
        </label>
        <label>
          <span>Preferred day</span>
          <input name="day" type="text" placeholder="optional" />
        </label>
      </div>
      {extra &&
        (ask || signs ? (
          <div className="tform-extra">
            {!extraOpen && (
              <button type="button" className="tform-extra-open" aria-expanded="false" onClick={() => setExtraOpen(true)}>
                Add how it tastes
                <span> (optional)</span>
                <i aria-hidden="true" />
              </button>
            )}
            {extraOpen && extra}
          </div>
        ) : (
          <div className="tform-extra">{extra}</div>
        ))}
      <div className="tform-actions">
        <button className="tform-submit lm" type="submit" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : kind === "quote" ? "Ask for a quote" : "Book your free water test"}
        </button>
        <a className="tform-call" href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>
          or call {CONTACT.phone}
        </a>
      </div>
      <p className="tform-after">
        {kind === "quote"
          ? "We call you to talk it through and agree a day for the free test the quote follows."
          : "We call you to agree a day. The test is free, and nothing follows it unless you ask."}
      </p>
      {state === "error" && (
        <p className="tform-err" role="alert">
          That didn&rsquo;t send. Call {CONTACT.phone} and we&rsquo;ll book it over the phone.
        </p>
      )}
    </form>
  );
}
