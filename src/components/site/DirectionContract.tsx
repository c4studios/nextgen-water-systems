/**
 * The direction contract, as an HTML comment at the top of the body. It has
 * to survive the production build (JSX comments do not), so it is emitted as
 * markup. Nothing renders; the element is hidden and out of the tree for
 * assistive tech.
 */
const CONTRACT = `
THESIS: One machine at the mains, launched the way a premium appliance is launched: the product huge and live in the first viewport, its cover lifting the way it really lifts, each stage opened in section on the scroll. Refuses the blue water-splash hero, the three feature cards, the stats band and the testimonial carousel of the category, and refuses equally the drawing-set furniture this page replaces.
OWN-WORLD: (17 Sep 2026, on Aaron's brief: brighter, his brand concept, the real system inside) a white page and a pale studio the machine stands in; charcoal ink from the cover's lettering; one blue for the action and for water; Satoshi headings, Hanken sentences, no drafting labels; a photoreal FHWR-3S1-20 modelled from the supplier's photographs, powder-coated steel, grey polypropylene, black heads, brass and copper, under a grey clip-on Next Gen cover with raised lettering.
STORY: my water tastes of chlorine and furs the kettle; one system at the mains, three stages, every tap; licensed plumbers fit it; the test costs nothing.
FIRST VIEWPORT: outcome line and the one action left, the closed cover right at two-thirds of the viewport height, live: drag turns it, a tap lifts it off; the installer strip along the bottom edge. On phones the cover sits under the copy at half the screen.
FORM: fused hand (launch page + section drawing + installer's card), direction roll 709e77ec, pick built, code-led.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
`;

export function DirectionContract() {
  return <div hidden aria-hidden="true" dangerouslySetInnerHTML={{ __html: `<!--${CONTRACT}-->` }} />;
}
