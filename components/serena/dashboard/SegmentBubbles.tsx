"use client";

import { useState } from "react";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import type { SegmentStat } from "@/lib/insights";
import type { Segment } from "@/lib/personas";
import { AROMAS, WINES, fmt, int } from "@/lib/wines";
import WineVisual from "../WineVisual";

// Hand-placed centres (percent of the stage) so the cluster reads like a glass of bubbles.
const POS: Record<Segment, [number, number]> = {
  "18-24": [27, 23],
  "25-34": [68, 27],
  "35-49": [48, 73],
  "50-64": [85, 74],
  "65+": [14, 71],
};

export default function SegmentBubbles({ data, lang }: { data: SegmentStat[]; lang: Lang }) {
  const [sel, setSel] = useState<Segment>("18-24");
  const max = Math.max(...data.map((d) => d.n));
  const s = data.find((d) => d.segment === sel)!;

  return (
    <div className="@container"><div className="grid grid-cols-1 gap-6 @lg:grid-cols-[1.1fr_1fr]">
      <div className="relative h-[260px]">
        {data.map((d, i) => {
          const size = 48 + 70 * Math.sqrt(d.n / max);
          const [cx, cy] = POS[d.segment];
          return (
            <button
              key={d.segment}
              onClick={() => setSel(d.segment)}
              data-on={sel === d.segment}
              aria-pressed={sel === d.segment}
              className="orb float absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-pearl"
              style={{ left: `${cx}%`, top: `${cy}%`, width: size, height: size, animationDelay: `${i * -1.1}s` }}
            >
              <span className={`font-display text-[20px] leading-none ${sel === d.segment ? "text-night" : ""}`}>{d.segment}</span>
              <span className={`mt-1 text-[10px] tabular-nums ${sel === d.segment ? "text-night/70" : "text-smoke"}`}>
                {int(d.n, lang)}
              </span>
            </button>
          );
        })}
      </div>
      <div key={sel} className="enter flex flex-col gap-4 rounded-[22px] hairline p-5">
        <div className="flex items-baseline justify-between">
          <span className="font-display text-[30px] leading-none">{s.segment}</span>
          <span className="text-[11px] text-smoke">
            {int(s.n, lang)} {t("tastings", lang)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-20 w-12 items-end justify-center">
            <WineVisual id={s.topWine} size={s.topWine === "audace" ? 64 : 80} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.3em] text-smoke">{t("topWine", lang)}</span>
            <span className="font-display text-[22px] leading-tight">{WINES[s.topWine].name}</span>
          </div>
        </div>
        <Row label={t("topAroma", lang)} value={AROMAS[s.topAroma][lang]} />
        <Row label={t("sweetPerc", lang)} value={`${fmt(s.sweet, lang)} / 5`} />
        <Row label={t("kAgain", lang)} value={`${Math.round(s.again * 100)}%`} />
      </div>
    </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-t border-champagne/10 pt-3 text-[12px]">
      <span className="text-mist">{label}</span>
      <span className="text-right text-pearl tabular-nums">{value}</span>
    </div>
  );
}
