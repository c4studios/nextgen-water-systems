/**
 * Draughting linework for the NGW-01 plate, drawn into a 1200 x 900 viewBox.
 *
 * Depicts the real machine (the manufacturer's FHWR-3S1-20 series, sold as
 * Next Gen): three full-size housings nearly touching, hung from a top plate on
 * a steel frame, plumbed in series, two gauges on the plate. Authored in
 * draughtsperson order so the scroll-driven stroke-dashoffset trace reads like
 * the drawing is being made by hand.
 *
 * Every coordinate is DERIVED from machineGeometry (the same numbers the 3D
 * model is built from) through the dock camera's projection, so the ink
 * registers to the render by construction rather than by eye. Change the
 * machine there, and this drawing follows.
 *
 * The one dimension is the manufacturer's overall width, 590 mm.
 */
import {
  V_X,
  HEAD_R,
  HEAD_TOP,
  HEAD_BOT,
  SUMP_R,
  SUMP_FOOT,
  CART_R,
  CART_Y,
  CART_H,
  FRAME_G,
  PIPE_Y,
  PLATE_K,
  toPlateX,
  plateY,
} from "./machineGeometry";

export type Weight = "centre" | "heavy" | "hair";
export type DrawPath = { id: string; d: string; weight: Weight; order: number };
export type Balloon = { n: string; x: number; y: number };

const r1 = (v: number) => Math.round(v * 10) / 10;

// approximate a circle with a closed poly-bezier so stroke-dashoffset can "draw" it
function arc(cx: number, cy: number, r: number): string {
  const k = 0.5522847498 * r;
  return (
    `M${r1(cx)} ${r1(cy - r)} ` +
    `C${r1(cx + k)} ${r1(cy - r)} ${r1(cx + r)} ${r1(cy - k)} ${r1(cx + r)} ${r1(cy)} ` +
    `C${r1(cx + r)} ${r1(cy + k)} ${r1(cx + k)} ${r1(cy + r)} ${r1(cx)} ${r1(cy + r)} ` +
    `C${r1(cx - k)} ${r1(cy + r)} ${r1(cx - r)} ${r1(cy + k)} ${r1(cx - r)} ${r1(cy)} ` +
    `C${r1(cx - r)} ${r1(cy - k)} ${r1(cx - k)} ${r1(cy - r)} ${r1(cx)} ${r1(cy - r)} Z`
  );
}

export const BOM_ROWS = [
  ["1", "SEDIMENT, 3 LAYERS", "TO 1 µm"],
  ["2", "KDF 55/85 + COCONUT CARBON", "HEAVY METALS · CHLORINE"],
  ["3", "LIMESCALE + COCONUT CARBON", "SCALE · TASTE · TO 1 µm"],
];

export const REVISIONS = [
  { rev: "A", desc: "GENERAL ARRANGEMENT", at: 0.3 },
  { rev: "B", desc: "BILL OF MATERIALS", at: 0.56 },
  { rev: "C", desc: "SECTIONS A–A, B–B, C–C", at: 0.82 },
];

/* ---- the layout, in plate units, from the machine ---- */
export const VESSEL_CX = V_X.map((x) => r1(toPlateX(x))) as unknown as readonly [number, number, number];
const HW2 = r1(HEAD_R * PLATE_K);
const SW2 = r1(SUMP_R * PLATE_K);
const Y_HEAD_TOP = r1(plateY(HEAD_TOP));
const Y_HEAD_BOT = r1(plateY(HEAD_BOT));
const Y_SUMP_BOT = r1(plateY(SUMP_FOOT));
const Y_CART_TOP = r1(plateY(CART_Y + CART_H / 2));
const Y_CART_BOT = r1(plateY(CART_Y - CART_H / 2));
const CART_W2 = r1(CART_R * PLATE_K);
const FOOT_R = r1(0.22 * PLATE_K);
const X_POST_L = r1(toPlateX(-FRAME_G.postX));
const X_POST_R = r1(toPlateX(FRAME_G.postX));
const X_PLATE_L = r1(toPlateX(-FRAME_G.plateW / 2));
const X_PLATE_R = r1(toPlateX(FRAME_G.plateW / 2));
const Y_PLATE_TOP = r1(plateY(FRAME_G.plateY + 0.07));
const Y_PLATE_BOT = r1(plateY(FRAME_G.plateY - 0.07));
const Y_BASE = r1(plateY(FRAME_G.baseY));
const Y_PIPE = r1(plateY(PIPE_Y));
const PIPE_W2 = r1(0.11 * PLATE_K);
const GAUGE_R = r1(0.165 * PLATE_K);
const Y_GAUGE = r1(plateY(FRAME_G.plateY + 0.36));
const X_MAINS = r1(toPlateX(-3.25));
const X_HOUSE = r1(toPlateX(3.05));
const Y_DIM = r1(Y_BASE + 30);

