/**
 * THE NEXT GEN LOCKUP, from Aaron's brand concept (the lettering on the grey
 * cover in "Next gen filter.jpeg"):
 *
 *   NEXT GEN                       wide squared face, the widest line
 *   W A T E R   S Y S T E M S      tracked out to the same width
 *   ──────────────────────────     a rule the same width
 *   NEXT GENERATION WATER PROTECTION   small, tracked to the same width
 *
 * Rebuilt from a photograph, so the letterforms are the closest open faces
 * (Michroma for NEXT GEN, Satoshi below). When Aaron supplies the master logo
 * file, it replaces the inside of this component and nothing else moves.
 *
 * The lower lines are laid out letter by letter across the width of NEXT GEN,
 * which is how the concept holds three very different sizes to one measure.
 */
type Props = {
  /** full: all four parts (cover, footer). compact: NEXT GEN over WATER SYSTEMS (nav) */
  variant?: "full" | "compact";
  className?: string;
};

function Spread({ text, className }: { text: string; className: string }) {
  return (
    <span className={className} aria-hidden="true">
      {text.split("").map((ch, i) => (
        <span key={i} className={ch === " " ? "wm-sp" : undefined}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

export function Wordmark({ variant = "full", className = "" }: Props) {
  return (
    <span className={`wm wm--${variant} ${className}`.trim()} role="img" aria-label="Next Gen Water Systems">
      <span className="wm-a" aria-hidden="true">
        NEXT GEN
      </span>
      <Spread text="WATER SYSTEMS" className="wm-b" />
      {variant === "full" && (
        <>
          <span className="wm-rule" aria-hidden="true" />
          <Spread text="NEXT GENERATION WATER PROTECTION" className="wm-c" />
        </>
      )}
    </span>
  );
}
