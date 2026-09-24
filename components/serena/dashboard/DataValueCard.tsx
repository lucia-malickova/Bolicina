"use client";

import { useState } from "react";
import { t } from "@/lib/i18n";
import type { Lang, UIKey } from "@/lib/i18n";
import type { DataValue } from "@/lib/actions";
import { fmt, int } from "@/lib/wines";

const BAR = "#b8893a";

export default function DataValueCard({ v, lang }: { v: DataValue; lang: Lang }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...v.perMonth);
  const stats: [UIKey, string][] = [
    ["vTastings", int(v.tastings, lang)],
    ["vSignals", String(v.signals)],
    ["vMonths", String(v.months)],
    ["vGrowth", `+${fmt(v.growth * 100, lang)}%`],
    ["vOwners", "0"],
  ];

  return (
    <article className="flex flex-col gap-6 rounded-[26px] bg-deep p-6 hairline sm:p-7">
      <div className="flex flex-col gap-1.5">
        <h3 className="font-display text-[28px] leading-tight">{t("valTitle", lang)}</h3>
        <p className="max-w-[560px] text-[13px] leading-relaxed text-mist">{t("valLead", lang)}</p>
      </div>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 xl:grid-cols-5">
        {stats.map(([k, value]) => (
          <div key={k} className="flex flex-col-reverse justify-end gap-1.5">
            <dt className="text-[10px] uppercase leading-snug tracking-[0.25em] text-smoke">{t(k, lang)}</dt>
            <dd className={`font-display text-[40px] leading-none tabular-nums ${k === "vOwners" ? "text-champagne" : "text-pearl"}`}>
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <figure className="flex flex-col gap-2">
        <figcaption className="flex justify-between text-[11px] text-smoke">
          <span>{t("vPerMonth", lang)}</span>
          {hover !== null && <span className="tabular-nums text-pearl">{int(v.perMonth[hover], lang)}</span>}
        </figcaption>
        <div className="flex h-16 items-end gap-[2px]" onPointerLeave={() => setHover(null)}>
          {v.perMonth.map((n, i) => (
            <div
              key={i}
              onPointerEnter={() => setHover(i)}
              className="flex h-full flex-1 cursor-default items-end justify-center"
              aria-label={`${int(n, lang)}`}
            >
              <div
                className="w-[38%] rounded-t-[4px] transition-opacity"
                style={{ height: `${(n / max) * 100}%`, background: BAR, opacity: hover === null || hover === i ? 1 : 0.45 }}
              />
            </div>
          ))}
        </div>
      </figure>

      <p className="font-display text-[21px] italic leading-snug text-champagne">{t("valClosing", lang)}</p>
    </article>
  );
}
