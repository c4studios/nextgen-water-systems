"use client";

/**
 * THE STUDIO: a product-photography set, not a void.
 *
 * Behind the machine, a seamless neutral-grey backdrop lit by a pool of light
 * that falls away to the edges of the frame. It is painted in screen space, so
 * no horizon or sweep edge ever swings through the shot as the camera moves; on
 * the hero it goes to the white page and the pool follows the cover.
 *
 * Under the machine, a floor that is only there in what it does: the key
 * light's soft cast shadow (contact-hardening on the high tier, sharp where the
 * frame meets the floor and opening out with distance), a tight contact shadow
 * right under the feet, and on the high tier a faint blurred reflection that
 * fades out before it could show an edge.
 *
 * The lighting is a photographer's: a big soft key high front-left that casts,
 * a dim fill from the right, two hard rims from behind so every housing, pipe
 * and edge separates from the backdrop, and an environment of softboxes and
 * tall strip lights (with dark gaps between them) for the plastics, the powder
 * coat, the brass, the copper and the gauge glass to reflect. Satin plastic
 * only shows its shape in a reflection, so the strips are wide.
 */
import * as THREE from "three";
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, MeshReflectorMaterial, SoftShadows } from "@react-three/drei";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { FLOOR_Y } from "./dims";
import { HERO } from "@/components/blueprint/heroState";

/* area lights need their lookup tables once per page */
let areaReady = false;
function initAreaLights() {
  if (areaReady || typeof window === "undefined") return;
  RectAreaLightUniformsLib.init();
  areaReady = true;
}

/** the clear colour: the mid-tone of the set */
export const STUDIO_BG = "#a3a3a1";

/* The set's three stops, centre of the pool to the frame edge, as LINEAR
   values straight into the frame buffer (the tone mapper runs after). A
   THREE.Color built from a hex is already linear; converting it again is what
   once turned this set a cold slate. The journey's set is neutral and a little
   darker than the page; the hero's is HDR white, so after the tone mapper's
   shoulder it still lands on the page's own white. */
const hex = (h: string) => new THREE.Color(h);
const SET = [hex("#c8c8c6"), hex("#a3a3a1"), hex("#6f6f6e")];
const HERO_SET = [new THREE.Color(12, 12, 12), new THREE.Color(4.2, 4.2, 4.2), new THREE.Color(1.6, 1.6, 1.6)];

function Backdrop() {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    // one triangle covering the whole frame
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
    return g;
  }, []);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        depthWrite: false,
        depthTest: false,
        fog: false,
        toneMapped: true,
        uniforms: {
          uCenter: { value: new THREE.Vector2(0.5, 0.56) },
          uRadii: { value: new THREE.Vector2(0.78, 0.98) },
          uA: { value: SET[0].clone() },
          uB: { value: SET[1].clone() },
          uC: { value: SET[2].clone() },
        },
        vertexShader: `varying vec2 vUv; void main(){ vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 1.0, 1.0); }`,
        fragmentShader: `
          varying vec2 vUv;
          uniform vec2 uCenter;
          uniform vec2 uRadii;
          uniform vec3 uA;
          uniform vec3 uB;
          uniform vec3 uC;
          void main(){
            vec2 q = vec2((vUv.x - uCenter.x) / uRadii.x, (vUv.y - uCenter.y) / uRadii.y);
            float d = clamp(length(q), 0.0, 1.0);
            vec3 col = d < 0.5 ? mix(uA, uB, smoothstep(0.0, 0.5, d)) : mix(uB, uC, smoothstep(0.5, 1.0, d));
            // a whisper of grain so the gradient never bands
            float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
            col += (n - 0.5) * 0.004;
            gl_FragColor = vec4(col, 1.0);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }`,
      }),
    [],
  );
  useFrame(() => {
    const m = HERO.mix;
    const u = mat.uniforms;
    (u.uA.value as THREE.Color).copy(SET[0]).lerp(HERO_SET[0], m);
    (u.uB.value as THREE.Color).copy(SET[1]).lerp(HERO_SET[1], m);
    (u.uC.value as THREE.Color).copy(SET[2]).lerp(HERO_SET[2], m);
    (u.uCenter.value as THREE.Vector2).set(0.5 + (HERO.cx - 0.5) * m, 0.56 + (1 - HERO.cy - 0.56) * m);
    (u.uRadii.value as THREE.Vector2).set(0.78 - 0.1 * m, 0.98 - 0.1 * m);
  });
  return <mesh geometry={geo} material={mat} frustumCulled={false} renderOrder={-1000} />;
}

/** alpha for the reflective floor: solid under the machine, gone well before the frame edge */
function makeFloorFade(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const S = 256;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d");
  if (!g) return null;
  const r = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  r.addColorStop(0, "#ffffff");
  r.addColorStop(0.3, "#9a9a9a");
  r.addColorStop(1, "#000000");
  g.fillStyle = r;
  g.fillRect(0, 0, S, S);
  return new THREE.CanvasTexture(c);
}