/** exported for the plate furniture drawn in LivingDrawing */
export const PLATE_LAYOUT = {
  headTop: Y_HEAD_TOP,
  sumpBot: Y_SUMP_BOT,
  cartTop: Y_CART_TOP,
  cartBot: Y_CART_BOT,
  cartW2: CART_W2,
  sumpW2: SW2,
  headW2: HW2,
  gaugeY: Y_GAUGE,
  dimY: Y_DIM,
  dimX: r1((X_POST_L + X_POST_R) / 2),
  frameTop: r1(Y_GAUGE - GAUGE_R),
  base: Y_BASE,
  balloonY: r1(Y_SUMP_BOT + 30),
} as const;

/** one vessel silhouette (head + stepped bowl with a rounded foot), closed */
function vesselD(cx: number): string {
  const hl = r1(cx - HW2), hr = r1(cx + HW2);
  const sl = r1(cx - SW2), sr = r1(cx + SW2);
  return (
    `M${hl} ${Y_HEAD_TOP} L${hr} ${Y_HEAD_TOP} L${hr} ${Y_HEAD_BOT} L${sr} ${Y_HEAD_BOT} ` +
    `L${sr} ${r1(Y_SUMP_BOT - FOOT_R)} Q${sr} ${Y_SUMP_BOT} ${r1(sr - FOOT_R)} ${Y_SUMP_BOT} ` +
    `L${r1(sl + FOOT_R)} ${Y_SUMP_BOT} Q${sl} ${Y_SUMP_BOT} ${sl} ${r1(Y_SUMP_BOT - FOOT_R)} ` +
    `L${sl} ${Y_HEAD_BOT} L${hl} ${Y_HEAD_BOT} Z`
  );
}

// combined closed silhouettes: the shade fill and the hatch clip
export const ASSEMBLY_D = VESSEL_CX.map(vesselD).join(" ");

// construction geometry laid down before inking (hair)
export const ASSEMBLY_CONSTRUCTION: { id: string; d: string }[] = [
  { id: "bbox", d: `M${X_POST_L} ${PLATE_LAYOUT.frameTop} L${X_POST_R} ${PLATE_LAYOUT.frameTop} L${X_POST_R} ${Y_BASE} L${X_POST_L} ${Y_BASE} Z` },
  { id: "centrelines", d: VESSEL_CX.map((cx) => `M${cx} ${r1(Y_HEAD_TOP - 60)} L${cx} ${r1(Y_BASE + 20)}`).join(" ") },
  { id: "datum-top", d: `M${r1(X_POST_L - 40)} ${Y_HEAD_TOP} L${r1(X_POST_R + 40)} ${Y_HEAD_TOP}` },
  { id: "datum-bot", d: `M${r1(X_POST_L - 40)} ${Y_SUMP_BOT} L${r1(X_POST_R + 40)} ${Y_SUMP_BOT}` },
  { id: "circ-heads", d: VESSEL_CX.map((cx) => arc(cx, (Y_HEAD_TOP + Y_HEAD_BOT) / 2, HW2 * 0.62)).join(" ") },
];

