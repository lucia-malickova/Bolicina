import type { L10n } from "./i18n";
import { WINES, sweetnessFromSugar, sugarMid } from "./wines";
import type { Aroma, WineId } from "./wines";

/** A wine on a venue list or shop shelf: Serena's, or another (anonymous) producer's. */
export interface ListWine {
  id: string;
  producer: string;
  name: string;
  style: string;
  sugar: number;
  abv: number;
  aroma: Aroma;
  price: number;
  serena?: WineId;
}

const serena = (id: WineId, price: number): ListWine => ({
  id,
  producer: "Serena 1881",
  name: WINES[id].name,
  style: WINES[id].style.it,
  sugar: sugarMid(WINES[id]),
  abv: WINES[id].abv,
  aroma: WINES[id].aromas[0],
  price,
  serena: id,
});

// Other producers stay anonymous: the demo shows a neutral list, not real competitors.
export const VENUE_LIST: ListWine[] = [
  serena("medea", 7),
  serena("valdobbiadene", 9),
  serena("bio", 7),
  { id: "b", producer: "Produttore B", name: "Prosecco DOC", style: "Extra Dry", sugar: 14, abv: 11, aroma: "apple", price: 6 },
  { id: "c", producer: "Produttore C", name: "Valdobbiadene DOCG", style: "Extra Brut", sugar: 4, abv: 11.5, aroma: "mineral", price: 9 },
  { id: "d", producer: "Produttore D", name: "Prosecco Rosé", style: "Brut", sugar: 10, abv: 11, aroma: "flowers", price: 8 },
];

export const SHELF: ListWine[] = [
  serena("audace", 32),
  serena("valdobbiadene", 16),
  serena("frizzante", 9),
  serena("zero", 10),
  { id: "e", producer: "Produttore E", name: "Prosecco DOC", style: "Brut", sugar: 9, abv: 11, aroma: "apple", price: 11 },
  { id: "f", producer: "Produttore F", name: "Prosecco DOC", style: "Extra Dry", sugar: 15, abv: 11, aroma: "yellowFruit", price: 8 },
];

export interface GuestTaste {
  id: string;
  label: L10n;
  sweet: number;
  aroma?: Aroma;
}

export const GUEST_TASTES: GuestTaste[] = [
  { id: "dry", label: { it: "Ama il secco e sapido", en: "Loves dry and saline" }, sweet: 1.4, aroma: "mineral" },
  { id: "soft", label: { it: "Ama il morbido e fruttato", en: "Loves soft and fruity" }, sweet: 3.3, aroma: "apple" },
  { id: "floral", label: { it: "Ama i profumi di fiori", en: "Loves floral aromas" }, sweet: 2.3, aroma: "flowers" },
  { id: "new", label: { it: "Non lo sa ancora", en: "Not sure yet" }, sweet: 2.4 },
];

/** Neutral ranking: taste distance only, the producer never counts. */
export function rankFor(list: ListWine[], g: GuestTaste): (ListWine & { fit: number })[] {
  return list
    .map((w) => {
      const d = Math.abs(sweetnessFromSugar(w.sugar) - g.sweet) + (g.aroma && w.aroma !== g.aroma ? 0.7 : 0);
      return { ...w, fit: Math.max(0, Math.round(100 - d * 28)) };
    })
    .sort((a, b) => b.fit - a.fit);
}

export type Occasion = "gift" | "dinner" | "aperitivo" | "party";

export const OCCASIONS: Record<Occasion, L10n> = {
  gift: { it: "Regalo", en: "Gift" },
  dinner: { it: "Cena", en: "Dinner" },
  aperitivo: { it: "Aperitivo", en: "Aperitivo" },
  party: { it: "Festa", en: "Party" },
};

const OCCASION_FIT: Record<Occasion, (w: ListWine) => number> = {
  gift: (w) => (w.price >= 15 ? 2 : 0) + (w.serena === "audace" ? 1.5 : 0),
  dinner: (w) => (w.sugar <= 11 ? 1.5 : 0) + (w.aroma === "mineral" || w.aroma === "flowers" ? 0.8 : 0),
  aperitivo: (w) => (w.sugar >= 12 && w.sugar <= 18 ? 1.5 : 0.4) + (w.aroma === "apple" ? 0.6 : 0),
  party: (w) => (w.price <= 12 ? 1.5 : 0) + (w.abv <= 10.5 ? 0.8 : 0),
};

/** Shelf pick for a shopper's occasion and budget (in euros). */
export function shelfPick(occasion: Occasion, budget: number) {
  return SHELF.filter((w) => w.price <= budget)
    .map((w) => ({ ...w, score: OCCASION_FIT[occasion](w) }))
    .sort((a, b) => b.score - a.score || a.price - b.price);
}

/* ---------- Network growth scenario (illustrative, all parameters editable) ---------- */

export interface Params {
  wineryPrice: number;
  venuePrice: number;
  shopPrice: number;
  foundingDiscount: number;
}

export const DEFAULT_PARAMS: Params = { wineryPrice: 490, venuePrice: 39, shopPrice: 29, foundingDiscount: 0.3 };

const logistic = (month: number, max: number, mid: number, k: number, min: number) =>
  min + (max - min) / (1 + Math.exp(-k * (month - mid)));

export interface MonthState {
  month: number;
  wineries: number;
  founders: number;
  venues: number;
  shops: number;
  guests: number;
  mrr: number;
}

export function network(month: number, p: Params): MonthState {
  const wineries = Math.round(logistic(month, 42, 11, 0.35, 1));
  const founders = Math.round(logistic(Math.min(month, 12), 42, 11, 0.35, 1));
  const venues = Math.round(logistic(month, 950, 12, 0.32, 6));
  const shops = Math.round(logistic(month, 420, 13, 0.3, 3));
  const guests = Math.round(logistic(month, 220_000, 14, 0.33, 400));
  // Year one is free for everyone; from month 13 wineries pay, founders at a lasting discount,
  // and a share of venues and shops upgrade to their insights dashboard.
  const paying = month > 12;
  const mrr = paying
    ? Math.round(
        founders * p.wineryPrice * (1 - p.foundingDiscount) +
          (wineries - founders) * p.wineryPrice +
          venues * 0.25 * p.venuePrice +
          shops * 0.2 * p.shopPrice,
      )
    : 0;
  return { month, wineries, founders, venues, shops, guests, mrr };
}
