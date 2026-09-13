/**
 * The direction contract, as an HTML comment at the top of the body. It has
 * to survive the production build (JSX comments do not), so it is emitted as
 * markup. Nothing renders; the element is hidden and out of the tree for
 * assistive tech.
 */
const CONTRACT = `
THESIS: One machine at the mains, shown the way a drawing set shows a job: a cover sheet, then the sheets. Refuses the product-hero, three-cards, testimonials, form order, and refuses equally the chrome-less scroll film it replaces.
OWN-WORLD: near-black void with one pool of light, ice type, cyan only where water or light is, Routed Gothic draughting labels, sheet strips and title-block furniture, one photoreal machine fixed behind the page; the incumbent frosted-ice nav band that morphs with the scroll, and one redline stamp as the approval mark.
STORY: my water has a name (tick it); one machine at the mains answers it at every tap; licensed plumbers fit it; the free test costs nothing.
FIRST VIEWPORT: outcome line and primary action top-left, the taste check under them lighting the vessel it names, the live machine right (drag to turn, tap a vessel), the inspector strip along the bottom edge. On phones the machine sits between the action and the taste check, so a tick lights something on screen.
FORM: fused hand (test bench + inspection report + annotated object), surface roll b26c6803, dealt 5/6/4, code-led.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
`;

export function DirectionContract() {
  return <div hidden aria-hidden="true" dangerouslySetInnerHTML={{ __html: `<!--${CONTRACT}-->` }} />;
}
