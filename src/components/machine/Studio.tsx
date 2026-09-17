"use client";

/**
 * THE WHITE STUDIO.
 *
 * A product-photography set: a pale seamless floor, a large soft key from
 * high front-left, a fill from the right, and an in-scene environment of
 * softbox panels baked once on the first frame (no HDR to fetch). The key
 * casts a real shadow (PCF; VSM lost depth precision across the floor and
 * left a dotted band), so the housings shade each other and the cover seats
 * on the floor instead of floating.
 */
import * as THREE from "three";
import { Environment, Lightformer } from "@react-three/drei";
import { FLOOR_Y } from "./dims";

export const STUDIO_BG = "#f2f3f3";

export function Studio({ shadows = true }: { shadows?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.22} />
      <directionalLight
        position={[-70, 150, 120]}
        intensity={1.9}
        color="#fbfbfa"
        castShadow={shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0003}
        shadow-normalBias={0.16}
        shadow-radius={9}
        shadow-blurSamples={12}
        shadow-camera-near={40}
        shadow-camera-far={420}
        shadow-camera-left={-90}
        shadow-camera-right={90}
        shadow-camera-top={110}
        shadow-camera-bottom={-40}
      />
      <directionalLight position={[110, 60, 40]} intensity={0.45} color="#eef1f3" />
      <directionalLight position={[0, 40, -120]} intensity={0.3} color="#e9ecee" />
      <Environment resolution={256} frames={1} environmentIntensity={0.95}>
        {/* a big soft key panel, front-left and high */}
        <Lightformer form="rect" position={[-60, 90, 80]} rotation-y={Math.PI / 5} rotation-x={-Math.PI / 6} scale={[120, 80, 1]} intensity={3.2} color="#f7f9fb" />
        {/* a cooler, dimmer fill from the right */}
        <Lightformer form="rect" position={[90, 40, 30]} rotation-y={-Math.PI / 2.3} scale={[60, 90, 1]} intensity={1.2} color="#eef2f5" />
        {/* the top light, warm and wide, for the lid and the plate */}
        <Lightformer form="rect" position={[0, 140, 10]} rotation-x={-Math.PI / 2} scale={[160, 100, 1]} intensity={2.4} color="#fdf7ee" />
        {/* the floor bounce */}
        <Lightformer form="rect" position={[0, -60, 40]} rotation-x={Math.PI / 2} scale={[140, 80, 1]} intensity={0.9} color="#d9dcde" />
        {/* the backdrop and the camera side, so the metals have something to reflect */}
        <Lightformer form="rect" position={[0, 40, -140]} scale={[220, 140, 1]} intensity={0.55} color="#b9bdc0" />
        <Lightformer form="rect" position={[0, 30, 160]} rotation-y={Math.PI} scale={[200, 120, 1]} intensity={0.35} color="#8f9396" />
        {/* a bright narrow strip high in front: the line of light along the cover's top chamfer and the notch edges */}
        <Lightformer form="rect" position={[0, 118, 96]} rotation-x={-Math.PI / 3.2} scale={[170, 5, 1]} intensity={7} color="#ffffff" />
        {/* a narrow strip low on the left to give the bowls a second highlight */}
        <Lightformer form="rect" position={[-120, 20, 0]} rotation-y={Math.PI / 2} scale={[8, 100, 1]} intensity={2.2} color="#ffffff" />
      </Environment>
      {/* the seamless floor: only its shadows are drawn, so it is the clear
          colour to the horizon with no seam */}
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, FLOOR_Y - 0.02, 0]}>
        <planeGeometry args={[1200, 1200]} />
        <shadowMaterial color="#0d1114" transparent opacity={0.3} />
      </mesh>
    </>
  );
}

/** the renderer settings the studio relies on */
export function configureStudio(gl: THREE.WebGLRenderer, scene: THREE.Scene, shadows = true) {
  gl.toneMapping = THREE.NeutralToneMapping;
  gl.toneMappingExposure = 1.0;
  gl.setClearColor(STUDIO_BG, 1);
  gl.localClippingEnabled = true;
  gl.shadowMap.enabled = shadows;
  gl.shadowMap.type = THREE.PCFSoftShadowMap;
  scene.fog = new THREE.Fog(STUDIO_BG, 260, 620);
}
