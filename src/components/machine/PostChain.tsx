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
 *
 * PARKED UNTIL IT HAS BEEN LOOKED AT (issue 75, 19 Sep 2026). None of it had
 * ever reached the screen. postprocessing 6.39.2 failed the multisample
 * resolve of one of its two buffers on every frame (a 32-bit depth store
 * blitted into a 24-bit one, which WebGL refuses, and the refused blit carries
 * the colour too), so the pass written into that buffer was thrown away. Every
 * effect here fed that pass, had been merged into it, or had been zeroed (the
 * aberration, below). The look that was signed off is the plain render. So
 * that is what the page draws: the scene through the composer's multisampled
 * half-float buffer, copied to the screen, pixel for pixel what it showed
 * before (C4-main/_ngpair.mjs), with none of the passes that never showed
 * still being paid for.
 *
 * The chain itself is mended (postprocessing 6.39.5 gives each buffer its own
 * depth texture) and every part is behind `?nglens=`: `all`, or any of
 * `ao,dof,bloom,ca,vig,grain`. As written it is a heavy look (the depth of
 * field softens the housing labels, the grain sits on the white bowls), so it
 * wants tuning by eye before any of it becomes the default.
 */
import * as THREE from "three";
import { Bloom, ChromaticAberration, DepthOfField, EffectComposer, N8AO, Noise, Vignette } from "@react-three/postprocessing";
import { CopyPass } from "postprocessing";
import { useEffect, useMemo, type MutableRefObject } from "react";
import type { Tier } from "@/components/blueprint/quality";
import { QUALITY } from "@/components/blueprint/quality";

export const CA_OFFSET = new THREE.Vector2(0.0005, 0.0003);
export const VIGNETTE_DARKNESS = 0.4;
export const GRAIN_OPACITY = 0.14;
export const BLOOM_INTENSITY = 0.26;

const PARTS = ["ao", "dof", "bloom", "ca", "vig", "grain"] as const;
type LensPart = (typeof PARTS)[number];

/** which parts of the lens are on: `all`, or a list such as `ao,vig`; nothing
 *  by default. Read from `?nglens=` unless the caller says. */
function lensParts(value?: string | null): Set<LensPart> {
  const raw = value !== undefined ? value : typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("nglens");
  if (!raw) return new Set();
  if (raw === "all") return new Set(PARTS);
  return new Set(raw.split(",").filter((p): p is LensPart => (PARTS as readonly string[]).includes(p)));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type Refs = {
  dof?: MutableRefObject<any>;
  vig?: MutableRefObject<any>;
  grain?: MutableRefObject<any>;
  bloom?: MutableRefObject<any>;
  ca?: MutableRefObject<any>;
};

export function PostChain({ tier, refs = {}, focus = [0, 34, 0], lens }: { tier: Tier; refs?: Refs; focus?: [number, number, number]; lens?: string | null }) {
  const Q = QUALITY[tier];
  const on = useMemo(() => lensParts(lens), [lens]);
  // with no part of the lens on, the scene still has to get from the
  // composer's buffer to the screen
  const copy = useMemo(() => (Q.ao ? new CopyPass() : null), [Q.ao]);
  useEffect(() => () => copy?.dispose(), [copy]);
  if (!Q.ao) return null;
  const chain = [
    on.has("ao") ? <N8AO key="ao" aoRadius={8} intensity={1.6} distanceFalloff={1.2} halfRes={Q.aoHalfRes} quality={tier === "high" ? "high" : "low"} /> : null,
    on.has("dof") && Q.dof ? <DepthOfField key="dof" ref={refs.dof as any} target={focus} worldFocusRange={30} bokehScale={1.6} /> : null,
    on.has("bloom") ? <Bloom key="bloom" ref={refs.bloom as any} intensity={BLOOM_INTENSITY} luminanceThreshold={0.92} luminanceSmoothing={0.22} mipmapBlur /> : null,
    // a copy, never the constant: the effect keeps the vector it is given as its
    // uniform, and PostDriver scales that one every frame. Given the constant, the
    // hero's first frame zeroed it for good; the changed value then re-keyed the
    // effect on the next render, which rebuilt it at the END of the chain and so
    // merged the vignette and the grain into the pass in front of it (issue 75)
    on.has("ca") && Q.lens ? <ChromaticAberration key="ca" ref={refs.ca as any} offset={CA_OFFSET.clone()} radialModulation modulationOffset={0.35} /> : null,
    on.has("vig") ? <Vignette key="vig" ref={refs.vig as any} eskil={false} offset={0.3} darkness={VIGNETTE_DARKNESS} /> : null,
    on.has("grain") ? <Noise key="grain" ref={refs.grain as any} premultiply opacity={GRAIN_OPACITY} /> : null,
  ].filter((e): e is JSX.Element => e !== null);
  return (
    <EffectComposer multisampling={tier === "low" ? 0 : 4} enableNormalPass={false}>
      {chain.length > 0 ? chain : [<primitive key="copy" object={copy as CopyPass} />]}
    </EffectComposer>
  );
}
/* eslint-enable @typescript-eslint/no-explicit-any */
