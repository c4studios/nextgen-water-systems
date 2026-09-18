"use client";

/**
 * A viewer for checking the model against the photographs. Development only.
 *
 * ?view=front|iso|back|side|top|s1|s2|s3|gauge|cover|lift
 * ?cut=<half-angle in degrees>  opens every section wedge (?only=<i> just one)
 * ?flow=1                       runs the water
 * ?lift=<0..1>                  lifts the cover
 * ?open=1                       no cover at all
 * ?service=1                    bowls unscrewed and set down, cartridges hanging
 * ?yaw=<radians>                turns the whole machine (the hero's rest pose is -0.3)
 * ?pos=x,y,z&tgt=x,y,z&fov=n    camera overrides for stills
 * ?post=1                       the page's own lens chain (AO, focus, bloom, vignette, grain), for stills
 * ?hero=1                       the hero's palette: the white set, and the lens chain driven to nothing,
 *                               so a still cut here drops straight onto the white page
 *
 * <html data-ngmedia="1"> is set once the cartridge media are drawn; a still
 * of an open section waits for it.
 */
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef } from "react";
import { Machine, createMachineHandle, type MachineHandle } from "./Machine";
import { loadMachineMedia, makeMachineMaterials } from "./materials";
import { PostChain } from "./PostChain";
import { HERO } from "@/components/blueprint/heroState";
import { Studio, configureStudio, STUDIO_BG } from "./Studio";
import { BOWL, CENTRE_Y, COVER, FRAME_TOP, HOUSING_X } from "./dims";
import { coverPose } from "./coverLift";

const VIEWS: Record<string, { pos: [number, number, number]; tgt: [number, number, number]; fov?: number }> = {
  front: { pos: [0, 40, 165], tgt: [0, 35, 0] },
  iso: { pos: [-105, 78, 140], tgt: [0, 33, 0] },
  back: { pos: [80, 60, -150], tgt: [0, 33, 0] },
  side: { pos: [170, 36, 0], tgt: [0, 34, 0] },
  top: { pos: [0, 175, 40], tgt: [0, 40, 0] },
  s1: { pos: [HOUSING_X[0] - 6, 34, 46], tgt: [HOUSING_X[0], 30, 0], fov: 34 },
  s2: { pos: [HOUSING_X[1] - 6, 34, 46], tgt: [HOUSING_X[1], 30, 0], fov: 34 },
  s3: { pos: [HOUSING_X[2] - 6, 34, 46], tgt: [HOUSING_X[2], 30, 0], fov: 34 },
  gauge: { pos: [-16, 74, 34], tgt: [-11.5, 69, 0], fov: 30 },
  cover: { pos: [-70, 62, 150], tgt: [0, 36, 0] },
  lift: { pos: [-60, 60, 175], tgt: [0, 48, 0] },
  lock: { pos: [0, 57, 62], tgt: [0, 56, 0], fov: 30 },
  hero: { pos: [0, 41, 139], tgt: [0, 37, 0], fov: 36 }, // the page fits the cover to 82% of its anchor box
};

/** the hero's own palette, for a still that lands on the white page */
function HeroPalette({ refs }: { refs: { vig: React.MutableRefObject<unknown>; grain: React.MutableRefObject<unknown>; bloom: React.MutableRefObject<unknown> } }) {
  useFrame(() => {
    HERO.mix = 1;
    HERO.cx = 0.5;
    HERO.cy = 0.5;
    const vig = refs.vig.current as { darkness?: number } | null;
    if (vig && "darkness" in vig) vig.darkness = 0;
    const grain = refs.grain.current as { blendMode?: { opacity?: { value: number } } } | null;
    if (grain?.blendMode?.opacity) grain.blendMode.opacity.value = 0;
    const bloom = refs.bloom.current as { intensity?: number } | null;
    if (bloom && "intensity" in bloom) bloom.intensity = 0;
  });
  return null;
}

