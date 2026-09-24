import type { L10n } from "./i18n";
import type { Row } from "./insights";
import { MONTHS, againShare } from "./insights";
import { SEGMENTS } from "./personas";
import type { Tasting } from "./tasting";
import { VENUES } from "./venues";
import type { VenueRadar } from "./venues";
import { CITY_NAMES } from "./geo";
import { WINES, WINE_IDS } from "./wines";

export interface Alert {
  id: string;
  trend: "up" | "down" | "new";
  when: L10n;
  title: L10n;
  body: L10n;
}

const pts = (v: number) => Math.round(v * 100);
const recent = (r: Row) => r.month >= MONTHS - 3;
const earlier = (r: Row) => r.month >= MONTHS - 9 && r.month < MONTHS - 3;

/** Month-over-month changes worth a notification on the owner's phone, newest first. */
export function alerts(rows: Row[], live: Tasting[], radar: VenueRadar[] = []): Alert[] {
  const list: Alert[] = [];

  const last = live[live.length - 1];
  if (last) {
    const again = { yes: { it: "lo ricomprerebbe", en: "would buy it again" }, maybe: { it: "forse lo ricomprerebbe", en: "might buy it again" }, no: { it: "non lo ricomprerebbe", en: "would not buy it again" } }[last.again];
    list.push({
      id: `live-${last.id}`,
      trend: "new",
      when: { it: "ora", en: "now" },
      title: { it: `Nuova degustazione · ${WINES[last.wine].name}`, en: `New tasting · ${WINES[last.wine].name}` },
      body: { it: `${last.name}, ${last.segment} anni, ${again.it}.`, en: `${last.name}, aged ${last.segment}, ${again.en}.` },
    });
  }

  const bad = radar.find((r) => r.status === "check");
  if (bad) {
    const v = VENUES[bad.id];
    list.push({
      id: `venue-${bad.id}`,
      trend: "down",
      when: { it: "1 h fa", en: "1 h ago" },
      title: {
        it: `${v.name} · ${CITY_NAMES[v.city]}: ${WINES[v.wine].name} servito male`,
        en: `${v.name} · ${CITY_NAMES[v.city]}: ${WINES[v.wine].name} poorly served`,
      },
      body: bad.reason,
    });
  }

  // Repurchase intent: the most significant fall (by z-score, so small noisy groups don't win).
  let drop: { wine: string; seg: string; a: number; b: number; z: number } | null = null;
  for (const id of WINE_IDS) {
    for (const seg of SEGMENTS) {
      const now = rows.filter((r) => r.wine === id && r.segment === seg && recent(r));
      const before = rows.filter((r) => r.wine === id && r.segment === seg && earlier(r));
      if (now.length < 25 || before.length < 25) continue;
      const a = againShare(before);
      const b = againShare(now);
      const p = (a * before.length + b * now.length) / (before.length + now.length);
      const se = Math.sqrt(Math.max(1e-6, p * (1 - p) * (1 / before.length + 1 / now.length)));
      const z = (b - a) / se;
      if (!drop || z < drop.z) drop = { wine: id, seg, a, b, z };
    }
  }
  if (drop && drop.z < -2) {
    const name = WINES[drop.wine as keyof typeof WINES].name;
    list.push({
      id: "drop",
      trend: "down",
      when: { it: "2 h fa", en: "2 h ago" },
      title: { it: `${name}: riacquisto −${pts(drop.a - drop.b)} punti tra i ${drop.seg}`, en: `${name}: repurchase −${pts(drop.a - drop.b)} pts among ${drop.seg}` },
      body: {
        it: `Dal ${pts(drop.a)}% al ${pts(drop.b)}% negli ultimi tre mesi. Controllate prezzo e presenza nei locali frequentati da questa fascia.`,
        en: `From ${pts(drop.a)}% to ${pts(drop.b)}% over the last three months. Check price and presence in the venues this group visits.`,
      },
    });
  }

  // Serena 0.0 among the youngest guests, and whether it has overtaken ICE.
  const young = rows.filter((r) => r.segment === "18-24" && r.month === MONTHS - 1);
  const zero = young.filter((r) => r.wine === "zero").length / Math.max(1, young.length);
  const ice = young.filter((r) => r.wine === "ice").length / Math.max(1, young.length);
  const youngBefore = rows.filter((r) => r.segment === "18-24" && r.month >= MONTHS - 4 && r.month < MONTHS - 1);
  const zeroBefore = youngBefore.filter((r) => r.wine === "zero").length / Math.max(1, youngBefore.length);
  list.push({
    id: "zero",
    trend: "up",
    when: { it: "ieri", en: "yesterday" },
    title:
      zero > ice
        ? { it: "Serena 0.0 ha superato ICE tra gli under 25", en: "Serena 0.0 has overtaken ICE among under-25s" }
        : { it: `Serena 0.0 +${pts(zero - zeroBefore)} punti tra gli under 25`, en: `Serena 0.0 +${pts(zero - zeroBefore)} pts among under-25s` },
    body: {
      it: `Questo mese è il ${pts(zero)}% delle loro degustazioni (ICE ${pts(ice)}%). Il segnale che state aspettando per il no-alcol.`,
      en: `This month it is ${pts(zero)}% of their tastings (ICE ${pts(ice)}%). The signal you have been waiting for on no-alcohol.`,
    },
  });

  // The strongest rise in a wine's share within an age group (0.0 among the young is covered above).
  let rise: { wine: string; seg: string; a: number; b: number } | null = null;
  for (const id of WINE_IDS) {
    for (const seg of SEGMENTS) {
      if (id === "zero" && seg === "18-24") continue;
      const inNow = rows.filter((r) => r.segment === seg && recent(r));
      const inBefore = rows.filter((r) => r.segment === seg && earlier(r));
      const b = inNow.filter((r) => r.wine === id).length / Math.max(1, inNow.length);
      const a = inBefore.filter((r) => r.wine === id).length / Math.max(1, inBefore.length);
      if (!rise || b - a > rise.b - rise.a) rise = { wine: id, seg, a, b };
    }
  }
  if (rise && rise.b > rise.a) {
    const name = WINES[rise.wine as keyof typeof WINES].name;
    list.push({
      id: "rise",
      trend: "up",
      when: { it: "questa settimana", en: "this week" },
      title: { it: `${name} cresce tra i ${rise.seg}`, en: `${name} is growing among ${rise.seg}` },
      body: {
        it: `Dal ${pts(rise.a)}% al ${pts(rise.b)}% delle loro degustazioni. Buon momento per una proposta dedicata.`,
        en: `From ${pts(rise.a)}% to ${pts(rise.b)}% of their tastings. A good moment for a dedicated offer.`,
      },
    });
  }

  return list;
}
