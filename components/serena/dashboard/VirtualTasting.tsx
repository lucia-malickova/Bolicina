"use client";

import { useMemo, useState } from "react";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import type { Row } from "@/lib/insights";
import { virtualPanel } from "@/lib/simulate";
import type { NewWine } from "@/lib/simulate";
import type { Bubbles } from "@/lib/tasting";
import { AROMAS, WINES, fmt, kcalFor } from "@/lib/wines";
import type { Aroma } from "@/lib/wines";
import WineVisual from "../WineVisual";

const BAR = "#b8893a";
const BUBBLES: [Bubbles, "bDelicate" | "bLively" | "bExplosive"][] = [
  ["delicate", "bDelicate"],
  ["lively", "bLively"],
  ["explosive", "bExplosive"],
];

function dosage(g: number) {
  if (g <= 6) return "Extra Brut";
  if (g <= 12) return "Brut";
  if (g <= 17) return "Extra Dry";
  if (g <= 32) return "Dry";
  return "Demi-Sec";
}

export default function VirtualTasting({ rows, lang }: { rows: Row[]; lang: Lang }) {
  const [w, setW] = useState<NewWine>({ sugar: 8, abv: 9, aroma: "yellowFruit", bubbles: "lively" });
  const res = useMemo(() => virtualPanel(rows, w), [rows, w]);
  const set = (patch: Partial<NewWine>) => setW((prev) => ({ ...prev, ...patch }));

  return (
    <article className="flex flex-col gap-6 rounded-[26px] bg-deep p-6 hairline sm:p-7">
      <div className="flex flex-col gap-1.5">
        <h3 className="font-display text-[28px] leading-tight">{t("vtTitle", lang)}</h3>
        <p className="max-w-[560px] text-[13px] leading-relaxed text-mist">{t("vtLead", lang)}</p>
      </div>

      <div className="@container">
        <div className="grid grid-cols-1 gap-8 @xl:grid-cols-2">
          <div className="flex flex-col gap-5">
            <Slider
              label={t("vtSugar", lang)}
              value={`${w.sugar} g/l · ${dosage(w.sugar)}`}
              min={0}
              max={50}
              step={1}
              v={w.sugar}
              onChange={(sugar) => set({ sugar })}
            />
            <Slider
              label={t("vtAbv", lang)}
              value={`${fmt(w.abv, lang, w.abv % 1 ? 1 : 0)}%`}
              min={0}
              max={12.5}
              step={0.5}
              v={w.abv}
              onChange={(abv) => set({ abv })}
            />
            <Chips
              label={t("vtAroma", lang)}
              options={(Object.keys(AROMAS) as Aroma[]).map((a) => [a, AROMAS[a][lang]])}
              value={w.aroma}
              onChange={(aroma) => set({ aroma })}
            />
            <Chips
              label={t("vtBubbles", lang)}
              options={BUBBLES.map(([b, k]) => [b, t(k, lang)])}
              value={w.bubbles}
              onChange={(bubbles) => set({ bubbles })}
            />
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-smoke">{t("vtAppeal", lang)}</p>
            <ul className="flex flex-col gap-2.5">
              {res.bySegment.map((s) => (
                <li key={s.segment} className="grid grid-cols-[48px_1fr_40px] items-center gap-3 text-[12px]">
                  <span className="tabular-nums text-mist">{s.segment}</span>
                  <span className="h-2.5 overflow-hidden rounded-full bg-champagne/8">
                    <span
                      className="block h-full rounded-full transition-[width] duration-500"
                      style={{ width: `${s.appeal}%`, background: BAR, opacity: s.segment === res.best ? 1 : 0.55 }}
                    />
                  </span>
                  <span className="text-right tabular-nums text-pearl">{s.appeal}%</span>
                </li>
              ))}
            </ul>
            <p className="font-display text-[21px] leading-snug text-pearl">
              {t("vtBest", lang)} <span className="italic text-champagne">{res.best}</span>
              {lang === "it" ? " anni." : "."}
            </p>
            <div className="flex items-center gap-3 rounded-[18px] hairline p-3">
              <div className="flex h-16 w-10 items-end justify-center">
                <WineVisual id={res.closest} size={res.closest === "audace" ? 52 : 64} />
              </div>
              <div className="flex flex-col text-[12px]">
                <span className="text-smoke">{t("vtClosest", lang)}</span>
                <span className="font-display text-[19px] leading-tight text-pearl">{WINES[res.closest].name}</span>
                <span className={res.overlap ? "text-champagne" : "text-mist"}>{res.overlap ? t("vtOverlap", lang) : t("vtDistinct", lang)}</span>
              </div>
              <div className="ml-auto text-right">
                <span className="font-display text-[26px] leading-none text-pearl">≈ {kcalFor(w.abv, w.sugar)}</span>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-smoke">kcal · {t("perGlass", lang)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-[11px] text-smoke">{t("vtNote", lang)}</p>
    </article>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  v,
  onChange,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  v: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="flex items-baseline justify-between text-[12px]">
        <span className="text-mist">{label}</span>
        <span className="font-display text-[20px] tabular-nums text-pearl">{value}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={v} onChange={(e) => onChange(Number(e.target.value))} className="sweet-range" />
    </label>
  );
}

function Chips<K extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: [K, string][];
  value: K;
  onChange: (k: K) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[12px] text-mist">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map(([k, l]) => (
          <button key={k} data-on={value === k} onClick={() => onChange(k)} className="chip px-3.5 py-1.5 text-[12px]">
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}
