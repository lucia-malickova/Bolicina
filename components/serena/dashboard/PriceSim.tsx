"use client";

import { useMemo, useState } from "react";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import { atPrice, bestPrice, defaultPrice, payAnswers } from "@/lib/market";
import type { Tasting } from "@/lib/tasting";
import { WINES, fmt } from "@/lib/wines";
import type { WineId } from "@/lib/wines";

const CHOICES: WineId[] = ["audace", "valdobbiadene", "medea", "zero"];
const W = 420;
const H = 120;
const PMIN = 3;
const PMAX = 50;
const LINE = "#b8893a";

const eur = (v: number, lang: Lang) => `${fmt(v, lang, v % 1 ? 1 : 0)} €`;

export default function PriceSim({ live, lang }: { live: Tasting[]; lang: Lang }) {
  const [wine, setWine] = useState<WineId>("audace");
  const [price, setPrice] = useState(defaultPrice("audace"));
  const answers = useMemo(() => payAnswers(wine, live), [wine, live]);
  const now = atPrice(answers, price);
  const plus = atPrice(answers, price + 3);
  const best = useMemo(() => bestPrice(answers), [answers]);
  const x = (p: number) => ((p - PMIN) / (PMAX - PMIN)) * W;
  const y = (s: number) => H - s * (H - 8) - 4;
  const curve = Array.from({ length: 95 }, (_, i) => PMIN + i * 0.5)
    .map((p, i) => `${i ? "L" : "M"}${x(p).toFixed(1)},${y(atPrice(answers, p).share).toFixed(1)}`)
    .join("");
  const change = now.revenue ? (plus.revenue - now.revenue) / now.revenue : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {CHOICES.map((w) => (
          <button
            key={w}
            data-on={wine === w}
            onClick={() => {
              setWine(w);
              setPrice(defaultPrice(w));
            }}
            className="chip px-3.5 py-1.5 text-[12px]"
          >
            {WINES[w].name}
          </button>
        ))}
      </div>
      <label className="flex flex-col gap-1">
        <span className="flex items-baseline justify-between text-[12px]">
          <span className="text-mist">{t("priceYours", lang)}</span>
          <span className="font-display text-[24px] tabular-nums text-pearl">{eur(price, lang)}</span>
        </span>
        <input type="range" min={PMIN} max={PMAX} step={0.5} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="sweet-range" />
      </label>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={t("priceWould", lang)}>
        <line x1={0} x2={W} y1={H - 4} y2={H - 4} stroke="rgba(232,214,168,.12)" />
        <path d={curve} fill="none" stroke={LINE} strokeWidth={2} strokeLinejoin="round" />
        <line x1={x(best.price)} x2={x(best.price)} y1={4} y2={H - 4} stroke="rgba(232,214,168,.35)" strokeDasharray="3 4" />
        <circle cx={x(price)} cy={y(now.share)} r={6} fill={LINE} stroke="#101217" strokeWidth={2} />
      </svg>

      <dl className="grid grid-cols-2 gap-x-5 gap-y-3 text-[12px]">
        <Stat label={t("priceWould", lang)} value={`${Math.round(now.share * 100)}%`} />
        <Stat label={t("priceRevenue", lang)} value={eur(now.revenue, lang)} />
        <Stat
          label={t("pricePlus", lang)}
          value={`${Math.round(plus.share * 100)}% · ${change >= 0 ? "+" : "−"}${Math.abs(Math.round(change * 100))}%`}
        />
        <Stat label={t("priceBest", lang)} value={eur(best.price, lang)} gold />
      </dl>
      <p className="text-[11px] text-smoke">{t("priceNote", lang)}</p>
    </div>
  );
}

function Stat({ label, value, gold = false }: { label: string; value: string; gold?: boolean }) {
  return (
    <div className="flex flex-col-reverse gap-0.5">
      <dt className="text-mist">{label}</dt>
      <dd className={`font-display text-[22px] leading-none tabular-nums ${gold ? "text-champagne" : "text-pearl"}`}>{value}</dd>
    </div>
  );
}
