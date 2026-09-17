import { asset } from "@/lib/asset";

/**
 * WHERE IT GOES, with the cover on.
 *
 * This band used to carry a generated photograph of three chrome vessels on a
 * rendered wall. The real system does not look like that: it lives behind a
 * clip-on cover. The image is now Aaron's own Next Gen brand concept (supplied
 * 15 Sep 2026, "Next gen filter.jpeg"), labelled as the visualisation it is,
 * beside the practical notes a homeowner needs about where it goes.
 */
export function ConceptBand() {
  return (
    <section className="cb ground" id="on-the-wall" aria-labelledby="cb-h">
      <div className="cb-inner">
        <figure className="cb-figure">
          <img
            src={asset("/photos/nextgen-cover-concept.jpg")}
            width={900}
            height={1200}
            alt="The Next Gen cover: a grey powder-coated steel cover lettered Next Gen Water Systems, Next Generation Water Protection, standing against a pale wall"
            loading="lazy"
            decoding="async"
          />
          <figcaption>Brand concept. A visualisation, not a photograph of an installed system.</figcaption>
        </figure>
        <div className="cb-copy">
          <h2 className="cb-h" id="cb-h">
            On the wall,
            <br />
            with the cover on.
          </h2>
          <p className="cb-lead">
            It goes where the water comes into the property, usually an outside wall or the garage,
            with an isolation valve either side so the plumber can work on it.
          </p>
          <dl className="cb-notes">
            <div>
              <dt>Size</dt>
              <dd>74 cm high, 59 cm wide, 21 cm deep</dd>
            </div>
            <div>
              <dt>Clearance</dt>
              <dd>Room underneath for the bowls to come off at a cartridge change</dd>
            </div>
            <div>
              <dt>Cover</dt>
              <dd>Clips off by hand. The gauges and fittings stay protected behind it.</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
