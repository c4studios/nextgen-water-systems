"use client";

import { useEffect, useState } from "react";
import { SITE_REVISIONS } from "@/content/plates";

/**
 * The document-is-the-site spine. A fixed Geist-Mono title block (bottom-right)
 * re-stamps DWG / SHEET / VIEW / REV as each sheet enters, flipping to APPROVED
 * FOR ISSUE on the CTA; a revision rail accrues a row per sheet reached and
 * doubles as the nav. Reads the DOM `[data-sheet]` plates via IntersectionObserver
 * — pure DOM, no 3D risk.
 */
export function DrawingChrome() {
  const [active, setActive] = useState({ sheet: "00", name: "COVER", rev: "" });
  const [reached, setReached] = useState<string[]>([]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-sheet]"));
    if (!sections.length) return;
    // The stamp names the sheet holding most of the middle band of the screen,
    // measured in pixels. A callback reports only the sheets that crossed a
    // threshold, so the choice is made over every sheet's last known share.
    // The old ratio thresholds started at 20%, which the journey (ten screens
    // tall) and the exhibit never reach, so the stamp went stale over them.
    const share = new Map<Element, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          share.set(e.target, e.isIntersecting ? e.intersectionRect.height : 0);
          if (e.isIntersecting) {
            const id = (e.target as HTMLElement).id;
            setReached((r) => (r.includes(id) ? r : [...r, id]));
          }
        }
        let best: HTMLElement | undefined;
        let bestH = 0;
        for (let i = 0; i < sections.length; i++) {
          const h = share.get(sections[i]) ?? 0;
          if (h > bestH) {
            bestH = h;
            best = sections[i];
          }
        }
        if (best) {
          setActive({ sheet: best.dataset.sheet || "01", name: best.dataset.name || "", rev: best.dataset.rev || "" });
        }
      },
      { threshold: [0, 0.01, 0.03, 0.06, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 1], rootMargin: "-25% 0px -25% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const approved = active.sheet === "05";
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <aside className="chrome">
      <nav className="chrome-rev" aria-label="Drawing revisions">
        {SITE_REVISIONS.map((r) => (
          <button
            key={r.rev}
            type="button"
            className={`chrome-rev-row ${active.rev === r.rev ? "on" : ""} ${reached.includes(r.id) ? "reached" : "pending"}`.trim()}
            onClick={() => go(r.id)}
            title={`Sheet ${r.sheet} · ${r.desc}`}
          >
            <span className="crr-rev">{r.rev}</span>
            <span className="crr-sheet">{r.sheet}</span>
            <span className="crr-desc">{r.desc}</span>
          </button>
        ))}
      </nav>
      <div className="chrome-tb">
        <div className="chrome-tb-co">NEXT GEN WATER SYSTEMS</div>
        <div className="chrome-tb-grid">
          <div className="chrome-tb-cell">
            <i>DWG</i>NGW-01
          </div>
          <div className="chrome-tb-cell">
            <i>SHEET</i>
            {active.sheet} / 05
          </div>
          <div className="chrome-tb-cell chrome-tb-view">
            <i>VIEW</i>
            {active.name || "··"}
          </div>
        </div>
        <div className={`chrome-tb-stamp ${approved ? "approved" : ""}`.trim()}>
          {approved ? "APPROVED FOR ISSUE" : "INDICATIVE · PLACEHOLDER*"}
        </div>
      </div>
    </aside>
  );
}
