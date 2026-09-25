import type { Row } from "./insights";
import type { Tasting } from "./tasting";
import { WINE_IDS } from "./wines";
import type { WineId } from "./wines";
import { WORLD_XY } from "./worldShapes";

export type City = Exclude<keyof typeof WORLD_XY, "italia">;

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
  london: "London",
  paris: "Paris",
  berlin: "Berlin",
  amsterdam: "Amsterdam",
  brussels: "Bruxelles",
  stockholm: "Stockholm",
  copenhagen: "København",
  oslo: "Oslo",
  warszawa: "Warszawa",
  praha: "Praha",
  bratislava: "Bratislava",
  newyork: "New York",
  miami: "Miami",
  losangeles: "Los Angeles",
  chicago: "Chicago",
  toronto: "Toronto",
  saopaulo: "São Paulo",
  mexico: "Ciudad de México",
  tokyo: "Tokyo",
  shanghai: "Shanghai",
  hongkong: "Hong Kong",
  singapore: "Singapore",
  sydney: "Sydney",
  melbourne: "Melbourne",
  dubai: "Dubai",
  capetown: "Cape Town",
};

/** Longitude, latitude of each city (for live weather). */
export const LONLAT: Record<City, [number, number]> = {
  conegliano: [12.3, 45.89], treviso: [12.24, 45.67], venezia: [12.33, 45.44], padova: [11.88, 45.41], verona: [10.99, 45.44],
  trieste: [13.78, 45.65], milano: [9.19, 45.46], torino: [7.69, 45.07], genova: [8.93, 44.41], bologna: [11.34, 44.49],
  firenze: [11.26, 43.77], roma: [12.5, 41.9], napoli: [14.27, 40.85], bari: [16.87, 41.12], palermo: [13.36, 38.12],
  cagliari: [9.11, 39.22], munchen: [11.58, 48.14], wien: [16.37, 48.21], zurich: [8.54, 47.37], ljubljana: [14.51, 46.06],
  innsbruck: [11.4, 47.27], nice: [7.26, 43.7], london: [-0.13, 51.51], paris: [2.35, 48.86], berlin: [13.4, 52.52],
  amsterdam: [4.9, 52.37], brussels: [4.35, 50.85], stockholm: [18.07, 59.33], copenhagen: [12.57, 55.68], oslo: [10.75, 59.91],
  warszawa: [21.01, 52.23], praha: [14.42, 50.08], bratislava: [17.11, 48.15], newyork: [-74.0, 40.71], miami: [-80.19, 25.76],
  losangeles: [-118.24, 34.05], chicago: [-87.63, 41.88], toronto: [-79.38, 43.65], saopaulo: [-46.63, -23.55],
  mexico: [-99.13, 19.43], tokyo: [139.69, 35.69], shanghai: [121.47, 31.23], hongkong: [114.17, 22.32],
  singapore: [103.82, 1.35], sydney: [151.21, -33.87], melbourne: [144.96, -37.81], dubai: [55.27, 25.2], capetown: [18.42, -33.92],
};

export const ITALIAN = new Set<City>([
  "conegliano", "treviso", "venezia", "padova", "verona", "trieste", "milano", "torino",
  "genova", "bologna", "firenze", "roma", "napoli", "bari", "palermo", "cagliari",
]);

export const isCity = (x: unknown): x is City => typeof x === "string" && x !== "italia" && Object.hasOwn(WORLD_XY, x);

// Illustrative spread of the baseline tastings: about a third in Italy, the rest in the
// export markets where Prosecco sells most (UK, US, Germany first).
const WEIGHTS: Record<City, number> = {
  conegliano: 3, treviso: 5, venezia: 4.5, padova: 4, verona: 3.5, trieste: 2, milano: 7, torino: 3, genova: 1.5,
  bologna: 3, firenze: 2.5, roma: 5, napoli: 2, bari: 1, palermo: 1, cagliari: 0.8,
  munchen: 5, wien: 3, zurich: 3, ljubljana: 1, innsbruck: 1, nice: 1.5,
  london: 12, paris: 4, berlin: 6, amsterdam: 4, brussels: 3, stockholm: 3, copenhagen: 2, oslo: 2, warszawa: 2,
  praha: 2, bratislava: 1.5, newyork: 9, miami: 3, losangeles: 4, chicago: 3, toronto: 3, saopaulo: 2, mexico: 1.5,
  tokyo: 3, shanghai: 2, hongkong: 2, singapore: 2, sydney: 4, melbourne: 2, dubai: 3, capetown: 1.5,
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
  wines: Map<WineId, number>;
  lastLive?: number;
}

export function cityStats(baseline: Row[], live: Tasting[]): CityStat[] {
  const stats = new Map<City, CityStat>();
  const bump = (city: City, w: WineId, at?: number) => {
    const s = stats.get(city) ?? { city, n: 0, wines: new Map<WineId, number>() };
    s.n += 1;
    s.wines.set(w, (s.wines.get(w) ?? 0) + 1);
    if (at !== undefined) s.lastLive = Math.max(s.lastLive ?? 0, at);
    stats.set(city, s);
  };
  baseline.forEach((r, i) => bump(cityForIndex(i), r.wine));
  live.forEach((t) => bump(t.city ?? "conegliano", t.wine, t.at));
  return [...stats.values()];
}

export function topWine(wines: Map<WineId, number>): WineId {
  return WINE_IDS.reduce((a, b) => ((wines.get(b) ?? 0) > (wines.get(a) ?? 0) ? b : a));
}