function Driver({ h, params }: { h: MachineHandle; params: URLSearchParams }) {
  const { camera } = useThree();
  const cut = Number(params.get("cut") ?? 0);
  const flow = Number(params.get("flow") ?? 0);
  const lift = Number(params.get("lift") ?? 0);
  const service = params.get("service") === "1";
  const named = VIEWS[params.get("view") ?? "iso"] ?? VIEWS.iso;
  // ?pos=x,y,z&tgt=x,y,z&fov=n override the named view (the stills use this)
  const vec = (k: string, d: [number, number, number]): [number, number, number] => {
    const raw = params.get(k);
    if (!raw) return d;
    const v = raw.split(",").map(Number);
    return v.length === 3 && v.every((n) => Number.isFinite(n)) ? [v[0], v[1], v[2]] : d;
  };
  const view = { pos: vec("pos", named.pos), tgt: vec("tgt", named.tgt), fov: Number(params.get("fov")) || named.fov };
  useEffect(() => {
    camera.position.set(...view.pos);
    camera.lookAt(...view.tgt);
    (camera as THREE.PerspectiveCamera).fov = view.fov ?? 38;
    camera.updateProjectionMatrix();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera, view.pos.join(), view.tgt.join(), view.fov]);
  // ?only=<0|1|2> confines the cut and the water to that one housing
  const only = params.has("only") ? Number(params.get("only")) : -1;
  useFrame(() => {
    for (let i = 0; i < 3; i++) {
      const on = only < 0 || only === i;
      h.cut[i] = on ? (cut * Math.PI) / 180 : 0;
      h.flow[i] = on ? flow : 0;
    }
    if (h.cover) coverPose(h.cover, lift);
    if (service) {
      for (let i = 0; i < 3; i++) {
        const b = h.bowls[i];
        const c = h.cartridges[i];
        if (b) {
          b.position.y = -(BOWL.bottom - 0.02) - 12 * (i === 1 ? 1 : 0.6);
          b.rotation.y = 0.35 * (i + 1);
        }
        if (c) c.position.y = 0;
      }
    }
    if (h.runs) h.runs.visible = params.get("runs") !== "0";
  });
  return (
    <OrbitControls
      target={new THREE.Vector3(...view.tgt)}
      enableDamping
      makeDefault
    />
  );
}

export function MachineDev() {
  const params = useMemo(() => new URLSearchParams(typeof window === "undefined" ? "" : window.location.search), []);
  const h = useMemo(() => createMachineHandle(), []);
  const mats = useMemo(() => makeMachineMaterials(1), []);
  const covered = params.get("open") !== "1";
  const ao = params.get("ao") !== "0";
  const post = params.get("post") === "1";
  const heroSet = params.get("hero") === "1";
  const vig = useRef<unknown>(null);
  const grain = useRef<unknown>(null);
  const bloom = useRef<unknown>(null);
  const ready = useRef(false);
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__mh = h;
    void loadMachineMedia(mats, 1024);
  }, [h, mats]);
  const focus = useMemo(() => {
    const raw = params.get("tgt");
    const v = raw ? raw.split(",").map(Number) : null;
    const named = VIEWS[params.get("view") ?? "iso"] ?? VIEWS.iso;
    return (v && v.length === 3 && v.every((n) => Number.isFinite(n)) ? v : named.tgt) as [number, number, number];
  }, [params]);
  return (
    <div style={{ position: "fixed", inset: 0, background: heroSet ? "#ffffff" : STUDIO_BG }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [-105, 78, 140], fov: 38, near: 2, far: 900 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl, scene }) => {
          configureStudio(gl, scene, true);
          ready.current = true;
          document.documentElement.dataset.mdev = "1";
        }}
      >
        <Studio soft />
        <group rotation-y={Number(params.get("yaw") ?? 0)}>
          <Machine mats={mats} handle={h} covered={covered} />
        </group>
        <Driver h={h} params={params} />
        {heroSet && <HeroPalette refs={{ vig, grain, bloom }} />}
        {post ? (
          <PostChain tier="high" focus={focus} refs={{ vig: vig as never, grain: grain as never, bloom: bloom as never }} />
        ) : (
          ao && (
            <EffectComposer multisampling={4}>
              <N8AO aoRadius={9} intensity={1.6} distanceFalloff={1.2} quality="high" />
            </EffectComposer>
          )
        )}
      </Canvas>
      <div style={{ position: "fixed", left: 12, bottom: 10, font: "12px monospace", color: "#555" }}>
        {`FHWR-3S1-20 · ${FRAME_TOP} / ${COVER.h} cm · centre ${CENTRE_Y}`}
      </div>
    </div>
  );
}
