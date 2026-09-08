/**
 * QUALITY TIER — one decision, made once, that every expensive thing in the
 * scene consults.
 *
 * The scene ran at full weight on every device: dpr up to 2, depth of field,
 * every effect pass, on a phone GPU. With the realism upgrade (normal maps on
 * every surface, ambient occlusion, refracting glass, decals) that would not
 * just be slow on a handset, it would be a slideshow. So the tier is read from
 * the device rather than assumed, and the settings below are what each tier
 * actually gets. A phone gets a scene that still looks like the machine; it
 * does not get the film lens.
 *
 * `?ngtier=low|medium|high` overrides it, same convention as the other dev aids
 * (?nghide, ?ngjp), so a tier can be checked on a desktop without a phone.
 */
export type Tier = "high" | "medium" | "low";

export function detectTier(): Tier {
  if (typeof window === "undefined") return "high";
  const forced = new URLSearchParams(window.location.search).get("ngtier");
  if (forced === "low" || forced === "medium" || forced === "high") return forced;

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 4;
  const mem = nav.deviceMemory ?? 4;
  const shortSide = Math.min(window.screen.width, window.screen.height);

  // Weak handset: old iPhone SE class, budget Android. Cores/memory are the
  // honest signals; screen size alone would misfile a flagship phone.
  if (coarse && (cores <= 4 || mem <= 3)) return "low";
  // Any touch device, small screen, or a thin laptop: the middle setting.
  if (coarse || shortSide < 900 || cores <= 4) return "medium";
  return "high";
}

export type Quality = {
  /** device pixel ratio range handed to the Canvas */
  dpr: [number, number];
  /** N8AO screen-space ambient occlusion */
  ao: boolean;
  /** half-resolution AO buffer (mobile) */
  aoHalfRes: boolean;
  /** depth of field pass */
  dof: boolean;
  /** chromatic aberration + the rest of the lens chain */
  lens: boolean;
  /** MeshTransmissionMaterial on the gauge lenses (renders a transmission
   *  buffer per lens; cheap physical glass otherwise) */
  glass: boolean;
  /** imperfection decals: smudge, scratch, condensation */
  decals: boolean;
  /** how many condensation beads to draw */
  droplets: number;
  /** normal-map intensity multiplier: full on desktop, eased on phones where
   *  the finer relief aliases on a small screen anyway */
  relief: number;
  /** geometric extras: thread ridges, hex nuts, weld beads */
  hardware: boolean;
};

export const QUALITY: Record<Tier, Quality> = {
  high: {
    dpr: [1, 2],
    ao: true,
    aoHalfRes: false,
    dof: true,
    lens: true,
    glass: true,
    decals: true,
    droplets: 130,
    relief: 1,
    hardware: true,
  },
  medium: {
    dpr: [1, 1.5],
    ao: true,
    aoHalfRes: true,
    dof: false,
    lens: true,
    glass: false,
    decals: true,
    droplets: 70,
    relief: 0.8,
    hardware: true,
  },
  low: {
    dpr: [1, 1],
    ao: false,
    aoHalfRes: true,
    dof: false,
    lens: false,
    glass: false,
    decals: false,
    droplets: 0,
    relief: 0.6,
    hardware: false,
  },
};
