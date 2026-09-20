/**
 * The direction contract, as an HTML comment at the top of the body. It has
 * to survive the production build (JSX comments do not), so it is emitted as
 * markup. Nothing renders; the element is hidden and out of the tree for
 * assistive tech.
 */
const CONTRACT = `
THESIS: One machine at the mains, launched like an appliance: live in the first viewport, its cover lifting as it really lifts, each stage opened in solid section inside a photographic studio, then a plain path to buying. Refuses the water-splash hero, the stats band, the testimonial carousel and the drawing-set furniture.
OWN-WORLD: White page (#ffffff, and the hero's set measures the same), with the quiet sections on a panel tint (#f6f7f7) so a long page keeps a rhythm; a neutral grey studio, #c6c6c4 in the pool of light to about #7d7d7c at the frame corners (measured 19 Sep 2026), lit by softboxes and two rims; charcoal ink; one blue for the action; Satoshi headings, Hanken sentences; a datasheet-accurate FHWR-3S1-20 in satin grey polypropylene, satin-black heads, powder-coated frame and folded-sheet cover, brass and copper, with branded stage labels; macro-drawn media in section; paper callouts on hairline leaders. One bounded exception: the installer's section is Aqua-Safe's own, in their livery (deep teal #0a3f56, white lockup, a Clash Display heading, their own photographs).
STORY: Chlorine taste and a scaled kettle; one system at the mains, three stages; licensed plumbers fit and service it; the test is free and the quote follows it.
FIRST VIEWPORT: Four hero options over the same live machine, from the 18 Sep 2026 brief ("experiment with different hero/landing pages ... doesn't direct the user to anything"), each reviewable at /preview/<ask|suburb|open|original>/. Until Aaron picks, the home page opens on "ask": a question line, a lead that says what the product is (whole-house filtration at the mains, fitted by licensed Perth plumbers), five answers and the blue test action left; the live closed cover right at two-thirds height, which an answer lifts to open its own stage in section (drag turns it); the installer proof strip with drawn icons along the bottom. On a phone the order is question, lead, machine, answers, and the action bar is the test action (the hero's own pill steps out below 900px).
FORM: fused hand, direction roll 709e77ec, extended 17 Sep 2026 on the client's brief, look-dev rebuilt 18 Sep 2026 on the finish review's rebuild directive, extended again 18 Sep 2026 on the client's second brief (hero options, the unpinned kettle, the installer's band, eight new pages), revisited 19 Sep 2026 on the owner's brief after a dual-agent critique and a fifteen-site competitor comparison (the journey's rail, timed beats and wide cut, the visitor's own stage carried into the journey, the page order, the booking), code-led.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
`;

export function DirectionContract() {
  return <div hidden aria-hidden="true" dangerouslySetInnerHTML={{ __html: `<!--${CONTRACT}-->` }} />;
}
