import type { L10n, Lang } from "./i18n";
import type { Row } from "./insights";
import { MONTHS, againShare, outlook } from "./insights";
import { SEGMENTS } from "./personas";
import type { Segment } from "./personas";
import type { Bubbles } from "./tasting";
import { AROMAS, WINES, WINE_IDS, fmt, realSweetness, sweetnessFromSugar } from "./wines";
import type { Aroma, WineId } from "./wines";

const share = <T>(xs: T[], pred: (x: T) => boolean) => xs.filter(pred).length / Math.max(1, xs.length);

/* ---------- Virtual tasting: a wine that doesn't exist yet ---------- */

export interface NewWine {
  sugar: number;
  abv: number;
  aroma: Aroma;
  bubbles: Bubbles;
}

export interface PanelResult {
  bySegment: { segment: Segment; appeal: number }[];
  best: Segment;
  closest: WineId;
  overlap: boolean;
}

/**
 * Estimates liking per age group from what guests who said "I'd buy it again" actually tasted:
 * how close the sweetness is to their liked sweetness, their favourite aromas and bubbles,
 * and how much each group already reaches for the alcohol-free wine.
 */
export function virtualPanel(rows: Row[], w: NewWine): PanelResult {
  const sweet = sweetnessFromSugar(w.sugar);
  const bySegment = SEGMENTS.map((segment) => {
    const all = rows.filter((r) => r.segment === segment);
    const liked = all.filter((r) => r.again === "yes");
    const mu = liked.reduce((s, r) => s + r.sweet, 0) / Math.max(1, liked.length);
    const sd = Math.max(0.6, Math.sqrt(liked.reduce((s, r) => s + (r.sweet - mu) ** 2, 0) / Math.max(1, liked.length)));
    const sweetFit = Math.exp(-((sweet - mu) ** 2) / (2 * sd * sd));
    const aromaShares = (Object.keys(AROMAS) as Aroma[]).map((a) => share(liked, (r) => r.aroma === a));
    const aromaFit = share(liked, (r) => r.aroma === w.aroma) / Math.max(...aromaShares);
    const bubbleShares = (["delicate", "lively", "explosive"] as Bubbles[]).map((b) => share(liked, (r) => r.bubbles === b));
    const bubbleFit = share(liked, (r) => r.bubbles === w.bubbles) / Math.max(...bubbleShares);
    const zero = share(all, (r) => r.wine === "zero");
    const alcoholFit = w.abv === 0 ? Math.min(1, 0.3 + zero * 5) : Math.max(0, 1 - zero * 1.5);
    const appeal = 100 * (0.5 * sweetFit + 0.2 * aromaFit + 0.1 * bubbleFit + 0.2 * alcoholFit);
    return { segment, appeal: Math.round(appeal) };
  });
  const best = [...bySegment].sort((a, b) => b.appeal - a.appeal)[0].segment;
  const dist = (id: WineId) =>
    Math.abs(realSweetness(WINES[id]) - sweet) + Math.abs(WINES[id].abv - w.abv) / 4 + (WINES[id].aromas[0] === w.aroma ? 0 : 0.5);
  const closest = [...WINE_IDS].sort((a, b) => dist(a) - dist(b))[0];
  return { bySegment, best, closest, overlap: dist(closest) < 0.45 };
}

/* ---------- Ask your data ---------- */

export const QUESTIONS = {
  young: { it: "Cosa bevono gli under 25?", en: "What do under-25s drink?" },
  loyal: { it: "Chi sceglie Audace?", en: "Who chooses Audace?" },
  weak: { it: "Quale vino convince meno?", en: "Which wine convinces least?" },
  zero: { it: "Come sta andando lo 0.0?", en: "How is 0.0 doing?" },
  mature: { it: "Cosa cercano gli over 50?", en: "What do over-50s look for?" },
} satisfies Record<string, L10n>;
export type Question = keyof typeof QUESTIONS;

const ROUTES: [RegExp, Question][] = [
  [/giovan|young|under|gen ?z|ragazz|18|25/i, "young"],
  [/audace|fedel|loyal|ricompr|buy again/i, "loyal"],
  [/meno|peggio|debol|weak|worst|least|delud/i, "weak"],
  [/0\.0|zero|analcol|alcohol.?free|no.?alcol/i, "zero"],
  [/over|anzian|older|senior|50|65|matur/i, "mature"],
];

