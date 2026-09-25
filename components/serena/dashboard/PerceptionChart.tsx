"use client";

import { useState } from "react";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import type { Perception } from "@/lib/insights";
import { WINES, fmt, int } from "@/lib/wines";

const W = 540;
const L = 130;
const R = 44;
const T = 34;
const ROW = 38;
const REAL = "#b8893a";
const PERC = "#2f95b3";
const SURFACE = "#101217";

export default function PerceptionChart({ data, lang }: { data: Perception[]; lang: Lang }) {
  const [hover, setHover] = useState<number | null>(null);
  const H = T + data.length * ROW + 8;
  const x = (v: number) => L + ((v - 1) / 4) * (W - L - R);
  const y = (i: number) => T + i * ROW + ROW / 2;
  const gaps = data.map((d) => d.perceived - d.real);
  const maxUp = gaps.indexOf(Math.max(...gaps));
  const maxDown = gaps.indexOf(Math.min(...gaps));

  return (
    <figure className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-mist">
        <Legend color={REAL} label={t("real", lang)} />
        <Legend color={PERC} label={t("perceived", lang)} />
      </div>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={t("gapTitle", lang)}>
          {[1, 2, 3, 4, 5].map((v) => (
            <line key={v} x1={x(v)} x2={x(v)} y1={T - 8} y2={H - 4} stroke="rgba(232,214,168,.08)" />
          ))}
          {(
            [
              [1, "dry"],
              [3, "balanced"],
              [5, "sweet"],
            ] as const
          ).map(([v, k]) => (
            <text key={k} x={x(v)} y={14} textAnchor="middle" className="fill-smoke text-[10px] uppercase tracking-[0.2em]">
              {t(k, lang)}
            </text>
          ))}
          {data.map((d, i) => {
            const gap = gaps[i];
            const lo = Math.min(d.real, d.perceived);
            const hi = Math.max(d.real, d.perceived);
            const faded = hover !== null && hover !== i;
            return (
              <g
                key={d.wine}
                opacity={faded ? 0.35 : 1}
                className="transition-opacity"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                <rect x={0} y={y(i) - ROW / 2} width={W} height={ROW} fill="transparent" />
                <text x={0} y={y(i) + 4} className="fill-pearl text-[13px]">
                  {WINES[d.wine].name}
                </text>
                <line x1={x(lo)} x2={x(hi)} y1={y(i)} y2={y(i)} stroke="rgba(232,214,168,.28)" strokeWidth={2} strokeLinecap="round" />
                <circle cx={x(d.real)} cy={y(i)} r={6} fill={REAL} stroke={SURFACE} strokeWidth={2} />
                <circle cx={x(d.perceived)} cy={y(i)} r={6} fill={PERC} stroke={SURFACE} strokeWidth={2} />
                {(i === maxUp || i === maxDown) && (
                  <text
                    x={x(gap > 0 ? d.perceived : d.real) + 12}
                    y={y(i) + 4}
                    className="fill-pearl text-[12px] font-semibold tabular-nums"
                  >
                    {gap > 0 ? "+" : "−"}
                    {fmt(Math.abs(gap), lang)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        {hover !== null && (
          <div
            className="pointer-events-none absolute z-10 min-w-[190px] rounded-xl border border-champagne/25 bg-night/95 px-3.5 py-2.5 text-[12px] shadow-xl"
            style={{ left: `${(x(Math.max(data[hover].real, data[hover].perceived)) / W) * 100}%`, top: `${(y(hover) / H) * 100}%`, transform: "translate(16px,-50%)" }}
          >
            <p className="font-display text-[17px] text-pearl">{WINES[data[hover].wine].name}</p>
            <p className="mt-1 flex items-center gap-2 text-mist">
              <span className="size-2 rounded-full" style={{ background: REAL }} />
              {t("real", lang)}: <span className="ml-auto tabular-nums text-pearl">{fmt(data[hover].real, lang)}</span>
            </p>
            <p className="flex items-center gap-2 text-mist">
              <span className="size-2 rounded-full" style={{ background: PERC }} />
              {t("perceived", lang)}: <span className="ml-auto tabular-nums text-pearl">{fmt(data[hover].perceived, lang)}</span>
            </p>
            <p className="mt-1 text-smoke">
              {int(data[hover].n, lang)} {t("tastings", lang)}
            </p>
          </div>
        )}
      </div>
      <figcaption className="flex flex-col gap-1.5 text-[13px] text-mist">
        <Insight name={WINES[data[maxUp].wine].name} note={t("gapNote", lang)} gap={gaps[maxUp]} lang={lang} />
        <Insight name={WINES[data[maxDown].wine].name} note={t("gapNoteDry", lang)} gap={gaps[maxDown]} lang={lang} />
      </figcaption>
      <table className="sr-only">
        <caption>{t("gapTitle", lang)}</caption>
        <thead>
          <tr>
            <th>Wine</th>
            <th>{t("real", lang)}</th>
            <th>{t("perceived", lang)}</th>
            <th>n</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.wine}>
              <td>{WINES[d.wine].name}</td>
              <td>{fmt(d.real, lang)}</td>
              <td>{fmt(d.perceived, lang)}</td>
              <td>{d.n}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="size-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function Insight({ name, note, gap, lang }: { name: string; note: string; gap: number; lang: Lang }) {
  return (
    <p>
      <span className="font-display text-[17px] text-pearl">{name}</span> · {note}{" "}
      <span className="tabular-nums text-pearl">
        ({gap > 0 ? "+" : "−"}
        {fmt(Math.abs(gap), lang)})
      </span>
    </p>
  );
}
