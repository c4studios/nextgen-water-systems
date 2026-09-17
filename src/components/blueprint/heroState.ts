/**
 * THE HERO'S HANDLE ON THE MACHINE.
 *
 * The page has one WebGL scene, fixed behind the document, and two places that
 * want it: the cover (hero), where the machine sits beside the outcome copy
 * and answers the taste check, and the journey, where the scroll owns it.
 * Rather than mount a second canvas for the cover (double the textures,
 * double the shader compile, a second context to lose on a phone), the cover
 * writes its intent here every frame and the scene reads it in `useFrame`.
 *
 * Plain mutable object, not React state: it changes every frame while the
 * visitor scrolls or drags, and nothing here should re-render.
 */
export const HERO = {
  /** the cover's machine anchor is on screen */
  visible: false,
  /** eased 0..1: how much the scene is in its cover pose (1) vs the journey's (0) */
  mix: 0,
  /** target for `mix` */
  mixT: 0,
  /** centre of the cover's machine anchor, as a fraction of the viewport */
  cx: 0.5,
  cy: 0.5,
  /** the anchor's height and width as fractions of the viewport (the machine is fitted to it) */
  ch: 0.6,
  cw: 0.4,
  /** yaw the visitor has dragged the machine to, radians, and where it eases to */
  yaw: 0,
  yawT: 0,
  /** where the yaw settles when nobody is dragging: a slight three-quarter,
   *  so the folded steel reads as a body with a side and a notch, not a flat card */
  yawRest: -0.3,
  dragging: false,
  /** a drag happened since the last pointerdown: suppresses the click-to-fly */
  dragged: false,
  /** vessel index the taste check has lit, or null */
  hot: null as number | null,
  /** eased 0..1: how far the cover is lifted off on the cover sheet, and its
   *  target (1 while anything is ticked, or after a tap on the closed cover) */
  open: 0,
  openT: 0,
};

/** name of the DOM event the cover fires when the lit vessel changes */
export const HERO_HOT_EVENT = "ngw:hero-hot";

/** fired by the scene when a tap on the closed cover lifts it, so the page's
 *  hint can stop offering to open something that is already open */
export const HERO_OPEN_EVENT = "ngw:hero-open";