export function routeQuestion(text: string): Question | null {
  return ROUTES.find(([re]) => re.test(text))?.[1] ?? null;
}

const p = (v: number) => `${Math.round(v * 100)}%`;

function topWines(rs: Row[], n: number) {
  return WINE_IDS.map((id) => ({ id, s: share(rs, (r) => r.wine === id) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, n);
}

export function answer(rows: Row[], q: Question, lang: Lang): string {
  const it = lang === "it";
  if (q === "young") {
    const rs = rows.filter((r) => r.segment === "18-24");
    const [a, b, c] = topWines(rs, 3);
    return it
      ? `Gli under 25 scelgono soprattutto ${WINES[a.id].name} (${p(a.s)}), ${WINES[b.id].name} (${p(b.s)}) e ${WINES[c.id].name} (${p(c.s)}). Amano la frutta gialla e il perlage vivace. È il gruppo in cui lo 0.0 cresce più in fretta.`
      : `Under-25s mostly choose ${WINES[a.id].name} (${p(a.s)}), ${WINES[b.id].name} (${p(b.s)}) and ${WINES[c.id].name} (${p(c.s)}). They love yellow fruit and lively bubbles. It is the group where 0.0 grows fastest.`;
  }
  if (q === "loyal") {
    const rs = rows.filter((r) => r.wine === "audace");
    const segs = SEGMENTS.map((s) => ({ s, v: share(rs, (r) => r.segment === s) })).sort((a, b) => b.v - a.v);
    return it
      ? `Audace lo scelgono soprattutto i ${segs[0].s} anni (${p(segs[0].v)}) e i ${segs[1].s} (${p(segs[1].v)}). Il ${p(againShare(rs))} lo ricomprerebbe: con 6.492 bottiglie, conviene riservarlo a loro in pre-vendita.`
      : `Audace is chosen mostly by guests aged ${segs[0].s} (${p(segs[0].v)}) and ${segs[1].s} (${p(segs[1].v)}). ${p(againShare(rs))} would buy it again: with 6,492 bottles, offer it to them first as a pre-sale.`;
  }
  if (q === "weak") {
    const ranked = WINE_IDS.map((id) => ({ id, rs: rows.filter((r) => r.wine === id) }))
      .filter((x) => x.rs.length >= 50)
      .map((x) => ({ ...x, a: againShare(x.rs) }))
      .sort((a, b) => a.a - b.a);
    const w = ranked[0];
    const gap = w.rs.reduce((s, r) => s + r.sweet, 0) / w.rs.length - realSweetness(WINES[w.id]);
    return it
      ? `${WINES[w.id].name} è quello che convince meno: solo il ${p(w.a)} lo ricomprerebbe. I clienti lo sentono ${gap >= 0 ? "più dolce" : "più secco"} della scheda (${gap >= 0 ? "+" : "−"}${fmt(Math.abs(gap), lang)}). Prima di toccare il vino, provate a cambiarne il racconto o l'abbinamento.`
      : `${WINES[w.id].name} convinces least: only ${p(w.a)} would buy it again. Guests find it ${gap >= 0 ? "sweeter" : "drier"} than the sheet says (${gap >= 0 ? "+" : "−"}${fmt(Math.abs(gap), lang)}). Before touching the wine, try changing its story or pairing.`;
  }
  if (q === "zero") {
    const o = outlook(rows);
    return it
      ? `Tra gli under 25 lo 0.0 è passato dal ${p(o[0].value)} al ${p(o[MONTHS - 1].value)} delle degustazioni in un anno. La previsione per i prossimi dodici mesi è ${p(o[o.length - 1].value)}. Attenzione: i clienti lo credono più secco di quanto sia, perché ha il residuo zuccherino più alto della gamma.`
      : `Among under-25s, 0.0 went from ${p(o[0].value)} to ${p(o[MONTHS - 1].value)} of tastings in a year. The forecast for the next twelve months is ${p(o[o.length - 1].value)}. Note: guests think it is drier than it is, as it has the highest residual sugar in the range.`;
  }
  const rs = rows.filter((r) => r.segment === "50-64" || r.segment === "65+");
  const aromas = (Object.keys(AROMAS) as Aroma[]).map((a) => ({ a, s: share(rs, (r) => r.aroma === a) })).sort((x, y) => y.s - x.s);
  const [w] = topWines(rs, 1);
  return it
    ? `Gli over 50 cercano soprattutto ${AROMAS[aromas[0].a].it.toLowerCase()} (${p(aromas[0].s)}). Il loro vino è ${WINES[w.id].name}, e sono i clienti più fedeli: il ${p(againShare(rs))} ricomprerebbe quello che ha assaggiato.`
    : `Over-50s mostly look for ${AROMAS[aromas[0].a].en.toLowerCase()} (${p(aromas[0].s)}). Their wine is ${WINES[w.id].name}, and they are the most loyal guests: ${p(againShare(rs))} would re-buy what they tasted.`;
}

/* ---------- Tomorrow: weather and calendar ---------- */

export type Weather = "hot" | "mild" | "cold";
export type Day = "weekday" | "weekend";

// Illustrative coefficients; the real model learns them from dated tastings and sales.
const WEATHER: Record<Weather, { volume: number; wine: Partial<Record<WineId, number>> }> = {
  hot: { volume: 1.2, wine: { frizzante: 1.35, ice: 1.3, zero: 1.25, bio: 1.1, medea: 1.1, valdobbiadene: 0.9, audace: 0.85 } },
  mild: { volume: 1, wine: {} },
  cold: { volume: 0.85, wine: { audace: 1.25, valdobbiadene: 1.2, soe: 1.1, ice: 0.8, frizzante: 0.8, zero: 0.9 } },
};

export function tomorrow(rows: Row[], weather: Weather, day: Day) {
  const recent = rows.filter((r) => r.month === MONTHS - 1);
  const base = WINE_IDS.map((id) => ({ id, s: share(recent, (r) => r.wine === id) }));
  const weekend = day === "weekend";
  const mult = (id: WineId) =>
    (WEATHER[weather].wine[id] ?? 1) * (weekend && (id === "ice" || id === "zero" || id === "medea") ? 1.15 : 1);
  const norm = base.reduce((s, b) => s + b.s * mult(b.id), 0);
  const volume = WEATHER[weather].volume * (weekend ? 1.35 : 1);
  const wines = base
    .map((b) => ({ id: b.id, change: volume * (mult(b.id) / norm) - 1 }))
    .sort((a, b) => b.change - a.change);
  return { volume: volume - 1, wines };
}

/* ---------- The wine you're missing ---------- */

export interface Missing {
  spec: NewWine;
  segment: Segment;
  from: number;
  to: number;
}

const specOf = (id: WineId): NewWine => ({
  sugar: (WINES[id].sugar[0] + WINES[id].sugar[1]) / 2,
  abv: WINES[id].abv,
  aroma: WINES[id].aromas[0],
  bubbles: id === "frizzante" ? "delicate" : "lively",
});

/** Searches simple wine specs for the one that most improves on the range for some age group. */
export function missingWine(rows: Row[]): Missing | null {
  const size = Object.fromEntries(SEGMENTS.map((s) => [s, rows.filter((r) => r.segment === s).length])) as Record<Segment, number>;
  const best = Object.fromEntries(SEGMENTS.map((s) => [s, 0])) as Record<Segment, number>;
  for (const id of WINE_IDS) {
    for (const x of virtualPanel(rows, specOf(id)).bySegment) best[x.segment] = Math.max(best[x.segment], x.appeal);
  }
  let top: (Missing & { score: number }) | null = null;
  for (const sugar of [5, 9, 13, 16, 22, 30, 40]) {
    for (const abv of [0, 9, 11]) {
      for (const aroma of Object.keys(AROMAS) as Aroma[]) {
        const spec: NewWine = { sugar, abv, aroma, bubbles: "lively" };
        const res = virtualPanel(rows, spec);
        if (res.overlap) continue;
        for (const x of res.bySegment) {
          const score = (x.appeal - best[x.segment]) * size[x.segment];
          if (x.appeal > best[x.segment] && (!top || score > top.score)) {
            top = { spec, segment: x.segment, from: best[x.segment], to: x.appeal, score };
          }
        }
      }
    }
  }
  return top && { spec: top.spec, segment: top.segment, from: top.from, to: top.to };
}