export function Studio({ shadows = true, reflect = true, contact = true, soft = false }: { shadows?: boolean; reflect?: boolean; contact?: boolean; soft?: boolean }) {
  const fade = useMemo(() => makeFloorFade(), []);
  useMemo(() => initAreaLights(), []);
  return (
    <>
      {/* contact-hardening shadows: soft where the caster stands off the floor */}
      {soft && shadows && <SoftShadows size={14} samples={16} focus={0.35} />}
      <Backdrop />
      <ambientLight intensity={0.04} />
      {/* THE SOFTBOXES as real area lights: a flat face lit by one falls off
          across its width the way a photographed panel does, and a cylinder
          carries the box as a tall soft highlight. A directional light gives
          neither, which is most of what made the set read as a render. */}
      <rectAreaLight position={[-92, 84, 118]} width={46} height={150} intensity={3.4} color="#fffaf3" onUpdate={(l) => l.lookAt(0, 36, 0)} />
      <rectAreaLight position={[10, 150, 70]} width={130} height={50} intensity={1.5} color="#fbfaf7" onUpdate={(l) => l.lookAt(0, 30, 0)} />
      {/* the key: high, front-left, the one that casts; its frustum hugs the
          machine so each shadow texel is fine */}
      <directionalLight
        position={[-90, 170, 150]}
        intensity={1.9}
        color="#fffaf3"
        castShadow={shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
        shadow-normalBias={0.08}
        shadow-camera-near={120}
        shadow-camera-far={420}
        shadow-camera-left={-62}
        shadow-camera-right={62}
        shadow-camera-top={70}
        shadow-camera-bottom={-52}
      />
      {/* the fill, dim and a touch cool, from the right */}
      <directionalLight position={[150, 60, 80]} intensity={0.34} color="#eef1f4" />
      {/* the rims, from behind and above: a bright edge down every housing,
          along the frame tubes and the copper */}
      <directionalLight position={[110, 120, -170]} intensity={2.6} color="#ffffff" />
      <directionalLight position={[-150, 90, -120]} intensity={1.7} color="#f4f6f8" />
      <Environment resolution={512} frames={1} environmentIntensity={1}>
        {/* the overhead softbox: the broad sheen on the lid, the plate and the heads */}
        <Lightformer form="rect" position={[0, 170, 30]} rotation-x={-Math.PI / 2} scale={[200, 120, 1]} intensity={1.1} color="#fbf8f2" />
        {/* the key softbox, front-left */}
        <Lightformer form="rect" position={[-120, 70, 160]} target={[0, 35, 0]} scale={[64, 190, 1]} intensity={4.6} color="#fdfbf7" />
        {/* a big, dim wash behind the camera, so the flat faces carry a gradient and not a flat grey */}
        <Lightformer form="rect" position={[40, 110, 240]} target={[0, 30, 0]} scale={[260, 110, 1]} intensity={0.55} color="#f7f7f5" />
        {/* a narrow, bright strip in front, high: a line of light along every bend of the cover */}
        <Lightformer form="rect" position={[0, 150, 170]} target={[0, 40, 0]} scale={[220, 7, 1]} intensity={6} color="#ffffff" />
        {/* the fill card, right */}
        <Lightformer form="rect" position={[170, 40, 70]} target={[0, 35, 0]} scale={[90, 140, 1]} intensity={0.7} color="#eef1f4" />
        {/* two tall strips behind, left and right: the long highlights down the bowls */}
        <Lightformer form="rect" position={[-160, 50, -110]} target={[0, 40, 0]} scale={[34, 220, 1]} intensity={4.5} color="#ffffff" />
        <Lightformer form="rect" position={[160, 50, -110]} target={[0, 40, 0]} scale={[34, 220, 1]} intensity={3.8} color="#ffffff" />
        {/* a low strip on the left, for a second, lower highlight on the curves */}
        <Lightformer form="rect" position={[-170, 10, 20]} target={[0, 30, 0]} scale={[16, 120, 1]} intensity={1.6} color="#ffffff" />
        {/* the floor bounce, dim */}
        <Lightformer form="rect" position={[0, -70, 60]} rotation-x={Math.PI / 2} scale={[180, 100, 1]} intensity={0.2} color="#cfcfcd" />
      </Environment>

      {/* the key light's cast shadow */}
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, FLOOR_Y - 0.02, 10]}>
        <planeGeometry args={[520, 380]} />
        <shadowMaterial color="#0c0d0e" transparent opacity={0.34} />
      </mesh>
      {/* the tight contact shadow right under the feet and the bowls */}
      {contact && <ContactShadows position={[0, FLOOR_Y + 0.05, 3]} scale={130} resolution={1024} far={9} blur={1.6} opacity={0.62} color="#0b0c0d" frames={Infinity} />}
      {/* a faint blurred reflection, faded out long before any edge could show */}
      {reflect && fade && (
        <mesh rotation-x={-Math.PI / 2} position={[0, FLOOR_Y + 0.01, 8]} renderOrder={-5}>
          <planeGeometry args={[220, 150]} />
          <MeshReflectorMaterial
            color="#8a8a89"
            blur={[420, 160]}
            resolution={1024}
            mixBlur={1}
            mixStrength={0.6}
            mixContrast={1}
            depthScale={1.1}
            minDepthThreshold={0.7}
            maxDepthThreshold={1.3}
            roughness={1}
            metalness={0}
            mirror={0}
            transparent
            opacity={0.32}
            alphaMap={fade}
            depthWrite={false}
          />
        </mesh>
      )}
    </>
  );
}

/** the renderer settings the studio relies on */
export function configureStudio(gl: THREE.WebGLRenderer, scene: THREE.Scene, shadows = true) {
  gl.toneMapping = THREE.NeutralToneMapping;
  gl.toneMappingExposure = 1;
  gl.setClearColor(STUDIO_BG, 1);
  gl.localClippingEnabled = true;
  gl.shadowMap.enabled = shadows;
  gl.shadowMap.type = THREE.PCFSoftShadowMap;
  scene.fog = new THREE.Fog(STUDIO_BG, 360, 820);
}
