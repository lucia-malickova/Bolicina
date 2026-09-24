"use client";

import { useState } from "react";
import { Gift } from "lucide-react";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import type { Fit } from "@/lib/sommelier";
import { WINES, fmt, kcalPerGlass, sugarPerGlass } from "@/lib/wines";
import type { WineId } from "@/lib/wines";
import WineVisual from "../WineVisual";

const FIT_KEY = { match: "matchYou", sweeter: "sweeterThanYou", drier: "drierThanYou" } as const;

export default function WineCard({
  id,
  lang,
  fit,
  memory,
  onTaste,
  onGift,
}: {
  id: WineId;
  lang: Lang;
  fit?: Fit;
  memory?: string;
  onTaste: () => void;
  onGift?: () => void;
}) {
  const w = WINES[id];
  const [ordered, setOrdered] = useState(false);

  return (
    <article className="glass enter relative overflow-hidden rounded-[30px] p-5">
      <div aria-hidden className="absolute -right-20 -top-20 size-56 rounded-full blur-3xl" style={{ background: `${w.accent}30` }} />
      <div className="relative flex items-end gap-4">
        <WineVisual id={id} size={200} />
        <div className="flex min-w-0 flex-col gap-1.5 pb-2">
          <span className="text-[10px] uppercase tracking-[0.38em] text-champagne">{t("forYou", lang)}</span>
          <h3 className="font-display text-[34px] leading-[0.95] text-pearl">{w.name}</h3>
          <span className="text-[12px] leading-snug text-mist">{w.style[lang]}</span>
          {w.badge && <span className="mt-1 text-[11px] leading-snug text-champagne/90">{w.badge[lang]}</span>}
        </div>
      </div>

      {fit && (
        <p className="relative mt-4 flex items-center gap-2 text-[13px] text-pearl">
          <span className={`size-2 rounded-full ${fit === "match" ? "bg-champagne" : "border border-champagne"}`} />
          {t(FIT_KEY[fit], lang)}
        </p>
      )}

      {memory && <p className="relative mt-2 text-[13px] italic text-champagne">{memory}</p>}

      <p className="relative mt-3 text-[13px] leading-relaxed text-mist">{w.pitch[lang]}</p>

      <dl className="relative mt-5 grid grid-cols-3 divide-x divide-champagne/15 rounded-[18px] hairline py-3 text-center">
        <Stat value={`≈ ${kcalPerGlass(w)}`} unit="kcal" label={t("perGlass", lang)} />
        <Stat value={fmt(sugarPerGlass(w), lang)} unit="g" label={t("sugar", lang)} />
        <Stat value={fmt(w.abv, lang, w.abv % 1 ? 1 : 0)} unit="%" label={t("alcohol", lang)} />
      </dl>
      <p className="relative mt-2 text-center text-[10px] tracking-wide text-smoke">
        {t("serve", lang)} {w.serve} · 125 ml
      </p>

      <div className="relative mt-5 flex gap-3">
        <button onClick={onTaste} className="btn flex-1 py-3.5 text-[13px] font-semibold uppercase tracking-[0.18em]">
          {t("tasteNow", lang)}
        </button>
        <button onClick={() => setOrdered(true)} className="btn-ghost px-5 py-3.5 text-[13px] uppercase tracking-[0.18em]">
          {t("order", lang)}
        </button>
        {onGift && (
          <button onClick={onGift} aria-label={t("gift", lang)} className="btn-ghost flex size-[50px] shrink-0 items-center justify-center">
            <Gift strokeWidth={1.4} className="size-5" />
          </button>
        )}
      </div>
      {ordered && <p className="enter relative mt-3 text-center text-[11px] text-champagne">{t("orderSoon", lang)}</p>}
    </article>
  );
}

function Stat({ value, unit, label }: { value: string; unit: string; label: string }) {
  return (
    <div className="flex flex-col-reverse items-center gap-0.5 px-1">
      <dt className="text-[9px] uppercase tracking-[0.25em] text-smoke">{label}</dt>
      <dd className="font-display text-[24px] leading-none text-pearl">
        {value}
        <span className="ml-0.5 text-[13px] text-champagne">{unit}</span>
      </dd>
    </div>
  );
}
