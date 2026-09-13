/**
 * THE SHEET STRIP — where you are in the set.
 *
 * The page reads as one drawing set. Each section is a sheet, and a drawing
 * set tells you which sheet you are holding along its top edge: number, title,
 * count. Five sheets on the cover page: your water, the fix, where it goes,
 * who fits it, the test. The strip is the same on every sheet, so the eye
 * learns it once, and it is the thing that turns a long scroll into a site
 * with an index.
 */
export const SHEETS = "05";

export function SheetStrip({ n, title, note }: { n: string; title: string; note?: string }) {
  return (
    <div className="shs" aria-hidden="true">
      <span className="shs-n">SHEET {n}</span>
      <span className="shs-t">{title}</span>
      {note && <span className="shs-note">{note}</span>}
      <span className="shs-of">
        {n} / {SHEETS}
      </span>
    </div>
  );
}
