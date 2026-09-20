import { INSTALLER } from "@/lib/jsonld";

/** The installer strip under every hero option: who fits it, their licences,
 *  their warranty, where. Aaron's own published details. */
export function HeroProof() {
  return (
      <ul className="hero-proof" aria-label="Who fits it">
        <li>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14.5 5.5a4 4 0 0 0-5.3 5.3L3.5 16.5 7.5 20.5l5.7-5.7a4 4 0 0 0 5.3-5.3l-2.6 2.6-2.8-.6-.6-2.8Z" />
          </svg>
          <span>
            Fitted by{" "}
            <a className="installer-link" href={INSTALLER.url} target="_blank" rel="noopener">
              {INSTALLER.name}
            </a>
          </span>
        </li>
        <li>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3.5 14.2 5l2.6-.2.9 2.5 2.2 1.4-.7 2.5.7 2.5-2.2 1.4-.9 2.5-2.6-.2L12 18.9l-2.2-1.5-2.6.2-.9-2.5-2.2-1.4.7-2.5-.7-2.5 2.2-1.4.9-2.5 2.6.2Z" />
            <path d="m9 11.4 2 2 4-4" />
          </svg>
          <span>Licensed plumbers and gas fitters, PL10802 · GF22810</span>
        </li>
        <li>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3.5 19 6v5.5c0 4.3-3 7.6-7 9-4-1.4-7-4.7-7-9V6Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span>12-month workmanship warranty</span>
        </li>
        <li>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
            <circle cx="12" cy="10" r="2.3" />
          </svg>
          <span>Perth metro</span>
        </li>
      </ul>
  );
}
