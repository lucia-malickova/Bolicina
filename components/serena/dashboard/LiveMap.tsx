"use client";

import { useState } from "react";
import { CITY_NAMES } from "@/lib/geo";
import type { CityStat } from "@/lib/geo";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import { CITY_XY, ITALY, MAP_H, MAP_W, NEIGHBOURS } from "@/lib/mapShapes";
import { WINES, int } from "@/lib/wines";

const LIVE_MS = 90_000;

export default function LiveMap({ stats, lang, now }: { stats: CityStat[]; lang: Lang; now: number }) {
  const [hover, setHover] = useState<string | null>(null);
  const max = Math.max(...stats.map((s) => s.n));
  const r = (n: number) => 3 + 20 * Math.sqrt(n / max);
  const labelled = new Set<string>();
  for (const s of [...stats].sort((a, b) => (b.lastLive ?? 0) - (a.lastLive ?? 0) || b.n - a.n)) {
    if (labelled.size >= 6) break;
    const [x, y] = CITY_XY[s.city];
    const clash = [...labelled].some((c) => {
      const [cx, cy] = CITY_XY[c as keyof typeof CITY_XY];
      return Math.abs(cx - x) < 60 && Math.abs(cy - y) < 16;
    });
    if (!clash) labelled.add(s.city);
  }
  const h = stats.find((s) => s.city === hover);

  return (
    <figure className="relative">
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="w-full" role="img" aria-label={t("geoTitle", lang)}>
        {NEIGHBOURS.map((d, i) => (
          <path key={i} d={d} fill="#14161c" stroke="rgba(232,214,168,.10)" strokeWidth={0.6} />
        ))}
        <path d={ITALY} fill="rgba(232,214,168,.07)" stroke="rgba(232,214,168,.45)" strokeWidth={0.8} />
        {stats.map((s) => {
          const [x, y] = CITY_XY[s.city];
          const live = s.lastLive !== undefined && now - s.lastLive < LIVE_MS;
          const on = hover === s.city;
          return (
            <g key={s.city} onMouseEnter={() => setHover(s.city)} onMouseLeave={() => setHover(null)} className="cursor-default">
              {live && (
                <circle cx={x} cy={y} r={r(s.n) + 6} fill="none" stroke="#e8d6a8" strokeWidth={1.5} className="pulse-ring" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
              )}
              <circle
                cx={x}
                cy={y}
                r={r(s.n)}
                fill={live || on ? "rgba(232,214,168,.55)" : "rgba(232,214,168,.22)"}
                stroke="rgba(243,227,182,.8)"
                strokeWidth={1}
              />
              <circle cx={x} cy={y} r={Math.max(8, r(s.n))} fill="transparent" />
              {labelled.has(s.city) && (
                <text x={x + r(s.n) + 4} y={y + 4} className={`text-[12px] ${live ? "fill-champagne font-semibold" : "fill-mist"}`}>
                  {CITY_NAMES[s.city]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {h && (
        <div
          className="pointer-events-none absolute z-10 rounded-xl border border-champagne/25 bg-night/95 px-3 py-2 text-[12px] shadow-xl"
          style={{ left: `${(CITY_XY[h.city][0] / MAP_W) * 100}%`, top: `${(CITY_XY[h.city][1] / MAP_H) * 100}%`, transform: "translate(14px,-110%)" }}
        >
          <p className="font-display text-[17px] text-pearl">{CITY_NAMES[h.city]}</p>
          <p className="text-mist">
            {int(h.n, lang)} {t("tastings", lang)}
          </p>
          <p className="text-mist">
            {t("topWine", lang)}: <span className="text-pearl">{WINES[h.top].name}</span>
          </p>
        </div>
      )}
      <figcaption className="mt-2 text-[11px] text-smoke">{t("geoNote", lang)}</figcaption>
    </figure>
  );
}
