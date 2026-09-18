/**
 * THE CALLOUTS ON THE MACHINE.
 *
 * A dot on the part, a hairline leader and a paper tag in the margin. Each is
 * anchored to a real point on the model (centimetres, see dims.ts) and windowed
 * on the journey scalar. The scene projects the anchor every frame and the page
 * draws the tag, so the type stays crisp HTML and the leader stays attached to
 * the part as the camera moves. Desktop only: a phone has no margin to spare.
 *
 * Wording follows the datasheet (docs/sources.md). Nothing here is a result.
 *
 * Every bowl carries its printed stage label from y 23.5 to 34.5 cm, and a
 * neighbouring label sits right where a tag lands. So every tag is anchored
 * above that band (or, for the core, below it): the dot still lands on its
 * layer, and no tag ever covers a label.
 *
 * The other thing a tag can run into is the nav's own pill at the top of the
 * frame. Stage 1's ladder therefore starts lower than stage 2's and stage 3's
 * (its camera is closer, so a centimetre is worth more pixels), and the driver
 * fades any tag whose paper would still land under the pill.
 */
export type Callout = {
  id: string;
  /** the anchor on the model, cm */
  at: [number, number, number];
  text: string;
  /** the journey window it shows in */
  a: number;
  b: number;
  /** which side of the anchor the tag sits */
  side: "l" | "r";
};

/* The section wedge opens 62 degrees either side of the front, so a point on
   a cut face at radius r sits at (x ± r·sin62, y, r·cos62). */
const SIN = Math.sin((62 * Math.PI) / 180);
const COS = Math.cos((62 * Math.PI) / 180);
const onCut = (x: number, r: number, y: number, side: 1 | -1): [number, number, number] => [x + side * r * SIN, y, r * COS];

const X0 = -15.5;
const X1 = 0;
const X2 = 15.5;

export const CALLOUTS: Callout[] = [
  // the machine, uncovered
  { id: "gauges", at: [12.4, 69.3, -1.6], text: "Two pressure gauges, stainless steel and glass", a: 0.205, b: 0.262, side: "r" },
  { id: "brass", at: [7.75, 57.6, 1.9], text: "Brass connectors, housing to housing", a: 0.212, b: 0.262, side: "r" },
  { id: "frame", at: [25.75, 3, 9.6], text: "Steel frame and top plate", a: 0.219, b: 0.262, side: "r" },
  // stage 1, in section (copy on the left, tags to the right)
  { id: "s1-outer", at: onCut(X0, 5.135, 46, 1), text: "Coarse outer layer", a: 0.372, b: 0.448, side: "r" },
  { id: "s1-mid", at: onCut(X0, 3.85, 41, 1), text: "Finer middle layer", a: 0.38, b: 0.448, side: "r" },
  { id: "s1-fine", at: onCut(X0, 2.33, 36.5, 1), text: "Finest layer, to 1 micron", a: 0.388, b: 0.448, side: "r" },
  { id: "s1-core", at: [X0, 17, 0], text: "Filtered water rises up the core", a: 0.398, b: 0.448, side: "r" },
  // stage 2
  { id: "s2-kdf", at: onCut(X1, 4.7, 45.5, 1), text: "KDF 55 and KDF 85 granules", a: 0.505, b: 0.598, side: "r" },
  { id: "s2-gac", at: onCut(X1, 2.7, 38.5, 1), text: "Coconut carbon", a: 0.515, b: 0.598, side: "r" },
  // stage 3 (copy on the right, tags to the left)
  { id: "s3-media", at: onCut(X2, 4.51, 45.5, -1), text: "Limescale-reduction media", a: 0.655, b: 0.728, side: "l" },
  { id: "s3-gac", at: onCut(X2, 2.55, 38.5, -1), text: "Coconut carbon", a: 0.665, b: 0.728, side: "l" },
];
