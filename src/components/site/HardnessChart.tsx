"use client";

import { useMemo, useState } from "react";
import { HARDNESS_GUIDELINE, HARDNESS_SOURCE, PERTH_HARDNESS } from "@/content/perthWater";

/**
 * Perth's hardness, area by area: a real table (so it reads out as one), drawn
 * as a chart. Each row is an area's 2024-25 mean as a bar, with a thin line
 * across the lowest and highest sample, on a scale that shows the national
 * guideline at 200 mg/L and the "soft" line at 60. Sort hardest first or A to
 * Z. The figures are Water Corporation's, untouched (content/perthWater.ts).
 */
const SCALE = 250;
const pct = (v: number) => `${Math.min(100, (v / SCALE) * 100).toFixed(2)}%`;

export function HardnessChart() {
  const [order, setOrder] = useState<"hard" | "az">("hard");
  const rows = useMemo(
    () => [...PERTH_HARDNESS].sort((a, b) => (order === "hard" ? b.mean - a.mean : a.area.localeCompare(b.area))),
    [order],
  );
  return (
    <figure className="hc">
      <div className="hc-head">
        <p className="hc-title" id="hc-title">
          Mean hardness by area, 2024-25 <span>mg/L as calcium carbonate</span>
        </p>
        <div className="hc-sort" role="group" aria-label="Sort the areas">
          <button type="button" aria-pressed={order === "hard"} onClick={() => setOrder("hard")}>
            Hardest first
          </button>
          <button type="button" aria-pressed={order === "az"} onClick={() => setOrder("az")}>
            A to Z
          </button>
        </div>
      </div>
      <div className="hc-scroll">
        <table className="hc-table" aria-labelledby="hc-title">
          <thead>
            <tr>
              <th scope="col">Area</th>
              <th scope="col" className="hc-bar-h">
                <span className="hc-axis" aria-hidden="true">
                  <i style={{ left: pct(60) }}>60</i>
                  <i style={{ left: pct(HARDNESS_GUIDELINE) }} className="is-line">
                    200 guideline
                  </i>
                </span>
                <span className="hc-sr">Mean, with the range of samples</span>
              </th>
              <th scope="col" className="hc-num">
                Mean
              </th>
              <th scope="col" className="hc-num hc-range-h">
                Range
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.area} className={r.mean > HARDNESS_GUIDELINE ? "is-over" : r.mean < 60 ? "is-soft" : undefined}>
                <th scope="row">
                  {r.area}
                  {r.note && <sup title={r.note}>*</sup>}
                </th>
                <td className="hc-bar" aria-hidden="true">
                  <span className="hc-track">
                    <span className="hc-fill" style={{ width: pct(r.mean) }} />
                    <span className="hc-range" style={{ left: pct(r.min), width: `calc(${pct(r.max)} - ${pct(r.min)})` }} />
                    <span className="hc-guide" style={{ left: pct(HARDNESS_GUIDELINE) }} />
                  </span>
                </td>
                <td className="hc-num">{r.mean}</td>
                <td className="hc-num hc-range-v">
                  {r.min}&ndash;{r.max}
                  <span className="hc-n"> ({r.samples} samples)</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="hc-cap">
        Source: {HARDNESS_SOURCE.publisher},{" "}
        <a href={HARDNESS_SOURCE.url} target="_blank" rel="noopener">
          {HARDNESS_SOURCE.title}
        </a>
        , {HARDNESS_SOURCE.table}, samples taken {HARDNESS_SOURCE.period}. The areas are Water Corporation&rsquo;s
        water-quality localities, which do not follow suburb boundaries; the report&rsquo;s Appendix B maps them.
        * Two Rocks: &ldquo;Elevated hardness is characteristic of the source supplying this locality.&rdquo;
      </figcaption>
    </figure>
  );
}
