/**
 * Booking + proof content for the tail (Slice 2).
 *
 * FORM_ENDPOINT: set this to a Formspree/Basin/Worker URL and the booking
 * form POSTs JSON there (fields: name, suburb, phone, day). While it's null
 * the form still WORKS — submit composes a prefilled email instead — so the
 * page never ships with a dead button. ⚠️ needs the client's account; we
 * can't create one on their behalf.
 */
export const FORM_ENDPOINT: string | null = null;

/**
 * What each stage physically DOES. Deliberately not performance figures.
 *
 * This table previously carried up-to-90/95/96/98/99% reduction claims that the
 * page itself labelled placeholders pending NATA testing. Unsubstantiated
 * reduction claims about drinking water are misleading conduct under the
 * Australian Consumer Law and the ACCC has pursued water treatment companies
 * for exactly that. Describing the mechanism is true, checkable, and a better
 * read than a number nobody can source.
 *
 * A percentage may only return here attributed to a named certification the
 * client has actually supplied (e.g. "NSF/ANSI 42, tested by <lab>"). Never a
 * bare number, and never one we generated. KDF/carbon-achievable claims only —
 * no PFAS, fluoride or TDS, which are RO-only (docs/filter-reference.md §5).
 */
export type ProofRow = { c: string; v: string; m: string; d: string };
export const PROOF_ROWS: ProofRow[] = [
  {
    c: "CHLORINE",
    v: "Taste and smell gone",
    m: "carbon + KDF redox",
    d: "Taste, odour and disinfection by-products — the everyday complaint at the tap.",
  },
  {
    c: "LEAD",
    v: "Plated out as solid metal",
    m: "KDF 55 redox — soluble cations",
    d: "Dissolved lead from older fittings gains electrons at the media and plates on as solid metal.",
  },
  {
    c: "HEAVY METALS",
    v: "Bound to the media",
    m: "KDF redox",
    d: "Soluble metal cations bind to the copper-zinc granule surface and stay there.",
  },
  {
    c: "IRON & H₂S",
    v: "Precipitated out",
    m: "KDF 85 redox",
    d: "Staining iron and the rotten-egg smell precipitate out as insoluble solids.",
  },
  {
    c: "SCALE FORMATION",
    v: "Crystallisation inhibited",
    m: "limescale-reduction media",
    d: "Crystallisation is inhibited so minerals rinse through — formation reduction, not hardness removal.",
  },
  {
    c: "SEDIMENT",
    v: "Caught in graded depth",
    m: "10/5/1 µm 3-layer pre-filter",
    d: "Grit, rust and silt caught in graded depth media before the finer stages.",
  },
];
