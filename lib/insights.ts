import type { Segment } from "./personas";
import { SEGMENTS } from "./personas";
import type { Again, Bubbles, Tasting } from "./tasting";
import { WINES, WINE_IDS, realSweetness } from "./wines";
import type { Aroma, WineId } from "./wines";

export interface Row {
  month: number;
  segment: Segment;
  wine: WineId;
  sweet: number;
  bubbles: Bubbles;
  aroma: Aroma;
  again: Again;
}

export const MONTHS = 12;
const CURRENT = MONTHS - 1;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T extends string>(rand: () => number, weights: Partial<Record<T, number>>): T {
  const entries = Object.entries(weights) as [T, number][];
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = rand() * total;
  for (const [k, w] of entries) {
    r -= w;
    if (r <= 0) return k;
  }
  return entries[entries.length - 1][0];
}

function gauss(rand: () => number) {
  return Math.sqrt(-2 * Math.log(rand() || 1e-9)) * Math.cos(2 * Math.PI * rand());
}

const SEGMENT_WEIGHTS: Record<Segment, number> = {
  "18-24": 16,
  "25-34": 27,
  "35-49": 25,
  "50-64": 19,
  "65+": 13,
};

const WINE_WEIGHTS: Record<Segment, Partial<Record<WineId, number>>> = {
  "18-24": { ice: 30, medea: 18, frizzante: 12, bio: 8, soe: 8, chardonnay: 6, valdobbiadene: 4, audace: 3 },
  "25-34": { medea: 22, bio: 16, soe: 12, frizzante: 12, ice: 10, valdobbiadene: 10, audace: 8, chardonnay: 6, zero: 6 },
  "35-49": { medea: 18, valdobbiadene: 18, frizzante: 16, audace: 12, bio: 10, chardonnay: 10, soe: 6, zero: 6, ice: 4 },
  "50-64": { valdobbiadene: 26, audace: 20, medea: 14, chardonnay: 12, frizzante: 10, bio: 8, soe: 6, zero: 3, ice: 1 },
  "65+": { valdobbiadene: 34, medea: 20, frizzante: 18, chardonnay: 12, audace: 8, bio: 5, ice: 2, zero: 1 },
};

// Illustrative perception biases: younger guests read Extra Dry styles as sweeter,
// and everyone underestimates the sugar in the alcohol-free wine.
function bias(segment: Segment, wine: WineId) {
  const young = segment === "18-24" ? 1 : segment === "25-34" ? 0.75 : segment === "35-49" ? 0.3 : 0.1;
  switch (wine) {
    case "medea":
    case "frizzante":
    case "chardonnay":
      return 0.85 * young;
    case "zero":
      return -1.1;
    case "ice":
      return -0.35;
    default:
      return 0.1 * young;
  }
}

const AGAIN_YES: Record<WineId, number> = {
  audace: 0.78,
  valdobbiadene: 0.74,
  medea: 0.7,
  soe: 0.66,
  bio: 0.64,
  frizzante: 0.62,
  ice: 0.6,
  zero: 0.58,
  chardonnay: 0.55,
};

function buildBaseline(): Row[] {
  const rand = mulberry32(1881);
  const rows: Row[] = [];
  for (let month = 0; month < MONTHS; month++) {
    const n = 120 + month * 9;
    for (let i = 0; i < n; i++) {
      const segment = pick(rand, SEGMENT_WEIGHTS);
      const weights = { ...WINE_WEIGHTS[segment] };
      if (segment === "18-24") {
        const share = 0.05 + (0.09 * month) / CURRENT + 0.012 * gauss(rand);
        const rest = Object.values(weights).reduce((s, w) => s + (w ?? 0), 0);
        weights.zero = (rest * share) / (1 - share);
      }
      const wine = pick(rand, weights);
      const w = WINES[wine];
      const raw = realSweetness(w) + bias(segment, wine) + 0.55 * gauss(rand);
      const sweet = Math.min(5, Math.max(1, Math.round(raw * 2) / 2));
      const aromaWeights: Partial<Record<Aroma, number>> = { flowers: 0.03, apple: 0.03, yellowFruit: 0.03, mineral: 0.03 };
      w.aromas.forEach((a, k) => (aromaWeights[a] = [0.55, 0.3, 0.15][k]));
      const aroma = pick(rand, aromaWeights);
      const bubbles: Bubbles =
        wine === "frizzante"
          ? pick(rand, { delicate: 70, lively: 25, explosive: 5 })
          : pick(rand, { delicate: 25, lively: 55, explosive: segment === "18-24" ? 35 : 20 });
      const yes = AGAIN_YES[wine] + (segment === "18-24" && (wine === "ice" || wine === "zero") ? 0.12 : 0);
      const r = rand();
      const again: Again = r < yes ? "yes" : r < yes + 0.22 ? "maybe" : "no";
      rows.push({ month, segment, wine, sweet, bubbles, aroma, again });
    }
  }
  return rows;
}

