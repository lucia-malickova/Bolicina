"use client";

import { useEffect, useState } from "react";
import { Share2, X } from "lucide-react";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import { shareCard } from "@/lib/shareCard";
import type { Identity } from "@/lib/tasting";
import { WINES } from "@/lib/wines";
import type { WineId } from "@/lib/wines";
import Bubbles from "../Bubbles";
import WineVisual from "../WineVisual";

export interface WrappedData {
  year: number;
  count: number;
  percentile: number;
  wine: WineId;
  drift: string;
  cities: string[];
  identity: Identity;
}

const SLIDE_MS = 3400;

export default function Wrapped({ lang, d, onClose }: { lang: Lang; d: WrappedData; onClose: () => void }) {
  const slides = d.count === 0 ? 1 : 6;
  const [i, setI] = useState(0);
  const last = i === slides - 1;

  useEffect(() => {
    if (last) return;
    const id = setTimeout(() => setI((n) => n + 1), SLIDE_MS);
    return () => clearTimeout(id);
  }, [i, last]);

  const tint = ["#2a2418", "#1e2a2c", "#2a1f24", "#1f2433", "#232a1d", "#2a2418"][i % 6];

  return (
    <div
      className="absolute inset-0 z-40 flex flex-col overflow-hidden px-6 pb-10 pt-14 transition-[background] duration-700"
      style={{ background: `radial-gradient(100% 70% at 50% 20%, ${tint} 0%, #0a0b0e 75%)` }}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        if ((e.target as HTMLElement).closest("button")) return;
        setI((n) => Math.max(0, Math.min(slides - 1, n + (e.clientX - r.left > r.width / 3 ? 1 : -1))));
      }}
    >
      <Bubbles count={22} height={820} />
      <div className="relative flex gap-1.5">
        {Array.from({ length: slides }, (_, k) => (
          <span key={k} className="h-[3px] flex-1 overflow-hidden rounded-full bg-champagne/20">
            <span
              key={k === i ? `on-${i}` : "off"}
              className="block h-full bg-champagne"
              style={
                k === i && !last
                  ? { animation: `grow ${SLIDE_MS}ms linear forwards` }
                  : { width: k <= i ? "100%" : "0%" }
              }
            />
          </span>
        ))}
      </div>
      <button onClick={onClose} aria-label={t("back", lang)} className="relative mt-3 self-end text-champagne">
        <X strokeWidth={1.4} className="size-6" />
      </button>

      <div key={i} className="enter relative flex flex-1 flex-col items-center justify-center text-center">
        {d.count === 0 && <p className="font-display text-[34px] italic leading-tight">{t("wrEmpty", lang)}</p>}
        {d.count > 0 && i === 0 && (
          <>
            <p className="text-[11px] uppercase tracking-[0.4em] text-smoke">Bollicine</p>
            <p className="mt-4 font-display text-[54px] italic leading-[1] text-champagne">
              {t("wrIntro", lang).replace("{y}", String(d.year))}
            </p>
          </>
        )}
        {i === 1 && (
          <>
            <p className="font-display text-[120px] leading-none tabular-nums text-pearl">{d.count}</p>
            <p className="mt-2 text-[16px] text-mist">{t("wrGlasses", lang)}</p>
            <p className="mt-6 font-display text-[22px] italic text-champagne">{t("wrMore", lang).replace("{p}", String(d.percentile))}</p>
          </>
        )}
        {i === 2 && (
          <>
            <p className="text-[11px] uppercase tracking-[0.4em] text-smoke">{t("wrWine", lang)}</p>
            <div className="mt-5">
              <WineVisual id={d.wine} size={280} />
            </div>
            <p className="mt-4 font-display text-[38px] leading-none">{WINES[d.wine].name}</p>
          </>
        )}
        {i === 3 && (
          <>
            <p className="text-[11px] uppercase tracking-[0.4em] text-smoke">{t("wrTaste", lang)}</p>
            <p className="mt-6 font-display text-[40px] italic leading-tight text-champagne">{d.drift}</p>
          </>
        )}
        {i === 4 && (
          <>
            <p className="text-[11px] uppercase tracking-[0.4em] text-smoke">{t("wrCities", lang)}</p>
            <div className="mt-6 flex flex-col gap-2">
              {d.cities.map((c, k) => (
                <p key={c} className="enter font-display text-[40px] leading-tight text-pearl" style={{ animationDelay: `${k * 0.35}s` }}>
                  {c}
                </p>
              ))}
            </div>
          </>
        )}
        {i === 5 && (
          <>
            <p className="text-[11px] uppercase tracking-[0.4em] text-smoke">{t("wrYou", lang)}</p>
            <div
              className="mt-6 flex size-[230px] items-center justify-center rounded-full px-6"
              style={{ background: "radial-gradient(circle at 32% 24%, #fffaf0 0%, #efdfb4 38%, #c9a55c 100%)", boxShadow: "0 0 70px rgba(232,214,168,.35)" }}
            >
              <span className="font-display text-[36px] italic leading-[1.02] text-night">{d.identity.name[lang]}</span>
            </div>
            <button
              onClick={() => shareCard(d.identity, lang)}
              className="btn mt-8 flex items-center gap-2 px-7 py-3 text-[12px] font-semibold uppercase tracking-[0.2em]"
            >
              <Share2 strokeWidth={1.6} className="size-4" />
              {t("share", lang)}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
