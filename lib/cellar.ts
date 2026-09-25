import type { L10n } from "./i18n";
import type { Mood } from "./personas";
import { WINES, realSweetness } from "./wines";
import type { WineId } from "./wines";

export type Source = "shop" | "online" | "gift" | "winery";

export interface Bottle {
  id: string;
  wine: WineId;
  added: number;
  source?: Source;
}

export const SOURCES: Record<Source, L10n> = {
  shop: { it: "In enoteca", en: "Wine shop" },
  online: { it: "Online", en: "Online" },
  gift: { it: "Regalo", en: "Gift" },
  winery: { it: "In cantina", en: "At the winery" },
};

export type Heat = "hot" | "mild" | "cold";
export const heatOf = (tMax: number): Heat => (tMax >= 26 ? "hot" : tMax < 15 ? "cold" : "mild");

const HEAT_FIT: Record<Heat, Partial<Record<WineId, number>>> = {
  hot: { frizzante: 2, ice: 1.6, zero: 1.5, bio: 0.8, medea: 0.8, chardonnay: 0.6, valdobbiadene: -0.5, audace: -0.8 },
  mild: { medea: 0.5, bio: 0.5, soe: 0.4, valdobbiadene: 0.3 },
  cold: { audace: 1.6, valdobbiadene: 1.4, soe: 1, ice: -1, frizzante: -0.6 },
};

const MOOD_FIT: Record<Mood, Partial<Record<WineId, number>>> = {
  tired: { frizzante: 2.5, medea: 1.2, zero: 0.8 },
  relaxed: { medea: 2, bio: 1.6, frizzante: 1.2, valdobbiadene: 1 },
  festive: { ice: 2.5, zero: 1.6, medea: 1.2 },
  focused: { zero: 2.8 },
  curious: { soe: 2.5, chardonnay: 1.6, audace: 1.2 },
  active: { audace: 2.2, zero: 1.8, bio: 0.8 },
  romantic: { audace: 2.5, valdobbiadene: 2, ice: 0.8 },
};

const DAY = 86_400_000;

export interface Pick {
  bottle: Bottle;
  score: number;
  reasons: L10n[];
}

/**
 * Ranks the bottles the guest actually has at home for tonight: weather, mood,
 * their usual taste, and how long each bottle has waited (Prosecco is best young).
 */
export function pickTonight(
  bottles: Bottle[],
  ctx: { tMax: number; mood?: Mood; usualSweet: number | null; now: number },
): Pick[] {
  const heat = heatOf(ctx.tMax);
  const seen = new Set<WineId>();
  return bottles
    .filter((b) => (seen.has(b.wine) ? false : (seen.add(b.wine), true)))
    .map((bottle) => {
      const w = WINES[bottle.wine];
      const reasons: L10n[] = [];
      const hf = HEAT_FIT[heat][bottle.wine] ?? 0;
      const mf = ctx.mood ? MOOD_FIT[ctx.mood][bottle.wine] ?? 0 : 0;
      const tf = ctx.usualSweet === null ? 0 : -0.8 * Math.abs(realSweetness(w) - ctx.usualSweet);
      const months = (ctx.now - bottle.added) / (30 * DAY);
      const af = Math.min(1.5, months / 4);
      if (hf > 0.5)
        reasons.push(
          heat === "hot"
            ? { it: `Fuori ${Math.round(ctx.tMax)} °C: serve qualcosa di leggero e fresco`, en: `${Math.round(ctx.tMax)} °C outside: you want something light and fresh` }
            : heat === "cold"
              ? { it: `Solo ${Math.round(ctx.tMax)} °C: è la sera per un vino di carattere`, en: `Only ${Math.round(ctx.tMax)} °C: an evening for a wine with character` }
              : { it: "Serata mite, perfetta per un calice versatile", en: "A mild evening, right for a versatile glass" },
        );
      if (mf > 1) reasons.push({ it: "Si adatta al tuo stato d'animo di stasera", en: "It suits your mood tonight" });
      if (ctx.usualSweet !== null && tf > -0.6) reasons.push({ it: "È nel tuo gusto abituale", en: "It matches your usual taste" });
      if (months >= 6)
        reasons.push({
          it: `È in cantina da ${Math.round(months)} mesi: il Prosecco dà il meglio da giovane`,
          en: `It has waited ${Math.round(months)} months: Prosecco is best young`,
        });
      if (!reasons.length) reasons.push({ it: w.pitch.it, en: w.pitch.en });
      return { bottle, score: hf + mf + tf + af, reasons: reasons.slice(0, 3) };
    })
    .sort((a, b) => b.score - a.score);
}

/** How long to chill from room temperature, as practical guidance. */
export const CHILL: L10n = {
  it: "In frigo 2–3 ore, oppure 20–25 minuti in un secchiello con acqua e ghiaccio.",
  en: "2–3 hours in the fridge, or 20–25 minutes in a bucket of ice and water.",
};

export function newBottle(wine: WineId, source?: Source, added = Date.now()): Bottle {
  return { id: `${added.toString(36)}-${Math.random().toString(36).slice(2, 8)}`, wine, added, source };
}

/** A believable starting cellar for a demo guest (bottles bought over the last months). */
export function seedCellar(favourite: WineId, seed: number, now: number): Bottle[] {
  const pool: WineId[] = [favourite, favourite, "medea", "valdobbiadene", "zero", "ice", "audace", "bio"];
  const pickN = 4 + (seed % 3);
  return Array.from({ length: pickN }, (_, i) => {
    const wine = pool[(seed * 7 + i * 3) % pool.length];
    const monthsAgo = ((seed + i * 5) % 9) + 0.5;
    return { id: `seed-${seed}-${i}`, wine, added: now - monthsAgo * 30 * DAY, source: (["shop", "online", "gift", "winery"] as Source[])[(seed + i) % 4] };
  });
}