export const BASELINE: Row[] = buildBaseline();

export function toRow(t: Tasting): Row {
  return {
    month: CURRENT,
    segment: t.segment,
    wine: t.wine,
    sweet: t.sweet,
    bubbles: t.bubbles,
    aroma: t.aroma,
    again: t.again,
  };
}

export function againShare(rows: Row[]) {
  return rows.filter((r) => r.again === "yes").length / Math.max(1, rows.length);
}

export function zeroShare(rows: Row[], month: number) {
  const young = rows.filter((r) => r.segment === "18-24" && r.month === month);
  return young.filter((r) => r.wine === "zero").length / Math.max(1, young.length);
}

export interface Perception {
  wine: WineId;
  real: number;
  perceived: number;
  n: number;
}

export function perception(rows: Row[]): Perception[] {
  return WINE_IDS.map((wine) => {
    const rs = rows.filter((r) => r.wine === wine);
    const perceived = rs.reduce((s, r) => s + r.sweet, 0) / Math.max(1, rs.length);
    return { wine, real: realSweetness(WINES[wine]), perceived, n: rs.length };
  }).sort((a, b) => a.real - b.real);
}

function mode<T extends string>(values: T[]): T | undefined {
  const counts = new Map<T, number>();
  values.forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1));
  let best: T | undefined;
  let max = 0;
  counts.forEach((c, v) => {
    if (c > max) {
      max = c;
      best = v;
    }
  });
  return best;
}

export interface SegmentStat {
  segment: Segment;
  n: number;
  topWine: WineId;
  topAroma: Aroma;
  sweet: number;
  again: number;
}

export function segments(rows: Row[]): SegmentStat[] {
  return SEGMENTS.map((segment) => {
    const rs = rows.filter((r) => r.segment === segment);
    return {
      segment,
      n: rs.length,
      topWine: mode(rs.map((r) => r.wine)) ?? "medea",
      topAroma: mode(rs.map((r) => r.aroma)) ?? "flowers",
      sweet: rs.reduce((s, r) => s + r.sweet, 0) / Math.max(1, rs.length),
      again: againShare(rs),
    };
  });
}

export interface OutlookPoint {
  month: number;
  value: number;
  lo?: number;
  hi?: number;
  forecast: boolean;
}

/** Monthly 0.0 share among 18–24, plus a linear-trend forecast with a widening band. */
export function outlook(rows: Row[]): OutlookPoint[] {
  const hist = Array.from({ length: MONTHS }, (_, m) => ({ month: m, value: zeroShare(rows, m) }));
  const n = hist.length;
  const mx = (n - 1) / 2;
  const my = hist.reduce((s, p) => s + p.value, 0) / n;
  const slope =
    hist.reduce((s, p) => s + (p.month - mx) * (p.value - my), 0) /
    hist.reduce((s, p) => s + (p.month - mx) ** 2, 0);
  const resid = Math.sqrt(hist.reduce((s, p) => s + (p.value - (my + slope * (p.month - mx))) ** 2, 0) / (n - 2));
  const last = hist[n - 1];
  const points: OutlookPoint[] = hist.map((p) => ({ ...p, forecast: false }));
  points[n - 1] = { ...last, lo: last.value, hi: last.value, forecast: false };
  for (let k = 1; k <= MONTHS; k++) {
    const month = CURRENT + k;
    const value = last.value + slope * k;
    const spread = resid * 1.28 * Math.sqrt(1 + k / 3);
    points.push({ month, value, lo: Math.max(0, value - spread), hi: value + spread, forecast: true });
  }
  return points;
}
