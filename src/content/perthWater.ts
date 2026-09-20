/**
 * HOW HARD PERTH'S WATER IS, AREA BY AREA.
 *
 * Transcribed from Water Corporation, Drinking Water Quality Annual Report
 * 2024-25, Appendix C, Table 4 "Aesthetic (non-health related) variables",
 * Perth Region, samples taken 1 July 2024 to 30 June 2025. Hardness as
 * calcium carbonate, mg/L: the lowest and highest sample and the mean. The
 * areas are Water Corporation's water-quality localities, not suburbs (the
 * report's Appendix B maps them). See docs/research/perth-water-sources.md.
 *
 * Do not round, re-sort into a claim, or extend this table from anywhere but
 * the next annual report.
 */
export type HardnessRow = { area: string; samples: number; min: number; max: number; mean: number; note?: string };

export const HARDNESS_SOURCE = {
  title: "Drinking Water Quality Annual Report 2024-25",
  publisher: "Water Corporation",
  table: "Appendix C, Table 4, Perth Region",
  period: "1 July 2024 to 30 June 2025",
  url: "https://pw-cdn.watercorporation.com.au/-/media/watercorp/documents/about-us/our-performance/drinking-water-quality/drinking-water-quality-annual-report-2024-25.pdf",
  tablesUrl:
    "https://pw-cdn.watercorporation.com.au/-/media/watercorp/documents/about-us/our-performance/drinking-water-quality/dwq-annual-report-perth-aesthetic-tables.pdf",
} as const;

export const PERTH_HARDNESS: HardnessRow[] = [
  { area: "Armadale/Kelmscott", samples: 2, min: 73, max: 77, mean: 75 },
  { area: "Bold Park", samples: 2, min: 45, max: 53, mean: 49 },
  { area: "Buckland Hill", samples: 4, min: 50, max: 73, mean: 63 },
  { area: "Dwellingup", samples: 2, min: 27, max: 31, mean: 29 },
  { area: "Foothills", samples: 2, min: 71, max: 78, mean: 75 },
  { area: "Greenmount", samples: 5, min: 86, max: 100, mean: 95 },
  { area: "Greenmount/Darlington", samples: 2, min: 69, max: 85, mean: 77 },
  { area: "Hamilton Hill", samples: 2, min: 43, max: 69, mean: 56 },
  { area: "Hills Direct", samples: 4, min: 44, max: 53, mean: 48 },
  { area: "Lexia", samples: 2, min: 76, max: 160, mean: 118 },
  { area: "Mandurah", samples: 4, min: 46, max: 52, mean: 50 },
  { area: "Melville", samples: 5, min: 46, max: 63, mean: 54 },
  { area: "Mirrabooka", samples: 5, min: 120, max: 130, mean: 124 },
  { area: "Mt. Eliza", samples: 4, min: 42, max: 70, mean: 57 },
  { area: "Mt. Hawthorn", samples: 5, min: 99, max: 110, mean: 106 },
  { area: "Mt. Yokine", samples: 4, min: 100, max: 110, mean: 108 },
  { area: "Mundaring", samples: 2, min: 97, max: 99, mean: 98 },
  { area: "Neerabup", samples: 4, min: 180, max: 200, mean: 190 },
  { area: "North Dandalup", samples: 2, min: 39, max: 45, mean: 42 },
  { area: "Pinjarra", samples: 2, min: 38, max: 53, mean: 46 },
  { area: "South Perth/Kewdale", samples: 4, min: 80, max: 110, mean: 94 },
  { area: "Tamworth Hill", samples: 2, min: 47, max: 47, mean: 47 },
  { area: "Thomsons Lake", samples: 4, min: 71, max: 96, mean: 89 },
  {
    area: "Two Rocks",
    samples: 4,
    min: 220,
    max: 240,
    mean: 228,
    note: "Water Corporation: “Elevated hardness is characteristic of the source supplying this locality.”",
  },
  { area: "Wanneroo", samples: 4, min: 110, max: 150, mean: 125 },
  { area: "West Yokine", samples: 4, min: 120, max: 130, mean: 123 },
  { area: "Whitfords", samples: 3, min: 88, max: 140, mean: 113 },
  { area: "Yanchep", samples: 4, min: 190, max: 210, mean: 198 },
];

/** The ADWG's degrees of hardness, as the annual report tabulates them (AR
 *  Table 1), and its aesthetic guideline value. */
export const HARDNESS_BANDS = [
  { upTo: 60, label: "Soft and possibly corrosive" },
  { upTo: 200, label: "Good quality for all domestic uses" },
  { upTo: 500, label: "Will increase scale formation" },
] as const;
export const HARDNESS_GUIDELINE = 200;
