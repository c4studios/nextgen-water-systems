/**
 * COMPILE BEFORE THE FIRST FRAME.
 *
 * On a cold shader cache the scene's first frame compiled every program it
 * drew, one after another, and the main thread waited for each link in turn:
 * one task of 4.6 to 5.3 s on the phone profile and 6.3 to 7.9 s on a desktop
 * (issue 67, C4-main/_ngcompile.mjs). Here every program the scene will draw
 * is handed to the GPU process before the first frame, and the page waits for
 * the links without blocking (KHR_parallel_shader_compile), so they compile
 * side by side in the GPU process while the page stays live. MachineStage
 * holds its frame loop until they are all in.
 *
 * renderer.compile() gets two things wrong for this scene, and either one
 * would compile the program again at the first frame:
 * - The render target. The post chain draws the scene into a target, and a
 *   program built for a target is not the one built for the screen: tone
 *   mapping and the output colour space are program parameters. So the
 *   programs are built with a target bound. The tier without the post chain
 *   draws to the screen, but its transmission pass (the water) draws the scene
 *   into a target too, so that tier builds both.
 * - Local clipping. compile() never sets the clipping state per material, so a
 *   clipped material gets the plane count of whatever was drawn last. So the
 *   meshes compile in batches by clipping kind, each batch straight after a
 *   proxy of that kind has been drawn, which leaves the renderer's clipping
 *   state as the real draw of that kind will set it.
 *
 * Left for the first frame: the shadow map's depth programs, the post chain's
 * own passes and the contact shadow's and the reflector's blurs, all small.
 */
import * as THREE from "three";

/** where the scene's programs will be drawn: the canvas, or a render target */
export type DrawnInto = "screen" | "target";

/** three's program has isReady() (the non-blocking completion query), untyped */
type Linking = THREE.WebGLProgram & { isReady?: () => boolean };

/** a material's clipping kind: how many local planes, and how they combine */
function kindOf(gl: THREE.WebGLRenderer, m: THREE.Material): string {
  const n = gl.localClippingEnabled && m.clippingPlanes ? m.clippingPlanes.length : 0;
  return n === 0 ? "none" : `${n}:${m.clipIntersection ? "and" : "or"}`;
}

/** one degenerate triangle in a plain material of the given clipping kind:
 *  drawing it sets the clipping state and puts nothing on any pixel */
function proxyOf(kind: string): THREE.Mesh {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(9), 3));
  const mat = new THREE.MeshBasicMaterial();
  if (kind !== "none") {
    const [n, how] = kind.split(":");
    mat.clippingPlanes = Array.from({ length: Number(n) }, () => new THREE.Plane(new THREE.Vector3(0, 1, 0), 1e5));
    mat.clipIntersection = how === "and";
  }
  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  return mesh;
}

/** resolves once every program has linked, asking only the question that does not wait */
function linked(gl: THREE.WebGLRenderer, programs: Linking[], limitMs = 20000): Promise<void> {
  const t0 = performance.now();
  const left = new Set(programs);
  return new Promise((resolve) => {
    const poll = () => {
      for (const p of left) if (!p.program || !p.isReady || p.isReady()) left.delete(p);
      if (left.size === 0 || gl.getContext().isContextLost() || performance.now() - t0 > limitMs) resolve();
      else window.setTimeout(poll, 16);
    };
    poll();
  });
}

/** compile every program the scene draws, for each place it is drawn into,
 *  and resolve when all of them have linked */
export async function precompile(gl: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera, into: DrawnInto[]): Promise<void> {
  // every drawable in the scene, grouped by its material's clipping kind; each
  // compiles on its own (the scene's meshes are leaves), so nothing is built
  // under another's kind
  const kinds = new Map<string, THREE.Object3D[]>();
  const materials = new Set<THREE.Material>();
  scene.traverse((o) => {
    const d = o as THREE.Mesh;
    const drawable = d.isMesh || (o as THREE.Points).isPoints || (o as THREE.Line).isLine || (o as THREE.Sprite).isSprite;
    if (!drawable || !d.material) return;
    const mats = Array.isArray(d.material) ? d.material : [d.material];
    for (const m of mats) materials.add(m);
    const kind = kindOf(gl, mats[0]);
    const list = kinds.get(kind);
    if (list) list.push(o);
    else kinds.set(kind, [o]);
  });

  const target = new THREE.WebGLRenderTarget(1, 1);
  const stage = new THREE.Scene();
  const proxies = new Map<string, THREE.Mesh>();
  const was = gl.getRenderTarget();
  // unclipped first: the first standard material compiled converts the
  // environment map (PMREM), and that conversion draws, which resets the
  // clipping state a batch depends on
  const batches = [...kinds].sort(([a], [b]) => (a === "none" ? -1 : b === "none" ? 1 : 0));
  try {
    for (const where of into) {
      for (const [kind, objects] of batches) {
        let proxy = proxies.get(kind);
        if (!proxy) proxies.set(kind, (proxy = proxyOf(kind)));
        stage.add(proxy);
        gl.setRenderTarget(target);
        gl.render(stage, camera);
        stage.remove(proxy);
        gl.setRenderTarget(where === "target" ? target : null);
        for (const o of objects) gl.compile(o, camera, scene);
      }
    }
  } finally {
    gl.setRenderTarget(was);
  }
  // wait on every program the scene's materials hold (both sides of a
  // two-sided transparent material, both places drawn into), not only the ones
  // this call created: a second run finds them all made and still linking
  const programs = new Set<Linking>();
  for (const m of materials) {
    const held = (gl.properties.get(m) as { programs?: Map<string, Linking> }).programs;
    held?.forEach((p) => programs.add(p));
  }
  await linked(gl, [...programs]);
  for (const p of proxies.values()) {
    p.geometry.dispose();
    (p.material as THREE.Material).dispose();
  }
  target.dispose();
}
