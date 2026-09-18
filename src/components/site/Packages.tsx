import { asset } from "@/lib/asset";
import { INSTALLER } from "@/lib/jsonld";

/**
 * WHAT YOU GET.
 *
 * The offer, as three things: the system itself, the installation, and the
 * looking-after. The system gets the big panel and the render; the other two
 * sit beside it with a photograph each. Every line comes from the datasheet or
 * from the installer's own published details (docs/sources.md). There is no
 * price, because the price depends on the house, and the page says so.
 */
const SYSTEM = [
  "Three full-size 20 × 4.5 inch housings",
  "Sediment, KDF and carbon, and limescale-reduction cartridges",
  "Two pressure gauges, stainless steel and glass",
  "Steel frame and top plate, brass connectors",
  "Clip-on steel cover, no screws",
  "74 cm high, 59 cm wide, 21 cm deep",
];

export function Packages() {
  return (
    <section className="pk" id="what-you-get" aria-labelledby="pk-h">
      <div className="pk-inner">
        <header className="pk-head">
          <h2 className="pk-h" id="pk-h">
            One system,
            <br />
            fitted and looked after.
          </h2>
          <p className="pk-lead">
            What arrives, who fits it, and what happens after. The price depends on your house, so it comes as
            a quote once the free test is done.
          </p>
        </header>

        <div className="pk-grid">
          <article className="pk-system">
            <div className="pk-render">
              <img
                src={asset("/photos/system-render.jpg")}
                alt="The Next Gen system with its cover off: three grey housings with branded stage labels on a black steel frame, two gauges on the top plate, copper in and out"
                width={1600}
                height={1200}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="pk-system-text">
              <h3 className="pk-t">The Next Gen system</h3>
              <ul className="pk-list">
                {SYSTEM.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          </article>

          <article className="pk-card">
            <figure className="pk-photo">
              <img src={asset("/photos/fitting.jpg")} alt="A plumber's hands tightening a brass fitting on a copper pipe" width={1600} height={1073} loading="lazy" decoding="async" />
            </figure>
            <h3 className="pk-t">Installed by licensed plumbers</h3>
            <ul className="pk-list">
              <li>
                <a className="pk-link" href={INSTALLER.url} target="_blank" rel="noopener">
                  {INSTALLER.name}
                </a>
                , PL10802 · GF22810
              </li>
              <li>At the mains, with an isolation valve either side</li>
              <li>12-month workmanship warranty</li>
            </ul>
          </article>

          <article className="pk-card">
            <figure className="pk-photo">
              <img src={asset("/photos/cartridges.jpg")} alt="Three filter cartridges laid out in order on a benchtop" width={1600} height={1073} loading="lazy" decoding="async" />
            </figure>
            <h3 className="pk-t">Looked after</h3>
            <ul className="pk-list">
              <li>New cartridges every 12 months, as the manufacturer recommends</li>
              <li>Aqua-Safe schedule the change and do it</li>
              <li>The bowls unscrew by hand, so it is a short visit</li>
            </ul>
          </article>
        </div>

        <div className="pk-act">
          <a className="lm pk-cta" href="#quote">
            <span>Ask for a quote</span>
          </a>
          <a className="pk-alt" href="#book">
            Or book the free test first
            <i aria-hidden="true" />
          </a>
          <p className="pk-note">The render is of the system; the photographs are visualisations.</p>
        </div>
      </div>
    </section>
  );
}
