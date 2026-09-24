import type { L10n } from "./i18n";
import type { Row, OutlookPoint, Perception } from "./insights";
import { MONTHS, againShare } from "./insights";
import { SEGMENTS } from "./personas";
import { WINES, WINE_IDS, fmt, int } from "./wines";

export interface Action {
  kind: { it: string; en: string };
  title: L10n;
  body: L10n;
  evidence: L10n;
}

const pct = (v: number) => Math.round(v * 100);

/** Turns the dashboard's numbers into three plain-language decisions. */
export function actions(rows: Row[], perc: Perception[], out: OutlookPoint[]): Action[] {
  const list: Action[] = [];

  // 1. Production: the no-alcohol trend among the youngest guests.
  const a = pct(out[0].value);
  const b = pct(out[MONTHS - 1].value);
  const c = pct(out[out.length - 1].value);
  const young = rows.filter((r) => r.segment === "18-24").length;
  list.push({
    kind: { it: "Produzione", en: "Production" },
    title: { it: "Più Serena 0.0 per la prossima estate", en: "More Serena 0.0 for next summer" },
    body: {
      it: `Tra gli under 25 lo 0.0 è passato dal ${a}% al ${b}% delle degustazioni in dodici mesi. Se il trend continua, tra un anno sarà il ${c}%. Pianificate adesso volumi e dealcolazione, prima dei concorrenti.`,
      en: `Among under-25s, 0.0 went from ${a}% to ${b}% of tastings in twelve months. If the trend holds, it will be ${c}% a year from now. Plan volumes and dealcoholisation now, ahead of competitors.`,
    },
    evidence: {
      it: `${int(young, "it")} degustazioni under 25`,
      en: `${int(young, "en")} under-25 tastings`,
    },
  });

  // 2. Positioning: the wine guests perceive furthest from its technical sheet.
  const sweeter = [...perc].sort((x, y) => y.perceived - y.real - (x.perceived - x.real))[0];
  const w = WINES[sweeter.wine];
  const youngRows = rows.filter((r) => r.wine === sweeter.wine && (r.segment === "18-24" || r.segment === "25-34"));
  const youngGap = youngRows.reduce((s, r) => s + r.sweet, 0) / Math.max(1, youngRows.length) - sweeter.real;
  list.push({
    kind: { it: "Comunicazione", en: "Messaging" },
    title: { it: `Raccontate ${w.name} come morbido, non come secco`, en: `Tell ${w.name}'s story as soft, not dry` },
    body: {
      it: `Sulla scheda è un ${w.style.it}, ma i clienti sotto i 35 anni lo sentono più dolce di quanto sia (+${fmt(youngGap, "it")} su 5). Allineate etichetta, carta dei vini e racconto dei distributori a quello che il cliente percepisce davvero.`,
      en: `On paper it is ${w.style.en}, but guests under 35 taste it sweeter than it is (+${fmt(youngGap, "en")} out of 5). Align the label, wine lists and the distributors' pitch with what guests actually perceive.`,
    },
    evidence: {
      it: `${int(youngRows.length, "it")} degustazioni under 35 di ${w.name}`,
      en: `${int(youngRows.length, "en")} under-35 tastings of ${w.name}`,
    },
  });

  // 3. Allocation: the most re-bought wine, and the group that over-indexes on it.
  const loyal = WINE_IDS.map((id) => ({ id, rs: rows.filter((r) => r.wine === id) }))
    .filter((x) => x.rs.length >= 50)
    .map((x) => ({ ...x, again: againShare(x.rs) }))
    .sort((x, y) => y.again - x.again)[0];
  const overall = loyal.rs.length / rows.length;
  const seg = SEGMENTS.map((s) => {
    const inSeg = rows.filter((r) => r.segment === s);
    return { s, lift: inSeg.filter((r) => r.wine === loyal.id).length / Math.max(1, inSeg.length) / overall };
  }).sort((x, y) => y.lift - x.lift)[0];
  const lw = WINES[loyal.id];
  const age = seg.s.replace("-", "\u2011");
  list.push({
    kind: { it: "Allocazione", en: "Allocation" },
    title: { it: `${lw.name}: prima a chi ha ${age} anni`, en: `${lw.name}: first to guests aged ${age}` },
    body: {
      it: `È il vino che si ricompra di più: il ${pct(loyal.again)}% lo riprenderebbe. Nella fascia ${seg.s} viene scelto ${fmt(seg.lift, "it")} volte più della media. Riservate a loro pre-vendite, allocazioni ed eventi in cantina.`,
      en: `It is the most re-bought wine: ${pct(loyal.again)}% would buy it again. The ${seg.s} group picks it ${fmt(seg.lift, "en")} times more than average. Give them pre-sales, allocations and winery events first.`,
    },
    evidence: {
      it: `${int(loyal.rs.length, "it")} degustazioni di ${lw.name}`,
      en: `${int(loyal.rs.length, "en")} tastings of ${lw.name}`,
    },
  });

  return list;
}

export interface DataValue {
  tastings: number;
  months: number;
  signals: number;
  growth: number;
  perMonth: number[];
}

/** Signals captured per tasting: wine, sweetness, bubbles, aroma, repurchase, mood, company, moment, age. */
const SIGNALS = 9;

export function dataValue(rows: Row[]): DataValue {
  const perMonth = Array.from({ length: MONTHS }, (_, m) => rows.filter((r) => r.month === m).length);
  const growth = (perMonth[MONTHS - 1] / Math.max(1, perMonth[0])) ** (1 / (MONTHS - 1)) - 1;
  return { tastings: rows.length, months: MONTHS, signals: SIGNALS, growth, perMonth };
}
