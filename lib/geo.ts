import type { Row } from "./insights";
import { CITY_XY } from "./mapShapes";
import type { Tasting } from "./tasting";
import { WINE_IDS } from "./wines";
import type { WineId } from "./wines";

export type City = keyof typeof CITY_XY;

export const CITY_NAMES: Record<City, string> = {
  conegliano: "Conegliano",
  treviso: "Treviso",
  venezia: "Venezia",
  padova: "Padova",
  verona: "Verona",
  trieste: "Trieste",
  milano: "Milano",
  torino: "Torino",
  genova: "Genova",
  bologna: "Bologna",
  firenze: "Firenze",
  roma: "Roma",
  napoli: "Napoli",
  bari: "Bari",
  palermo: "Palermo",
  cagliari: "Cagliari",
  munchen: "München",
  wien: "Wien",
  zurich: "Zürich",
  ljubljana: "Ljubljana",
  innsbruck: "Innsbruck",
  nice: "Nice",
};

export const isCity = (x: unknown): x is City => typeof x === "string" && Object.hasOwn(CITY_XY, x);

// Illustrative spread of the baseline tastings, heaviest around the winery and in big cities.
const WEIGHTS: Record<City, number> = {
  conegliano: 6, treviso: 10, venezia: 9, padova: 8, verona: 7, trieste: 4, milano: 14, torino: 6, genova: 3,
  bologna: 6, firenze: 5, roma: 10, napoli: 4, bari: 2, palermo: 2, cagliari: 1.5, munchen: 6, wien: 4,
  zurich: 4, ljubljana: 1.5, innsbruck: 2, nice: 2,
};
const CITIES = Object.keys(WEIGHTS) as City[];
const TOTAL = CITIES.reduce((s, c) => s + WEIGHTS[c], 0);

function cityForIndex(i: number): City {
  const x = Math.sin(i * 91.3458 + 7.13) * 47453.5453;
  let r = (x - Math.floor(x)) * TOTAL;
  for (const c of CITIES) {
    r -= WEIGHTS[c];
    if (r <= 0) return c;
  }
  return "conegliano";
}

export interface CityStat {
  city: City;
  n: number;
  top: WineId;
  lastLive?: number;
}

export function cityStats(baseline: Row[], live: Tasting[]): CityStat[] {
  const counts = new Map<City, Map<WineId, number>>();
  const bump = (c: City, w: WineId) => {
    const m = counts.get(c) ?? new Map<WineId, number>();
    m.set(w, (m.get(w) ?? 0) + 1);
    counts.set(c, m);
  };
  baseline.forEach((r, i) => bump(cityForIndex(i), r.wine));
  const lastLive = new Map<City, number>();
  live.forEach((t) => {
    const c = t.city ?? "conegliano";
    bump(c, t.wine);
    lastLive.set(c, Math.max(lastLive.get(c) ?? 0, t.at));
  });
  return [...counts.entries()].map(([city, m]) => {
    const n = [...m.values()].reduce((s, v) => s + v, 0);
    const top = WINE_IDS.reduce((a, b) => ((m.get(b) ?? 0) > (m.get(a) ?? 0) ? b : a));
    return { city, n, top, lastLive: lastLive.get(city) };
  });
}
