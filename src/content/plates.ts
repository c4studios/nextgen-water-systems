/**
 * The drawing set. The hero LivingDrawing is SHEET 01 (revisions A·B·C); the
 * sections below are SHEET 02–09, each appending one revision row (drafting
 * convention skips "I"). The revision table doubles as the site nav, and the
 * persistent title block re-stamps as each sheet enters — finally flipping to
 * APPROVED FOR ISSUE at the CTA.
 *
 * ⚠️ Every performance / health / award / finance figure here is PLACEHOLDER and
 * flagged (*). Filtration + health claims are regulated; final figures are set at
 * certification. The footer SUBSTANTIATION KEY is the single hub every * points to.
 */
export type Revision = { rev: string; sheet: string; desc: string; id: string };

/** Slice 1: the story lives INSIDE the journey now — the only destination
 *  below it is the booking tail. */
export const SITE_REVISIONS: Revision[] = [
  { rev: "A", sheet: "01", desc: "YOUR WATER · EXHIBIT A", id: "your-water" },
  { rev: "B", sheet: "02", desc: "THE FIX · IN SECTION", id: "drawing" },
  { rev: "C", sheet: "03", desc: "WHERE IT GOES · PLAN", id: "plan" },
  { rev: "D", sheet: "04", desc: "WHO FITS IT · NOTE 1", id: "installer" },
  { rev: "E", sheet: "05", desc: "BOOKING · APPROVED FOR ISSUE", id: "plate-cta" },
];

export const CONTACT = {
  // ⚠️ CONFIRM WITH AARON. This was "1300 000 000" — a fake number rendered on
  // the site. Bookings are taken by the installer, Aqua-Safe, so this is
  // Aaron's real business line. If Next Gen gets its own number, change here.
  phone: "0473 072 642",
  // ⚠️ Not verified that this mailbox exists — the domain resolves but serves
  // nothing. The booking form's mailto fallback sends here. See the audit.
  email: "hello@nextgenwatersystems.com.au",
};
