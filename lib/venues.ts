import type { City } from "./geo";
import type { L10n } from "./i18n";
import type { Bubbles, Tasting } from "./tasting";
import { WINES, realSweetness } from "./wines";
import type { WineId } from "./wines";

// Fictional venues for the demo: in production each venue gets its own QR code on menus and tables.
export const VENUES = {
  aurora: { name: "Hotel Aurora", city: "london", wine: "medea" },
  rooftop: { name: "Rooftop Nove", city: "newyork", wine: "valdobbiadene" },
  portici: { name: "Bar Portici", city: "bologna", wine: "medea" },
  ponte: { name: "Osteria del Ponte", city: "treviso", wine: "frizzante" },
  centrale: { name: "Enoteca Centrale", city: "milano", wine: "audace" },
  marea: { name: "Bar Marea", city: "sydney", wine: "ice" },
  kranz: { name: "Weinbar Kranz", city: "munchen", wine: "bio" },
  lounge: { name: "Lounge 88", city: "dubai", wine: "zero" },
} satisfies Record<string, { name: string; city: City; wine: WineId }>;

export type VenueId = keyof typeof VENUES;
export const isVenue = (x: unknown): x is VenueId => typeof x === "string" && Object.hasOwn(VENUES, x);

interface Signal {
  wine: WineId;
  bubbles: Bubbles;
  sweet: number;
}

function rng(seed: number) {
  return () => {
    const x = Math.sin(seed++ * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
}

// Illustrative recent tastings per venue. Hotel Aurora is the planted problem: flat and warm Medea.
function baseline(id: VenueId, seed: number): Signal[] {
  const v = VENUES[id];
  const r = rng(seed);
  const bad = id === "aurora";
  const real = realSweetness(WINES[v.wine]);
  const FLAT = [0, 1, 3, 4, 6, 7, 9];
  const WARM = [1, 4, 7];
  return Array.from({ length: 10 }, (_, k) => ({
    wine: v.wine,
    bubbles: (bad ? FLAT.includes(k) : r() < 0.15) ? "delicate" : r() < 0.7 ? "lively" : "explosive",
    sweet: Math.min(5, real + ((bad ? WARM.includes(k) : r() < 0.1) ? 1.3 : 0.1)),
  }));
}

export type RadarStatus = "ok" | "watch" | "check";

export interface VenueRadar {
  id: VenueId;
  status: RadarStatus;
  flat: number;
  warm: number;
  of: number;
  reason: L10n;
}

/** Last 10 tastings per venue compared with the technical sheet: flat bubbles and "sweeter than it is". */
export function venueRadar(live: Tasting[]): VenueRadar[] {
  return (Object.keys(VENUES) as VenueId[]).map((id, i) => {
    const mine = live.filter((t) => t.venue === id).map((t) => ({ wine: t.wine, bubbles: t.bubbles, sweet: t.sweet }));
    const last = [...baseline(id, 100 + i * 37), ...mine].slice(-10);
    const flat = last.filter((s) => s.wine !== "frizzante" && s.bubbles === "delicate").length;
    const warm = last.filter((s) => s.sweet - realSweetness(WINES[s.wine]) > 0.9).length;
    const worst = Math.max(flat, warm);
    const status: RadarStatus = worst >= 5 ? "check" : worst >= 3 ? "watch" : "ok";
    const reason: L10n =
      status === "ok"
        ? { it: "In linea con la scheda tecnica", en: "In line with the technical sheet" }
        : flat >= warm
          ? {
              it: `Perlage spento ${flat}/${last.length}: bottiglie aperte da tempo o bicchieri non adatti`,
              en: `Flat bubbles ${flat}/${last.length}: bottles open too long or the wrong glasses`,
            }
          : {
              it: `Percepito più dolce ${warm}/${last.length}: probabilmente servito troppo caldo`,
              en: `Tastes sweeter ${warm}/${last.length}: probably served too warm`,
            };
    return { id, status, flat, warm, of: last.length, reason };
  });
}
