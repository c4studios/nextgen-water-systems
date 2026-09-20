import { asset } from "@/lib/asset";

/**
 * WHERE IT GOES, with the cover on.
 *
 * This band used to carry a generated photograph of three chrome vessels on a
 * rendered wall. The real system does not look like that: it lives behind a
 * clip-on cover. The images are the client's own Next Gen brand concept
 * (supplied 15 Sep 2026, "Next gen filter.jpeg") and the same cover as the
 * site's own model renders it, both labelled as the visualisations they are,
 * beside the practical notes a homeowner needs about where it goes.
 *
 * The render sat in the buying path until 18 Sep 2026, where a studio product
 * shot stood between three daylight scenes and broke the row's register. It
 * belongs here, next to the concept it was modelled from.
 */
export function ConceptBand() {
  return (
    <section className="cb ground" id="on-the-wall" aria-labelledby="cb-h">
      <div className="cb-inner">
        <div className="cb-figs">
          <figure className="cb-figure">
            <img
              src={asset("/photos/nextgen-cover-concept.jpg")}
              width={900}
              height={1200}
              alt="The Next Gen cover: a grey powder-coated steel cover lettered Next Gen Water Systems, Next Generation Water Protection, standing against a pale wall"
              loading="lazy"
              decoding="async"
            />
            <figcaption>A concept image of the cover on a wall, not a photograph of an installed system.</figcaption>
          </figure>
          <figure className="cb-figure cb-figure--wide">
            <img
              src={asset("/photos/system-covered.jpg")}
              width={1600}
              height={1200}
              alt="The same cover on the modelled system: folded grey steel over the three housings, with the copper in and out at the sides"
              loading="lazy"
              decoding="async"
            />
            <figcaption>The same cover, rendered from this site&rsquo;s own model of the machine.</figcaption>
          </figure>
        </div>
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
