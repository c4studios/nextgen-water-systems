/**
 * THE MACHINE, MEASURED.
 *
 * Every dimension of the FHWR-3S1-20 in one file, in CENTIMETRES, y up, the
 * frame's bottom rail resting on y = 0 and the assembly centred on x = 0.
 * The camera, the cover fit, the journey rail and the floor all read from
 * here, so a proportion changes in one place.
 *
 * Sources. The overall size is the manufacturer's datasheet (version 1.1,
 * 2024): 74 cm high, 59 cm wide, 21 cm deep with the cover on. The housings
 * are the datasheet's "full-sized 20 × 4.5 inch". Everything else is read off
 * the supplier's component photographs and an installed unit photographed
 * uncovered (Peddey Plumbing & Gas, 2026): a black rectangular-tube frame with
 * a solid top plate, three grey housings with black heads hanging from that
 * plate, two stainless gauges standing on it, red pressure-release buttons,
 * brass ports in series between the heads, and the mains in and house out
 * leaving through the sides. Where a size is inferred it is marked so.
 */

/* ---- the cover, from the datasheet ---- */
export const COVER = {
  w: 59,
  h: 74,
  d: 21,
  /** sheet steel, inferred */
  t: 0.16,
  /** the front face's top edge chamfers back to the lid (concept photograph) */
  chamferTop: { back: 5.5, drop: 5.5 },
  /** below the crease the front face leans in to the foot (concept photograph) */
  crease: { y: 15, in: 3.2 },
  /** the corner notch the port passes through, top front, both sides
   *  (inferred from the concept photograph and an installed white unit) */
  notch: { w: 6.5, d: 14, h: 11, top: 65 },
  /** the lettering block, measured off the concept photograph: NEXT GEN sets
   *  the width and the two lines under it are spread to it */
  lockup: {
    name: { cy: 60.5, w: 34, cap: 3.4 },
    sub: { cy: 55.9, cap: 1.75 },
    ruleY: 53.6,
    tag: { cy: 51.6, cap: 0.95 },
  },
} as const;

/** the cover's foot sits on the floor; its open back faces the wall */
export const COVER_Y = 0;
/** the frame sits toward the wall inside the cover, so the cover's inset foot
 *  still clears the front rail (the datasheet's 21 cm against the frame's 17) */
export const COVER_Z = 1.5;

/* ---- the frame: 25 mm rectangular tube, black powder coat ---- */
export const TUBE = 2.5;
export const FRAME = {
  /** outside width, inferred: the cover clears it by ~2.5 cm a side */
  w: 54,
  /** outside depth */
  d: 17,
  /** the plate's underside; the heads meet it */
  plateBottom: 60,
  plate: { h: 3.6, w: 54, d: 18.5 },
} as const;
export const FRAME_TOP = FRAME.plateBottom + FRAME.plate.h; // 63.6
export const POST_X = FRAME.w / 2 - TUBE / 2;
export const POST_Z = FRAME.d / 2 - TUBE / 2;

/* ---- the three housings, 20 × 4.5 inch ---- */
/** housing centres; the heads nearly touch (photograph) */
export const HOUSING_X = [-15.5, 0, 15.5] as const;
export const BOWL = {
  /** outside radius: a 4.5 inch cartridge plus the wall (inferred 13 cm OD) */
  r: 6.5,
  /** the foot the bowl stands on when set down: a broad, shallow dome
   *  (installed photograph), so the cartridge sits clear of its curve */
  footR: 4.6,
  /** world y of the foot */
  bottom: 5.2,
  /** where the straight wall ends and the collar begins */
  shoulder: 48.5,
  /** the grip collar: slightly wider ring with vertical ribs under the head */
  collar: { r: 6.9, y0: 48.5, y1: 51.6, ribs: 28 },
  /** the threaded neck that screws into the head skirt */
  neck: { r: 6.2, y0: 51.6, y1: 55.5, threads: 5 },
  wall: 0.45,
  domeH: 3.0,
} as const;
export const HEAD = {
  /** skirt that wraps the neck and comes down over the grip collar: on the
   *  installed unit the black head meets the grey bowl with no band between */
  skirtR: 7.4,
  skirtY0: 48.3,
  skirtY1: 55.6,
  /** the shoulder in to the body */
  bodyR: 7.0,
  bodyY0: 55.6,
  /** the head meets the plate underside */
  top: 60,
  /** the in and out ports, centred, pointing ±x */
  port: { y: 57.6, r: 2.05, len: 2.4, boreR: 1.25 },
  /** the series ports between heads barely show: the bodies are 1.5 cm apart */
  gap: 1.5,
  /** the red pressure-release button and the four bolts, on the plate top */
  button: { r: 0.85, h: 0.9, dz: 3.6 },
  bolt: { r: 0.55, h: 0.45, ring: 4.4 },
} as const;
export const CARTRIDGE = {
  r: 5.72,
  /** the cartridge stands on the bowl's centring boss, clear of the domed
   *  foot, and reaches the head's seat */
  len: 48.7,
  bottom: 7.3,
  coreR: 1.35,
  capH: 1.6,
} as const;

/* ---- the gauges, stainless and glass, on the plate top ---- */
export const GAUGE = {
  r: 3.1,
  depth: 2.3,
  bezel: 0.32,
  /** stem from the plate to the case centre */
  stem: { r: 0.6, h: 2.6 },
  /** left front at the inlet, right back at the outlet (photograph) */
  at: [
    { x: -11.5, z: 4.4 },
    { x: 12.4, z: -3.0 },
  ],
} as const;

/* ---- pipework ---- */
export const PIPE = {
  /** 1 inch BSP brass nipples between the heads, at port height */
  nippleR: 1.55,
  /** 20 mm copper to and from the house */
  copperR: 1.0,
  /** the mains arrives from the left, the house leaves to the right, at the
   *  port height, through the cover's notches */
  runY: HEAD.port.y,
  /** how far the copper reaches out of frame */
  reach: 40,
} as const;

/** the floor the frame stands on (the cover foot is at y = 0 too) */
export const FLOOR_Y = 0;

/** the centre of the whole assembly, for the camera to look at */
export const CENTRE_Y = 35;
