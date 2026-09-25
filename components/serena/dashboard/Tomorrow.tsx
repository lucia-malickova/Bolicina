"use client";

import { useMemo, useState } from "react";
import { CloudRain, Sun, SunMedium } from "lucide-react";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import type { Row } from "@/lib/insights";
import { tomorrow } from "@/lib/simulate";
import type { Day, Weather } from "@/lib/simulate";
import { WINES } from "@/lib/wines";
import WineVisual from "../WineVisual";

const WEATHER = [
  ["hot", "tmHot", Sun],
  ["mild", "tmMild", SunMedium],
  ["cold", "tmCold", CloudRain],
] as const;

const signed = (v: number) => `${v >= 0 ? "+" : "−"}${Math.abs(Math.round(v * 100))}%`;

export default function Tomorrow({ rows, lang }: { rows: Row[]; lang: Lang }) {
  const [weather, setWeather] = useState<Weather>("hot");
  const [day, setDay] = useState<Day>("weekend");
  const f = useMemo(() => tomorrow(rows, weather, day), [rows, weather, day]);
  const rising = f.wines.filter((w) => w.change >= 0).slice(0, 3);
  const prepare = rising.length ? rising : f.wines.slice(0, 1);
  const others = f.wines.filter((w) => !prepare.includes(w));

  return (
    <article className="flex flex-col gap-6 rounded-[26px] bg-deep p-6 hairline sm:p-7">
      <div className="flex flex-col gap-1.5">
        <h3 className="font-display text-[28px] leading-tight">{t("tmTitle", lang)}</h3>
        <p className="max-w-[640px] text-[13px] leading-relaxed text-mist">{t("tmLead", lang)}</p>
      </div>

      <div className="@container"><div className="grid grid-cols-1 gap-8 @2xl:grid-cols-[260px_1fr]">
        <div className="flex flex-col gap-5">
          <div className="flex gap-3">
            {WEATHER.map(([k, label, Icon]) => (
              <button
                key={k}
                onClick={() => setWeather(k)}
                data-on={weather === k}
                aria-pressed={weather === k}
                className="orb flex size-[72px] flex-col items-center justify-center gap-1 text-pearl data-[on=true]:text-night"
              >
                <Icon strokeWidth={1.3} className="size-5" />
                <span className="text-[12px] tabular-nums">{t(label, lang)}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {(["weekday", "weekend"] as const).map((d) => (
              <button key={d} data-on={day === d} onClick={() => setDay(d)} className="chip px-4 py-2 text-[12px]">
                {t(d === "weekday" ? "tmWeekday" : "tmWeekend", lang)}
              </button>
            ))}
          </div>
          <div>
            <p className="font-display text-[54px] leading-none tabular-nums text-pearl">{signed(f.volume)}</p>
            <p className="mt-2 text-[12px] text-mist">{t("tmVolume", lang)}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-[10px] uppercase tracking-[0.3em] text-smoke">{t("tmPrepare", lang)}</p>
          <div className="grid grid-cols-3 gap-3">
            {prepare.map((w) => (
              <div key={w.id} className="enter flex flex-col items-center gap-2 rounded-[18px] hairline p-3 text-center">
                <div className="flex h-24 items-end">
                  <WineVisual id={w.id} size={w.id === "audace" ? 84 : 96} />
                </div>
                <span className="font-display text-[17px] leading-tight text-pearl">{WINES[w.id].name}</span>
                <span className="text-[13px] tabular-nums text-champagne">{signed(w.change)}</span>
              </div>
            ))}
          </div>
          <p className="text-[12px] leading-relaxed text-mist">
            {others.map((w, i) => (
              <span key={w.id}>
                {WINES[w.id].name} <span className="tabular-nums text-pearl">{signed(w.change)}</span>
                {i < others.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        </div>
      </div>
      </div>
      <p className="text-[11px] text-smoke">{t("tmNote", lang)}</p>
    </article>
  );
}
