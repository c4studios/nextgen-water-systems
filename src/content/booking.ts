/**
 * Booking + proof content for the tail (Slice 2).
 *
 * FORM_ENDPOINT: set this to a Formspree/Basin/Worker URL and the booking
 * form POSTs JSON there (fields: name, suburb, phone, day). While it's null
 * the form still WORKS — submit composes a prefilled email instead — so the
 * page never ships with a dead button. ⚠️ needs the client's account; we
 * can't create one on their behalf.
 */
/**
 * The booking form's endpoint.
 *
 * "/api/booking/" is this site's own serverless route, which only exists on the
 * Vercel build — the GitHub Pages export cannot host it. So the preview build
 * keeps the mailto fallback and the real domain posts properly. NEXT_PUBLIC_BASE_PATH
 * is empty on Vercel and set on Pages, which is exactly the signal needed.
 *
 * ⚠️ The route returns 503 until RESEND_API_KEY is set in Vercel. The form
 * falls back to the mailto compose on any non-2xx, so it is never a dead button.
 */
export const FORM_ENDPOINT: string | null =
  (process.env.NEXT_PUBLIC_BASE_PATH ?? "") === "" ? "/api/booking/" : null;

/**
 * What each stage physically DOES, under the booking form. Deliberately not
 * performance figures, and one row per stage, in the datasheet's own terms
 * (docs/sources.md is the rule: a claim appears only if it traces to a source).
 *
 * History. This table first carried up-to-90/95/96/98/99% reduction claims
 * labelled placeholders pending NATA testing; they came off because
 * unsubstantiated reduction claims about drinking water are misleading conduct
 * under the Australian Consumer Law. It then carried six rows by contaminant
 * (chlorine, lead, heavy metals, iron and hydrogen sulphide, scale, sediment)
 * with a mechanism each, inferred from general KDF chemistry. The datasheet
 * says none of that: it names the media in each cartridge and gives no
 * mechanism for the limescale media at all. On 19 Sep 2026 the rows were cut
 * back to what the sheet supports, and the line promising that the free test
 * "measures this one" came off with them, because what the in-home test
 * measures has never been confirmed with the installer (brain, gaps).
 *
 * A percentage may only return here attributed to a named certification the
 * client has actually supplied (e.g. "NSF/ANSI 42, tested by <lab>"). Never a
 * bare number, and never one we generated. No PFAS, fluoride or TDS: those are
 * reverse-osmosis jobs (docs/filter-reference.md §5).
 */
export type ProofRow = { c: string; v: string; m: string; d: string };
export const PROOF_ROWS: ProofRow[] = [
  {
    c: "Stage 1",
    v: "Sand, rust and silt",
    m: "A three-layer sediment cartridge, rated down to one micron",
    d: "Three layers of fibre, coarse on the outside and fine in the middle. The big particles stop at the surface and the fine ones lodge deeper.",
  },
  {
    c: "Stage 2",
    v: "Chlorine taste and smell",
    m: "KDF 55 and KDF 85 granules, then coconut carbon",
    d: "Copper-zinc granules change chlorine on contact, and the coconut carbon behind them holds what is left. The manufacturer names it the heavy metal reduction and taste improvement cartridge.",
  },
  {
    c: "Stage 3",
    v: "Scale on the kettle and the shower screen",
    m: "Limescale-reduction media, then coconut carbon, to one micron",
    d: "The media works on how the minerals behave. The hardness itself stays in the water.",
  },
];
