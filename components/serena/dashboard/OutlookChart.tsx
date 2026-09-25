"use client";

import { useRef, useState } from "react";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import { MONTHS } from "@/lib/insights";
import type { OutlookPoint } from "@/lib/insights";

const W = 430;
const H = 220;
const L = 40;
const R = 16;
const T = 16;
const B = 30;
const LINE = "#2f95b3";
const SURFACE = "#101217";

function monthLabel(offset: number, lang: Lang) {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + offset);
  return d.toLocaleDateString(lang === "it" ? "it-IT" : "en-GB", { month: "short", year: "2-digit" });
}

export default function OutlookChart({ data, lang }: { data: OutlookPoint[]; lang: Lang }) {
  const ref = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const top = Math.max(0.25, ...data.map((p) => p.hi ?? p.value)) * 1.08;
  const x = (i: number) => L + (i / (data.length - 1)) * (W - L - R);
  const y = (v: number) => T + (1 - v / top) * (H - T - B);
  const now = MONTHS - 1;
  const hist = data.filter((p) => !p.forecast);
  const fc = data.filter((p, i) => p.forecast || i === now);
  const path = (ps: OutlookPoint[], key: "value" | "lo" | "hi") =>
    ps.map((p, k) => `${k ? "L" : "M"}${x(data.indexOf(p)).toFixed(1)},${y(p[key] ?? p.value).toFixed(1)}`).join("");
  const band = `${path(fc, "hi")}${[...fc]
    .reverse()
    .map((p) => `L${x(data.indexOf(p)).toFixed(1)},${y(p.lo ?? p.value).toFixed(1)}`)
    .join("")}Z`;
  const ticks = [0, 0.1, 0.2].filter((v) => v < top);
  const pct = (v: number) => `${Math.round(v * 100)}%`;

  const onMove = (e: React.PointerEvent) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    const vx = ((e.clientX - box.left) / box.width) * W;
    const i = Math.round(((vx - L) / (W - L - R)) * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, i)));
  };

  const hp = hover !== null ? data[hover] : null;

  return (
    <figure className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-mist">
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-5 rounded-full" style={{ background: LINE }} />
          {t("history", lang)}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-5 border-t-2 border-dashed" style={{ borderColor: LINE }} />
          {t("forecast", lang)}
        </span>
      </div>
      <div className="relative">
        <svg
          ref={ref}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full touch-none"
          role="img"
          aria-label={t("outTitle", lang)}
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
        >
          {ticks.map((v) => (
            <g key={v}>
              <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="rgba(232,214,168,.08)" />
              <text x={L - 8} y={y(v) + 3} textAnchor="end" className="fill-smoke text-[10px] tabular-nums">
                {pct(v)}
              </text>
            </g>
          ))}
          <path d={band} fill={LINE} opacity={0.14} />
          <line x1={x(now)} x2={x(now)} y1={T} y2={H - B} stroke="rgba(232,214,168,.35)" strokeDasharray="2 4" />
          <text x={x(now)} y={H - 8} textAnchor="middle" className="fill-champagne text-[10px] uppercase tracking-[0.2em]">
            {lang === "it" ? "oggi" : "today"}
          </text>
          {data.map((_, i) =>
            i % 6 === 2 && Math.abs(i - now) > 2 ? (
              <text key={i} x={x(i)} y={H - 8} textAnchor="middle" className="fill-smoke text-[10px]">
                {monthLabel(i - now, lang)}
              </text>
            ) : null,
          )}
          <path d={path(hist, "value")} fill="none" stroke={LINE} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          <path d={path(fc, "value")} fill="none" stroke={LINE} strokeWidth={2} strokeDasharray="5 5" strokeLinecap="round" />
          <circle cx={x(now)} cy={y(data[now].value)} r={5} fill={LINE} stroke={SURFACE} strokeWidth={2} />
          <circle cx={x(data.length - 1)} cy={y(data[data.length - 1].value)} r={5} fill={LINE} stroke={SURFACE} strokeWidth={2} />
          <text x={x(data.length - 1) - 8} y={y(data[data.length - 1].value) - 12} textAnchor="end" className="fill-pearl text-[13px] font-semibold tabular-nums">
            {pct(data[data.length - 1].value)}
          </text>
          <text x={x(now) - 8} y={y(data[now].value) - 12} textAnchor="end" className="fill-pearl text-[13px] font-semibold tabular-nums">
            {pct(data[now].value)}
          </text>
          {hp && hover !== null && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={T} y2={H - B} stroke="rgba(243,238,228,.35)" />
              <circle cx={x(hover)} cy={y(hp.value)} r={5} fill={LINE} stroke={SURFACE} strokeWidth={2} />
            </g>
          )}
        </svg>
        {hp && hover !== null && (
          <div
            className="pointer-events-none absolute top-2 z-10 rounded-xl border border-champagne/25 bg-night/95 px-3 py-2 text-[12px] shadow-xl"
            style={{ left: `${(x(hover) / W) * 100}%`, transform: hover > data.length / 2 ? "translateX(calc(-100% - 12px))" : "translateX(12px)" }}
          >
            <p className="text-smoke">
              {monthLabel(hover - now, lang)} · {hp.forecast ? t("forecast", lang) : t("history", lang)}
            </p>
            <p className="font-display text-[20px] tabular-nums text-pearl">{pct(hp.value)}</p>
            {hp.forecast && hp.lo !== undefined && hp.hi !== undefined && (
              <p className="tabular-nums text-smoke">
                {pct(hp.lo)} – {pct(hp.hi)}
              </p>
            )}
          </div>
        )}
      </div>
      <figcaption className="text-[11px] text-smoke">{t("outNote", lang)}</figcaption>
    </figure>
  );
}