// ink, in draughtsperson order: centrelines, frame, vessels, pipework, gauges, zones, dimension
export const ASSEMBLY_PATHS: DrawPath[] = [
  {
    id: "centrelines",
    weight: "centre",
    order: 0,
    d: VESSEL_CX.map((cx) => `M${cx} ${r1(Y_HEAD_TOP - 44)} L${cx} ${r1(Y_SUMP_BOT + 14)}`).join(" "),
  },
  {
    // the frame: top plate, two posts, base rail (the part the cover clips over)
    id: "frame",
    weight: "hair",
    order: 1,
    d:
      `M${X_PLATE_L} ${Y_PLATE_TOP} L${X_PLATE_R} ${Y_PLATE_TOP} L${X_PLATE_R} ${Y_PLATE_BOT} L${X_PLATE_L} ${Y_PLATE_BOT} Z ` +
      `M${X_POST_L} ${Y_PLATE_BOT} L${X_POST_L} ${Y_BASE} M${X_POST_R} ${Y_PLATE_BOT} L${X_POST_R} ${Y_BASE} ` +
      `M${r1(X_POST_L - 6)} ${Y_BASE} L${r1(X_POST_R + 6)} ${Y_BASE}`,
  },
  { id: "vessel-1", weight: "heavy", order: 2, d: vesselD(VESSEL_CX[0]) },
  { id: "vessel-2", weight: "heavy", order: 3, d: vesselD(VESSEL_CX[1]) },
  { id: "vessel-3", weight: "heavy", order: 4, d: vesselD(VESSEL_CX[2]) },
  {
    // series pipework: mains in, and out to the house (drawn as pipe walls)
    id: "pipework",
    weight: "heavy",
    order: 5,
    d:
      `M${X_MAINS} ${r1(Y_PIPE - PIPE_W2)} L${r1(VESSEL_CX[0] - HW2)} ${r1(Y_PIPE - PIPE_W2)} ` +
      `M${X_MAINS} ${r1(Y_PIPE + PIPE_W2)} L${r1(VESSEL_CX[0] - HW2)} ${r1(Y_PIPE + PIPE_W2)} ` +
      `M${r1(VESSEL_CX[2] + HW2)} ${r1(Y_PIPE - PIPE_W2)} L${X_HOUSE} ${r1(Y_PIPE - PIPE_W2)} ` +
      `M${r1(VESSEL_CX[2] + HW2)} ${r1(Y_PIPE + PIPE_W2)} L${X_HOUSE} ${r1(Y_PIPE + PIPE_W2)}`,
  },
  {
    // flow arrows on the runs
    id: "flow",
    weight: "hair",
    order: 6,
    d: (() => {
      const a = r1((X_MAINS + VESSEL_CX[0] - HW2) / 2);
      const b = r1((VESSEL_CX[2] + HW2 + X_HOUSE) / 2);
      return (
        `M${r1(a - 12)} ${Y_PIPE} L${r1(a + 12)} ${Y_PIPE} M${r1(a + 6)} ${r1(Y_PIPE - 6)} L${r1(a + 12)} ${Y_PIPE} L${r1(a + 6)} ${r1(Y_PIPE + 6)} ` +
        `M${r1(b - 12)} ${Y_PIPE} L${r1(b + 12)} ${Y_PIPE} M${r1(b + 6)} ${r1(Y_PIPE - 6)} L${r1(b + 12)} ${Y_PIPE} L${r1(b + 6)} ${r1(Y_PIPE + 6)}`
      );
    })(),
  },
  {
    // the two gauges on the plate, above stages 1 and 3, on their stems
    id: "gauges",
    weight: "hair",
    order: 7,
    d: [VESSEL_CX[0], VESSEL_CX[2]]
      .map((cx) => `${arc(cx, Y_GAUGE, GAUGE_R)} M${cx} ${r1(Y_GAUGE + GAUGE_R)} L${cx} ${Y_PLATE_TOP}`)
      .join(" "),
  },
  {
    // cartridge-zone boundaries inside each bowl
    id: "cartzones",
    weight: "hair",
    order: 8,
    d: VESSEL_CX.map((cx) => `M${r1(cx - CART_W2)} ${Y_CART_TOP} L${r1(cx + CART_W2)} ${Y_CART_TOP} M${r1(cx - CART_W2)} ${Y_CART_BOT} L${r1(cx + CART_W2)} ${Y_CART_BOT}`).join(" "),
  },
  {
    // overall width, post to post (the one active dimension)
    id: "dim-width",
    weight: "hair",
    order: 9,
    d:
      `M${X_POST_L} ${r1(Y_BASE + 8)} L${X_POST_L} ${r1(Y_DIM + 10)} M${X_POST_R} ${r1(Y_BASE + 8)} L${X_POST_R} ${r1(Y_DIM + 10)} ` +
      `M${X_POST_L} ${Y_DIM} L${X_POST_R} ${Y_DIM} ` +
      `M${r1(X_POST_L + 14)} ${r1(Y_DIM - 6)} L${X_POST_L} ${Y_DIM} L${r1(X_POST_L + 14)} ${r1(Y_DIM + 6)} ` +
      `M${r1(X_POST_R - 14)} ${r1(Y_DIM - 6)} L${X_POST_R} ${Y_DIM} L${r1(X_POST_R - 14)} ${r1(Y_DIM + 6)}`,
  },
];

// per-vessel cartridge hatch zones (the assembly's "beds")
export type VesselBed = { id: string; x0: number; y0: number; x1: number; y1: number; hatch: string };
const BED_IDS = [
  ["sediment", "h-stipple"],
  ["kdf-carbon", "h-dots"],
  ["limescale-carbon", "h-vert"],
] as const;
export const VESSEL_BEDS: VesselBed[] = VESSEL_CX.map((cx, i) => ({
  id: BED_IDS[i][0],
  x0: r1(cx - CART_W2),
  y0: Y_CART_TOP,
  x1: r1(cx + CART_W2),
  y1: Y_CART_BOT,
  hatch: BED_IDS[i][1],
}));

// BOM balloons below each bowl, leaders rising to the foot (the plate's note
// owns the top left, so balloons above the heads would sit on it)
export const ASSEMBLY_BALLOONS: Balloon[] = VESSEL_CX.map((cx, i) => ({ n: String(i + 1), x: cx, y: PLATE_LAYOUT.balloonY }));
