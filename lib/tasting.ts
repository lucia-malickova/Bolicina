import { isCity } from "./geo";
import type { City } from "./geo";
import type { L10n } from "./i18n";
import { isVenue } from "./venues";
import type { VenueId } from "./venues";
import { COMPANY, MOMENTS, MOODS, SEGMENTS } from "./personas";
import type { Company, Moment, Mood, Segment } from "./personas";
import { AROMAS, WINES } from "./wines";
import type { Aroma, WineId } from "./wines";

export type Bubbles = "delicate" | "lively" | "explosive";
export type Again = "yes" | "maybe" | "no";

export interface Tasting {
  id: string;
  at: number;
  name: string;
  segment: Segment;
  wine: WineId;
  sweet: number;
  bubbles: Bubbles;
  aroma: Aroma;
  again: Again;
  mood?: Mood;
  company?: Company;
  moment?: Moment;
  city?: City;
  venue?: VenueId;
  /** Willingness to pay for the bottle, in euros (asked once, optional). */
  pay?: number;
  seconds: number;
}

const has = (o: object, k: unknown): boolean => typeof k === "string" && Object.hasOwn(o, k);

/** Validates an untrusted payload (e.g. from the public API route). */
export function parseTasting(x: unknown): Tasting | null {
  if (!x || typeof x !== "object") return null;
  const o = x as Record<string, unknown>;
  const num = (v: unknown, lo: number, hi: number) =>
    typeof v === "number" && Number.isFinite(v) && v >= lo && v <= hi;
  if (typeof o.id !== "string" || o.id.length > 64) return null;
  if (!num(o.at, 0, 8.64e15)) return null;
  if (typeof o.name !== "string" || o.name.length > 40) return null;
  if (!SEGMENTS.includes(o.segment as Segment)) return null;
  if (!has(WINES, o.wine) || !has(AROMAS, o.aroma)) return null;
  if (!num(o.sweet, 1, 5) || !num(o.seconds, 0, 3600)) return null;
  if (!["delicate", "lively", "explosive"].includes(o.bubbles as string)) return null;
  if (!["yes", "maybe", "no"].includes(o.again as string)) return null;
  if (o.mood !== undefined && !has(MOODS, o.mood)) return null;
  if (o.company !== undefined && !has(COMPANY, o.company)) return null;
  if (o.moment !== undefined && !has(MOMENTS, o.moment)) return null;
  if (o.city !== undefined && !isCity(o.city)) return null;
  if (o.venue !== undefined && !isVenue(o.venue)) return null;
  if (o.pay !== undefined && !num(o.pay, 1, 500)) return null;
  return {
    id: o.id,
    at: o.at as number,
    name: o.name,
    segment: o.segment as Segment,
    wine: o.wine as WineId,
    sweet: o.sweet as number,
    bubbles: o.bubbles as Bubbles,
    aroma: o.aroma as Aroma,
    again: o.again as Again,
    mood: o.mood as Mood | undefined,
    company: o.company as Company | undefined,
    moment: o.moment as Moment | undefined,
    city: o.city as City | undefined,
    venue: o.venue as VenueId | undefined,
    pay: o.pay as number | undefined,
    seconds: o.seconds as number,
  };
}

export interface Identity {
  name: L10n;
  traits: L10n[];
  next: WineId;
}

/** Turns one tasting into the guest-facing profile shown as the reward. */
export function identityFor(t: Pick<Tasting, "sweet" | "aroma" | "bubbles" | "wine">): Identity {
  const palate: L10n =
    t.sweet <= 2.5
      ? { it: "Preferisci il secco", en: "You lean towards dry" }
      : t.sweet >= 3.5
        ? { it: "Ti conquista la morbidezza", en: "Softness wins you over" }
        : { it: "Cerchi l'equilibrio", en: "You look for balance" };
  if (t.aroma === "mineral") {
    return {
      name: { it: "Esploratore minerale", en: "Mineral Explorer" },
      traits: [
        { it: "Cerchi sapidità e tensione", en: "You look for salinity and tension" },
        { it: "Il mare ti parla", en: "The sea speaks to you" },
        palate,
      ],
      next: t.wine === "audace" ? "chardonnay" : "audace",
    };
  }
  if (t.sweet >= 3.5 || t.aroma === "yellowFruit") {
    return {
      name: { it: "Edonista solare", en: "Sunny Hedonist" },
      traits: [
        { it: "Ami la frutta matura", en: "You love ripe fruit" },
        palate,
        { it: "Il calice è una festa", en: "A glass is a celebration" },
      ],
      next: t.wine === "ice" ? "soe" : "ice",
    };
  }
  if (t.aroma === "flowers") {
    return {
      name: { it: "Anima floreale", en: "Floral Soul" },
      traits: [
        { it: "Il profumo viene prima di tutto", en: "The nose comes first" },
        { it: "Cerchi eleganza, non potenza", en: "You seek elegance, not power" },
        {
          it: t.bubbles === "delicate" ? "Ami la bollicina gentile" : "Ti piace un perlage vivo",
          en: t.bubbles === "delicate" ? "You love gentle bubbles" : "You like lively bubbles",
        },
      ],
      next: t.wine === "valdobbiadene" ? "soe" : "valdobbiadene",
    };
  }
  return {
    name: { it: "Purista fresco", en: "Fresh Purist" },
    traits: [
      { it: "Freschezza sopra ogni cosa", en: "Freshness above all" },
      { it: "Ti piace la mela croccante", en: "You like crisp apple" },
      palate,
    ],
    next: t.wine === "bio" ? "valdobbiadene" : "bio",
  };
}

export function sweetKey(sweet: number): "dry" | "balanced" | "sweet" {
  return sweet <= 2 ? "dry" : sweet < 3.5 ? "balanced" : "sweet";
}
