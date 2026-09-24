"use client";

import { useMemo, useState } from "react";
import { CITY_NAMES, ITALIAN, topWine } from "@/lib/geo";
import type { CityStat } from "@/lib/geo";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import { WINES, int } from "@/lib/wines";
import type { WineId } from "@/lib/wines";
import { WORLD_H, WORLD_ITALY, WORLD_OTHERS, WORLD_W, WORLD_XY } from "@/lib/worldShapes";

const LIVE_MS = 90_000;

interface Spot {
  key: string;
  name: string;
  xy: readonly [number, number];
  n: number;
  top: WineId;
  lastLive?: number;
  cities?: string[];
}

export default function LiveMap({ stats, lang, now }: { stats: CityStat[]; lang: Lang; now: number }) {
  const [hover, setHover] = useState<string | null>(null);

  // At world scale Italian cities sit on top of each other, so they become one "Italia" bubble.
  const spots = useMemo<Spot[]>(() => {
    const italy = stats.filter((s) => ITALIAN.has(s.city));
    const merged = new Map<WineId, number>();
    italy.forEach((s) => s.wines.forEach((v, w) => merged.set(w, (merged.get(w) ?? 0) + v)));
    const abroad = stats
      .filter((s) => !ITALIAN.has(s.city))
      .map((s) => ({ key: s.city, name: CITY_NAMES[s.city], xy: WORLD_XY[s.city], n: s.n, top: topWine(s.wines), lastLive: s.lastLive }));
    const lastLive = italy.reduce<number | undefined>((m, s) => (s.lastLive === undefined ? m : Math.max(m ?? 0, s.lastLive)), undefined);
    return [
      {
        key: "italia",
        name: "Italia",
        xy: WORLD_XY.italia,
        n: italy.reduce((s, c) => s + c.n, 0),
        top: topWine(merged),
        lastLive,
        cities: [...italy].sort((a, b) => b.n - a.n).slice(0, 3).map((s) => CITY_NAMES[s.city]),
      },
      ...abroad,
    ];
  }, [stats]);

  const max = Math.max(...spots.map((s) => s.n));
  const r = (n: number) => 3 + 24 * Math.sqrt(n / max);
  const isLive = (s: Spot) => s.lastLive !== undefined && now - s.lastLive < LIVE_MS;

  const labelled = new Set<string>();
  for (const s of [...spots].sort((a, b) => Number(isLive(b)) - Number(isLive(a)) || b.n - a.n)) {
    if (labelled.size >= 10) break;
    const clash = [...labelled].some((k) => {
      const o = spots.find((x) => x.key === k)!;
      return Math.abs(o.xy[0] - s.xy[0]) < 80 && Math.abs(o.xy[1] - s.xy[1]) < 20;
    });
    if (!clash) labelled.add(s.key);
  }
  const h = spots.find((s) => s.key === hover);

  return (
    <figure className="relative">
      <svg viewBox={`0 0 ${WORLD_W} ${WORLD_H}`} className="w-full" role="img" aria-label={t("geoTitle", lang)}>
        {WORLD_OTHERS.map((d, i) => (
          <path key={i} d={d} fill="#1d2028" stroke="rgba(232,214,168,.16)" strokeWidth={0.6} />
        ))}
        <path d={WORLD_ITALY} fill="rgba(232,214,168,.25)" stroke="rgba(232,214,168,.7)" strokeWidth={0.8} />
        {[...spots].sort((a, b) => b.n - a.n).map((s) => {
          const [x, y] = s.xy;
          const live = isLive(s);
          const on = hover === s.key;
          return (
            <g key={s.key} onMouseEnter={() => setHover(s.key)} onMouseLeave={() => setHover(null)} className="cursor-default">
              {live && (
                <circle cx={x} cy={y} r={r(s.n) + 7} fill="none" stroke="#e8d6a8" strokeWidth={1.5} className="pulse-ring" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
              )}
              <circle
                cx={x}
                cy={y}
                r={r(s.n)}
                fill={live || on ? "rgba(232,214,168,.6)" : "rgba(232,214,168,.24)"}
                stroke="rgba(243,227,182,.8)"
                strokeWidth={1}
              />
              <circle cx={x} cy={y} r={Math.max(10, r(s.n))} fill="transparent" />
              {labelled.has(s.key) && (
                <text x={x + r(s.n) + 5} y={y + 5} className={`text-[14px] ${live ? "fill-champagne font-semibold" : "fill-mist"}`}>
                  {s.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {h && (
        <div
          className="pointer-events-none absolute z-10 rounded-xl border border-champagne/25 bg-night/95 px-3 py-2 text-[12px] shadow-xl"
          style={{
            left: `${(h.xy[0] / WORLD_W) * 100}%`,
            top: `${(h.xy[1] / WORLD_H) * 100}%`,
            transform: h.xy[0] > WORLD_W * 0.7 ? "translate(calc(-100% - 14px),-110%)" : "translate(14px,-110%)",
          }}
        >
          <p className="font-display text-[17px] text-pearl">{h.name}</p>
          {h.cities && <p className="text-smoke">{h.cities.join(" · ")}</p>}
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
