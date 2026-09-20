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
  /* both start at yawRest, the pose the poster still (cover-still.jpg) was
     rendered in: starting square and easing round over two seconds put a
     second, differently turned cover over the still while it faded */
  yaw: -0.3,
  yawT: -0.3,
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
  /** where the front of each housing sits on screen while the hero owns the
   *  scene, as fractions of the viewport; `on` is false when it does not (the
   *  scene writes these every frame, a hero may pin labels to them) */
  slots: [
    { x: 0, y: 0, on: false },
    { x: 0, y: 0, on: false },
    { x: 0, y: 0, on: false },
  ],
};

/** name of the DOM event the cover fires when the lit vessel changes */
export const HERO_HOT_EVENT = "ngw:hero-hot";

/** fired by the scene when a tap on the closed cover lifts it, so the page's
 *  hint can stop offering to open something that is already open */
export const HERO_OPEN_EVENT = "ngw:hero-open";

/**
 * THE JOURNEY'S ENTRANCE.
 *
 * The scene is fixed to the screen, so while the journey section was still
 * scrolling up into view the machine stood still and the section above slid
 * off it: the machine seemed to lower itself onto the page from above. Now,
 * until the section's top edge reaches the top of the screen, the scene draws
 * itself that far down the frame (a view offset on the camera, and the set's
 * pool of light moved with it), so the machine rises in with its section like
 * anything else on the page. `start` is the scroll position at which the
 * section's top meets the top of the screen (Journey keeps it current); the
 * scene reads it every frame against the live scroll.
 */
export const STAGE_RIDE = {
  /** document scroll y at which the journey's top edge reaches the top of the screen; NaN until measured */
  start: NaN,
  /** the offset applied on the last frame, in CSS pixels (the backdrop reads it) */
  px: 0,
  /** the sideways step the picture takes clear of the copy column, in CSS
   *  pixels, right positive (the backdrop's pool of light goes with it) */
  side: 0,
};

/**
 * A HOUSING UNDER THE POINTER, IN THE JOURNEY. A click on a housing goes to its
 * stage; the scene writes which one the pointer is over and the journey's rail
 * answers on that stage's disc, so the two read as one control.
 */
export const JOURNEY_HOVER = {
  /** housing index under the pointer, or -1 */
  k: -1,
};
