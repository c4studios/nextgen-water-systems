import { SheetStrip } from "@/components/site/SheetStrip";

/**
 * SCHEDULE 2 · SPECIFICATION — the manufacturer's numbers, standing still.
 *
 * Source: the manufacturer's non-branded datasheet for the FHWR-3S1-20 series
 * (version 1.1, 2024), supplied by Aaron on 15 Sep 2026. Everything here is a
 * physical or service specification: size, housings, flow, pressure,
 * temperature, the change schedule, the hardware. None of it is a performance
 * claim about what comes out of the water.
 *
 * The same datasheet carries a long list of contaminant reduction
 * percentages. They are not here, and must not be added: that list is for the
 * optional reverse-osmosis add-on, it is marked "for reference purposes only",
 * and unsubstantiated reduction claims about drinking water are misleading
 * conduct under the Australian Consumer Law. Aaron says independent testing is
 * coming; the report slot below is where it goes when it exists.
 */
const ROWS: [string, string][] = [
  ["Overall size", "74 cm high, 59 cm wide, 21 cm deep, cover on"],
  ["Housings", "Three, full-size 20 × 4.5 inch"],
  ["Flow", "50 to 60 litres a minute"],
  ["Working pressure", "100 to 600 kPa"],
  ["Water temperature", "5 to 35 °C"],
  ["Cartridge change", "Every 12 months, as the manufacturer recommends. Your supply can shorten that."],
  ["Connections", "Brass"],
  ["Gauges", "Two, stainless steel and glass"],
  ["Seals", "A double O-ring on each housing"],
  ["Cover", "Steel, clips on with no screws"],
];

export function SpecSchedule() {
  return (
    <section
      className="sps ground sheet-edge"
      id="specification"
      data-sheet="02"
      data-rev="B"
      data-name="SPECIFICATION · SCHEDULE 2"
      aria-labelledby="sps-h"
    >
      <SheetStrip n="02" title="Specification" note="Schedule 2" />
      <div className="sps-inner">
        <div className="sps-head">
          <h2 className="sps-h" id="sps-h">
            The numbers on the
            <br />
            manufacturer&rsquo;s sheet.
          </h2>
          <p className="sps-lead">
            Size, flow and service, as the manufacturer specifies them. Your plumber checks the fit
            against your house at the free water test.
          </p>
        </div>
        <dl className="sps-table">
          {ROWS.map(([k, v]) => (
            <div key={k} className="sps-row">
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="sps-report" role="note">
          <span className="sps-report-k">Test report</span>
          <p>
            <mark className="placeholder">[PLACEHOLDER: independent test report, linked here once it is issued]</mark>
            <span>
              Until it exists, this site describes what each stage does rather than quoting a number.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
