/**
 * HOW THE COVER COMES OFF.
 *
 * The datasheet's cover is a clip-on: hold-and-press clips, no screws. In
 * life you pull the bottom of the cover forward until the clips let go, then
 * lift the whole thing straight up until the port notches clear the pipe
 * fittings, and carry it away. That is the motion here, as one scalar:
 *
 *   0.00–0.22  the foot comes forward: the cover pivots a few degrees about
 *              its top back edge, and the clips release
 *   0.22–0.80  it rises, still held at that angle, clearing the fittings
 *   0.80–1.00  it squares up and keeps rising, out of the frame
 *
 * It is a rigid body throughout. Nothing fades.
 */
import * as THREE from "three";
import { COVER, COVER_Y, COVER_Z } from "./dims";

const ss = (x: number, a: number, b: number) => THREE.MathUtils.smoothstep(x, a, b);

/** total rise at lift = 1, in centimetres */
export const LIFT_RISE = 112;

/** `riseTotal` is how far it goes at lift = 1: at least LIFT_RISE, and on a
 *  tall frame (a phone) as much as it takes to leave the top of the frame */
export function coverPose(cover: THREE.Object3D, lift: number, riseTotal = LIFT_RISE) {
  const t = THREE.MathUtils.clamp(lift, 0, 1);
  const tilt = ss(t, 0, 0.22) * (1 - ss(t, 0.55, 0.92)) * THREE.MathUtils.degToRad(7.5);
  const rise = ss(t, 0.2, 0.8) * (riseTotal * 0.62) + ss(t, 0.7, 1) * (riseTotal * 0.38);
  // The group's origin is the cover's foot at its centre-back. The clips let
  // go when the foot swings FORWARD, so the body pivots about its top back
  // edge, P = (0, h, -d/2): rotate the origin's offset from P by the tilt and
  // put it back.
  const pivotY = COVER.h;
  const hd = COVER.d / 2;
  cover.rotation.set(-tilt, 0, 0);
  const oy = -pivotY * Math.cos(tilt) + hd * Math.sin(tilt);
  const oz = pivotY * Math.sin(tilt) + hd * Math.cos(tilt);
  cover.position.set(0, COVER_Y + pivotY + oy + rise, COVER_Z - hd + oz);
}
