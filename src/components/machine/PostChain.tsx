"use client";

/**
 * THE LENS: one chain for the page and for the stills cut from the same
 * scene, so a still never looks like a different camera.
 *
 * Order matters: occlusion first so the lens and the bloom see a grounded
 * image; depth of field on the discussed part; bloom off the brightest metal
 * speculars and the glowing core only; a trace of chromatic aberration at the
 * frame edge; the vignette and the grain of a photograph. On the hero the page
 * is white, so the vignette, the grain and the bloom are driven to nothing
 * there (MachineStage's PostDriver); the stills keep them.
 */
import * as THREE from "three";
import { Bloom, ChromaticAberration, DepthOfField, EffectComposer, N8AO, Noise, Vignette } from "@react-three/postprocessing";
import type { MutableRefObject } from "react";
import type { Tier } from "@/components/blueprint/quality";
import { QUALITY } from "@/components/blueprint/quality";

export const CA_OFFSET = new THREE.Vector2(0.0005, 0.0003);
export const VIGNETTE_DARKNESS = 0.4;
export const GRAIN_OPACITY = 0.14;
export const BLOOM_INTENSITY = 0.26;

/* eslint-disable @typescript-eslint/no-explicit-any */
type Refs = {
  dof?: MutableRefObject<any>;
  vig?: MutableRefObject<any>;
  grain?: MutableRefObject<any>;
  bloom?: MutableRefObject<any>;
  ca?: MutableRefObject<any>;
};

export function PostChain({ tier, refs = {}, focus = [0, 34, 0] }: { tier: Tier; refs?: Refs; focus?: [number, number, number] }) {
  const Q = QUALITY[tier];
  if (!Q.ao) return null;
  return (
    <EffectComposer multisampling={tier === "low" ? 0 : 4} enableNormalPass={false}>
      {[
        <N8AO key="ao" aoRadius={8} intensity={1.6} distanceFalloff={1.2} halfRes={Q.aoHalfRes} quality={tier === "high" ? "high" : "low"} />,
        Q.dof ? <DepthOfField key="dof" ref={refs.dof as any} target={focus} worldFocusRange={30} bokehScale={1.6} /> : null,
        <Bloom key="bloom" ref={refs.bloom as any} intensity={BLOOM_INTENSITY} luminanceThreshold={0.92} luminanceSmoothing={0.22} mipmapBlur />,
        Q.lens ? <ChromaticAberration key="ca" ref={refs.ca as any} offset={CA_OFFSET} radialModulation modulationOffset={0.35} /> : null,
        <Vignette key="vig" ref={refs.vig as any} eskil={false} offset={0.3} darkness={VIGNETTE_DARKNESS} />,
        <Noise key="grain" ref={refs.grain as any} premultiply opacity={GRAIN_OPACITY} />,
      ].filter((e): e is JSX.Element => e !== null)}
    </EffectComposer>
  );
}
/* eslint-enable @typescript-eslint/no-explicit-any */
