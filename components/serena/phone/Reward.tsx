"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { t } from "@/lib/i18n";
import { shareCard } from "@/lib/shareCard";
import type { Lang } from "@/lib/i18n";
import { identityFor } from "@/lib/tasting";
import { WINES, fmt } from "@/lib/wines";
import type { WineId } from "@/lib/wines";
import WineVisual from "../WineVisual";
import type { TastingResult } from "./TastingFlow";

export default function Reward({
  lang,
  result,
  wine,
  precision,
  onClose,
  onPrice,
}: {
  lang: Lang;
  result: TastingResult;
  wine: WineId;
  precision: number;
  onClose: () => void;
  onPrice: (euros: number) => void;
}) {
  const [price, setPrice] = useState<number | null>(null);
  const id = identityFor({ ...result, wine });
  const next = WINES[id.next];

  return (
    <div className="flex min-h-full flex-col items-center px-6 pb-10 pt-6">
      <div className="enter relative mt-4 flex size-[270px] items-center justify-center">
        <span aria-hidden className="pulse-ring absolute inset-0 rounded-full border border-champagne/50" />
        <span aria-hidden className="pulse-ring absolute inset-0 rounded-full border border-champagne/30" style={{ animationDelay: "1.2s" }} />
        <div
          className="flex size-full flex-col items-center justify-center rounded-full px-8 text-center"
          style={{
            background: "radial-gradient(circle at 32% 24%, #fffaf0 0%, #efdfb4 38%, #c9a55c 100%)",
            boxShadow: "0 0 70px rgba(232,214,168,.35), inset 0 -18px 40px rgba(120,86,30,.35)",
          }}
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-night/70">{t("youAre", lang)}</span>
          <span className="mt-2 font-display text-[38px] italic leading-[1.02] text-night">{id.name[lang]}</span>
          <span className="mt-3 text-[11px] tabular-nums text-night/70">
            {fmt(result.seconds, lang)} {t("seconds", lang)}
          </span>
        </div>
      </div>

      <ul className="enter mt-8 flex flex-col items-center gap-2 text-center" style={{ animationDelay: "0.2s" }}>
        {id.traits.map((tr) => (
          <li key={tr.en} className="text-[14px] text-pearl">
            {tr[lang]}
          </li>
        ))}
      </ul>

      <div className="enter mt-8 w-full" style={{ animationDelay: "0.35s" }}>
        <div className="flex justify-between text-[11px] uppercase tracking-[0.25em] text-smoke">
          <span>{t("precision", lang)}</span>
          <span className="font-display text-[18px] normal-case tracking-normal text-champagne">{precision}%</span>
        </div>
        <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-champagne/15">
          <div className="h-full rounded-full bg-champagne transition-[width] duration-1000" style={{ width: `${precision}%` }} />
        </div>
      </div>

      <div className="glass enter mt-7 flex w-full items-center gap-4 rounded-[24px] p-4" style={{ animationDelay: "0.5s" }}>
        <div className="flex h-24 w-16 items-end justify-center">
          <WineVisual id={next.id} size={next.id === "audace" ? 84 : 96} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-[0.35em] text-smoke">{t("nextTry", lang)}</span>
          <span className="font-display text-[24px] leading-none">{next.name}</span>
          <span className="text-[12px] text-mist">{next.style[lang]}</span>
        </div>
      </div>

      <div className="enter mt-7 flex w-full flex-col items-center gap-3" style={{ animationDelay: "0.65s" }}>
        <p className="text-[12px] text-mist">{price ? t("payThanks", lang) : t("payQ", lang)}</p>
        <div className="flex gap-2">
          {[8, 12, 16, 22, 30].map((p) => (
            <button
              key={p}
              data-on={price === p}
              disabled={price !== null}
              onClick={() => {
                setPrice(p);
                onPrice(p);
              }}
              className="chip px-3 py-1.5 text-[12px] tabular-nums disabled:cursor-default"
            >
              {p === 30 ? "30+" : p} €
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button
          onClick={() => shareCard(id, lang)}
          className="btn flex items-center gap-2 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.2em]"
        >
          <Share2 strokeWidth={1.6} className="size-4" />
          {t("share", lang)}
        </button>
        <button onClick={onClose} className="btn-ghost px-6 py-3 text-[12px] uppercase tracking-[0.2em]">
          {t("done", lang)}
        </button>
      </div>
    </div>
  );
}
