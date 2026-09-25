import type { Row } from "./insights";
import type { Tasting } from "./tasting";
import type { WineId } from "./wines";

/* ---------- Lots: how each bottling is perceived ---------- */

// Months 0–11 of the baseline map to four illustrative quarterly bottlings.
const LOTS = ["L25-041", "L26-008", "L26-052", "L26-097"];
export const lotOf = (month: number) => LOTS[Math.min(LOTS.length - 1, Math.floor(month / 3))];

export interface LotStat {
  lot: string;
  n: number;
  fresh: number;
  flagged: boolean;
}

/** "Freshness" = share of guests who found the bubbles lively or explosive. */
export function lotQuality(rows: Row[], wine: WineId): LotStat[] {
  const stats = LOTS.map((lot) => {
    const rs = rows.filter((r) => r.wine === wine && lotOf(r.month) === lot);
    const fresh = rs.filter((r) => r.bubbles !== "delicate").length / Math.max(1, rs.length);
    return { lot, n: rs.length, fresh, flagged: false };
  });
  const mean = stats.reduce((s, x) => s + x.fresh, 0) / stats.length;
  return stats.map((x) => ({ ...x, flagged: x.n >= 20 && x.fresh < mean - 0.12 }));
}

/* ---------- Willingness to pay ---------- */

// Illustrative median answers to "how much would you pay for this bottle?" (euros).
const MEDIAN: Record<WineId, number> = {
  audace: 29, valdobbiadene: 16, soe: 14, medea: 11, bio: 11, ice: 12, frizzante: 9, chardonnay: 9, zero: 10,
};

function gauss(i: number) {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12543.1234;
  const u = Math.max(1e-6, a - Math.floor(a));
  const v = b - Math.floor(b);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function payAnswers(wine: WineId, live: Tasting[]): number[] {
  const seed = Object.keys(MEDIAN).indexOf(wine) * 1000;
  const base = Array.from({ length: 300 }, (_, i) => MEDIAN[wine] * Math.exp(0.33 * gauss(seed + i + 1)));
  return [...base, ...live.filter((t) => t.wine === wine && t.pay).map((t) => t.pay!)];
}

export const defaultPrice = (wine: WineId) => Math.round(MEDIAN[wine] * 0.9);

/** Share of guests who would pay at least `price`, and revenue per 100 guests. */
export function atPrice(answers: number[], price: number) {
  const share = answers.filter((a) => a >= price).length / Math.max(1, answers.length);
  return { share, revenue: Math.round(share * price * 100) };
}

export function bestPrice(answers: number[]) {
  let best = { price: 1, revenue: 0 };
  for (let p = 3; p <= 60; p += 0.5) {
    const r = atPrice(answers, p).revenue;
    if (r > best.revenue) best = { price: p, revenue: r };
  }
  return best;
}

/* ---------- Label A/B test ---------- */

export type LabelChoice = "a" | "b";

export interface Vote {
  id: string;
  choice: LabelChoice;
  segment: string;
}

// Illustrative earlier votes per age group: [A (classic), B (contemporary)].
export const LABEL_BASE: Record<string, [number, number]> = {
  "18-24": [38, 82],
  "25-34": [61, 85],
  "35-49": [78, 71],
  "50-64": [92, 47],
  "65+": [70, 25],
};
