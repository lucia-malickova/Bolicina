"use client";

import { useMemo, useState } from "react";
import { CloudRain, Minus, Plus, Sun, SunMedium, Thermometer } from "lucide-react";
import { CHILL, SOURCES, heatOf, pickTonight } from "@/lib/cellar";
import type { Bottle, Source } from "@/lib/cellar";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import { MOODS } from "@/lib/personas";
import type { Mood } from "@/lib/personas";
import { useWeather } from "@/lib/useWeather";
import { WINES, WINE_IDS } from "@/lib/wines";
import type { WineId } from "@/lib/wines";
import WineVisual from "../WineVisual";

const DAY = 86_400_000;
const HEAT_ICON = { hot: Sun, mild: SunMedium, cold: CloudRain };

export default function Cellar({
  lang,
  bottles,
  at,
  usualSweet,
  onAdd,
  onRemove,
  onOpen,
}: {
  lang: Lang;
  bottles: Bottle[];
  /** A city to look up (demo guests); without it the phone's own position is used. */
  at?: { lat: number; lon: number; place: string };
  usualSweet: number | null;
  onAdd: (wine: WineId, source?: Source) => void;
  onRemove: (wine: WineId) => void;
  onOpen: (b: Bottle, mood?: Mood) => void;
}) {
  const { weather, setManual: onManual } = useWeather(at);
  const [mood, setMood] = useState<Mood | undefined>();
  const [adding, setAdding] = useState(false);
  const [addWine, setAddWine] = useState<WineId>("medea");
  const [source, setSource] = useState<Source | undefined>();
  const now = useMemo(() => Date.now(), [bottles.length]);
  const picks = useMemo(() => pickTonight(bottles, { tMax: weather.tMax, mood, usualSweet, now }), [bottles, weather.tMax, mood, usualSweet, now]);
  const top = picks[0];
  const HeatIcon = HEAT_ICON[heatOf(weather.tMax)];

  const groups = WINE_IDS.map((id) => {
    const bs = bottles.filter((b) => b.wine === id);
    return { id, n: bs.length, oldest: bs.reduce((m, b) => Math.min(m, b.added), Infinity) };
  }).filter((g) => g.n > 0);

  return (
    <div className="enter flex flex-col px-5 pb-10">
      <h2 className="font-display text-[34px] italic leading-tight">{t("cellar", lang)}</h2>
      <p className="text-[12px] text-mist">
        {bottles.length} {t("cellarCount", lang)}
      </p>

      <div className="mt-4 flex items-center gap-3 rounded-full hairline py-1.5 pl-3 pr-1.5">
        <HeatIcon strokeWidth={1.4} className="size-5 text-champagne" />
        <span className="flex-1 text-[12px] text-pearl">
          {t("cellarToday", lang)} <b className="font-display text-[18px] font-normal">{Math.round(weather.tMax)} °C</b>
          {weather.place ? ` · ${weather.place}` : ""}
          <span className="ml-1 text-[10px] text-smoke">
            · {t(weather.source === "live" ? "cellarLive" : weather.source === "manual" ? "cellarManual" : "cellarEstimate", lang)}
          </span>
        </span>
        {[31, 22, 12].map((v) => (
          <button
            key={v}
            data-on={weather.source === "manual" && Math.round(weather.tMax) === v}
            onClick={() => onManual(weather.source === "manual" && Math.round(weather.tMax) === v ? null : v)}
            className="chip px-2 py-1 text-[10px] tabular-nums"
            aria-label={`${v} °C`}
          >
            {v}°
          </button>
        ))}
      </div>

      <p className="mt-5 text-[10px] uppercase tracking-[0.35em] text-smoke">{t("cellarMood", lang)}</p>
      <div className="no-scrollbar -mx-5 mt-2 flex gap-2 overflow-x-auto px-5 pb-1">
        {(Object.keys(MOODS) as Mood[]).map((m) => (
          <button key={m} data-on={mood === m} onClick={() => setMood(mood === m ? undefined : m)} className="chip shrink-0 px-3.5 py-1.5 text-[12px]">
            {MOODS[m][lang]}
          </button>
        ))}
      </div>

      {top ? (
        <article key={`${top.bottle.wine}-${mood}-${Math.round(weather.tMax)}`} className="glass enter relative mt-5 overflow-hidden rounded-[28px] p-5">
          <div aria-hidden className="absolute -right-16 -top-16 size-48 rounded-full blur-3xl" style={{ background: `${WINES[top.bottle.wine].accent}33` }} />
          <div className="relative flex items-end gap-4">
            <WineVisual id={top.bottle.wine} size={170} />
            <div className="flex flex-col gap-1 pb-2">
              <span className="text-[10px] uppercase tracking-[0.35em] text-champagne">{t("cellarTonight", lang)}</span>
              <span className="font-display text-[30px] leading-none">{WINES[top.bottle.wine].name}</span>
              <span className="text-[12px] text-mist">{WINES[top.bottle.wine].style[lang]}</span>
            </div>
          </div>
          <ul className="relative mt-4 flex flex-col gap-1.5">
            {top.reasons.map((r) => (
              <li key={r.en} className="flex gap-2 text-[13px] leading-snug text-pearl">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-champagne" />
                {r[lang]}
              </li>
            ))}
          </ul>
          <p className="relative mt-3 flex gap-2 text-[12px] leading-snug text-mist">
            <Thermometer strokeWidth={1.4} className="mt-0.5 size-4 shrink-0 text-champagne" />
            {t("cellarChill", lang)} {WINES[top.bottle.wine].serve}: {CHILL[lang]}
          </p>
          <button onClick={() => onOpen(top.bottle, mood)} className="btn relative mt-4 w-full py-3.5 text-[13px] font-semibold uppercase tracking-[0.2em]">
            {t("cellarOpen", lang)}
          </button>
        </article>
      ) : (
        <p className="mt-6 text-[13px] text-mist">{t("cellarEmpty", lang)}</p>
      )}

      <div className="mt-7 flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.35em] text-smoke">{t("cellarYours", lang)}</p>
        <button onClick={() => setAdding((a) => !a)} className="chip flex items-center gap-1 px-3 py-1.5 text-[11px] text-champagne">
          <Plus strokeWidth={1.6} className="size-3.5" />
          {t("cellarAdd", lang)}
        </button>
      </div>

      {adding && (
        <div className="glass enter mt-3 flex flex-col gap-3 rounded-[22px] p-4">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
            {WINE_IDS.map((id) => (
              <button
                key={id}
                onClick={() => setAddWine(id)}
                data-on={addWine === id}
                aria-label={WINES[id].name}
                className="orb flex size-[70px] shrink-0 items-center justify-center overflow-hidden"
              >
                <WineVisual id={id} size={id === "audace" ? 80 : 62} />
              </button>
            ))}
          </div>
          <p className="text-[12px] text-pearl">{WINES[addWine].name}</p>
          <p className="text-[11px] text-smoke">{t("cellarWhere", lang)}</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(SOURCES) as Source[]).map((s) => (
              <button key={s} data-on={source === s} onClick={() => setSource(source === s ? undefined : s)} className="chip px-3 py-1.5 text-[11px]">
                {SOURCES[s][lang]}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] text-smoke">{t("cellarAddHint", lang)}</span>
            <button
              onClick={() => {
                onAdd(addWine, source);
                setAdding(false);
              }}
              className="btn shrink-0 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em]"
            >
              {t("cellarDone", lang)}
            </button>
          </div>
        </div>
      )}

      <ul className="mt-3 grid grid-cols-2 gap-3">
        {groups.map((g) => {
          const months = Math.floor((Date.now() - g.oldest) / (30 * DAY));
          return (
            <li key={g.id} className="flex flex-col items-center gap-2 rounded-[20px] p-3 hairline">
              <div className="relative flex h-24 items-end">
                <WineVisual id={g.id} size={g.id === "audace" ? 84 : 96} />
                <span className="absolute -right-3 -top-1 flex size-6 items-center justify-center rounded-full bg-champagne text-[11px] font-semibold text-night">
                  {g.n}
                </span>
              </div>
              <span className="text-center font-display text-[16px] leading-tight">{WINES[g.id].name}</span>
              <span className="text-[10px] text-smoke">{months < 1 ? t("cellarNew", lang) : t("cellarSince", lang).replace("{m}", String(months))}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => onRemove(g.id)} aria-label="−" className="chip flex size-7 items-center justify-center">
                  <Minus strokeWidth={1.6} className="size-3.5" />
                </button>
                <button onClick={() => onAdd(g.id)} aria-label="+" className="chip flex size-7 items-center justify-center">
                  <Plus strokeWidth={1.6} className="size-3.5" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
