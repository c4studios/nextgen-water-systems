/**
 * THE MACHINE'S PROPORTIONS, IN ONE PLACE.
 *
 * Source: the manufacturer's non-branded datasheet for the FHWR-3S1-20 series
 * (version 1.1, 2024), which Next Gen sells under its own name. Three full-size
 * 20 x 4.5 inch housings stand almost touching on a steel frame, behind a
 * clip-on cover, 74 cm high by 59 cm wide by 21 cm deep. The first model was
 * authored squat and wide with chrome bowls; Aaron asked for the real thing.
 *
 * The vessel meshes were authored in the squat proportions, so rather than
 * re-author every part each vessel is slimmed radially (V_R) and its bowl,
 * cartridge and interior are stretched downward from the head joint (V_S about
 * V_PIVOT). Everything outside those groups (frame, pipes, cover, camera, the
 * drawing plate) is written in the real proportions directly, from here.
 *
 * World units. `local` values are inside the lifted assembly (add MACHINE_Y
 * for world y).
 */

/** vessel centres along x (the housings nearly touch) */
export const V_X = [-1.26, 0, 1.26] as const;
/** radial slim applied to each vessel group */
export const V_R = 0.82;
/** downward stretch of bowl + cartridge + interior, about the head joint */
export const V_S = 1.45;
export const V_PIVOT = 0.745;
/** a y authored in the squat model, after the stretch */
export const vy = (y: number) => V_PIVOT + (y - V_PIVOT) * V_S;

/** the assembly is lifted so the taller machine stays centred on the rail */
export const MACHINE_Y = 0.95;

/** head (black cap) extents, local */
export const HEAD_R = 0.74 * V_R;
export const HEAD_TOP = 1.26;
export const HEAD_BOT = 0.74;
/** housing bowl radius and its domed foot, local */
export const SUMP_R = 0.62 * V_R;
export const SUMP_FOOT = vy(-1.75);
/** cartridge: radius and vertical extent, local */
export const CART_R = 0.4 * V_R;
export const CART_Y = vy(-0.42);
export const CART_H = 2.05 * V_S;

/** the frame, local */
export const FRAME_G = {
  postX: 1.99,
  postZ: 0.62,
  baseY: -3.35,
  plateY: 1.33,
  plateW: 4.22,
  plateD: 1.36,
} as const;
export const FLOOR_Y = FRAME_G.baseY - 0.045;

/** the series pipework height (the nipples between heads), local */
export const PIPE_Y = 1.0;
/** the mains supply and house-out runs, local */
export const RUN_Y = 0.9;
export const ELBOW_X = 2.42;

/** the clip-on cover, local. Profile from the brand concept: flat top with a
 *  chamfer down to the front face, a crease two thirds down where the lower
 *  face angles back to the foot. */
export const COVER = {
  w: 4.56,
  top: 1.84,
  bottom: -3.395, // stands on the floor line (FLOOR_Y)
  back: -0.8,
  front: 0.94,
  chamferDrop: 0.42,
  chamferBack: 0.46,
  creaseY: -1.92,
  footBack: 0.3,
} as const;
export const COVER_H = COVER.top - COVER.bottom;
export const COVER_CY = (COVER.top + COVER.bottom) / 2;

/** the drawing plate's dock pose: camera distance, aim height (world) and the
 *  assembly's x offset while the drawing holds, so the machine sits left of
 *  the sheet's title block */
export const DOCK = { d: 11.5, ty: 0.45, dx: -0.6 } as const;
const FOV_V = 38;
/** plate units per world unit at the dock (the sheet is a 1200 x 900 viewBox
 *  fitted to the camera's zoomed image, so the scale is the same on both axes) */
export const PLATE_K = 450 / (DOCK.d * Math.tan(((FOV_V / 2) * Math.PI) / 180));
/** world (after lift, before the dock x offset) to plate coordinates */
export const toPlateX = (x: number) => 600 + (x + DOCK.dx) * PLATE_K;
export const toPlateY = (yWorld: number) => 450 - (yWorld - DOCK.ty) * PLATE_K;
/** local y to plate */
export const plateY = (yLocal: number) => toPlateY(yLocal + MACHINE_Y);
