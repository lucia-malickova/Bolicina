"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import type { Row } from "@/lib/insights";
import { lotQuality } from "@/lib/market";
import { WINES } from "@/lib/wines";
import type { WineId } from "@/lib/wines";

const CHOICES: WineId[] = ["medea", "valdobbiadene", "audace", "bio"];
const BAR = "#b8893a";

export default function LotQuality({ rows, lang }: { rows: Row[]; lang: Lang }) {
  const [wine, setWine] = useState<WineId>("medea");
  const lots = useMemo(() => lotQuality(rows, wine), [rows, wine]);
  const mean = lots.reduce((s, l) => s + l.fresh, 0) / lots.length;
  const flagged = lots.find((l) => l.flagged);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {CHOICES.map((w) => (
          <button key={w} data-on={wine === w} onClick={() => setWine(w)} className="chip px-3.5 py-1.5 text-[12px]">
            {WINES[w].name}
          </button>
        ))}
      </div>
      <p className="text-[10px] uppercase tracking-[0.3em] text-smoke">{t("lotFresh", lang)}</p>
      <ul className="flex flex-col gap-2.5">
        {lots.map((l) => (
          <li key={l.lot} className="grid grid-cols-[72px_1fr_44px] items-center gap-3 text-[12px]">
            <span className="flex items-center gap-1 font-mono text-[11px] text-mist">
              {l.flagged && <AlertTriangle strokeWidth={1.8} className="size-3 text-[#e07a5f]" aria-label="!" />}
              {l.lot}
            </span>
            <span className="h-2.5 overflow-hidden rounded-full bg-champagne/8">
              <span
                className="block h-full rounded-full transition-[width] duration-500"
                style={{ width: `${Math.round(l.fresh * 100)}%`, background: l.flagged ? "#e07a5f" : BAR }}
              />
            </span>
            <span className="text-right tabular-nums text-pearl">{Math.round(l.fresh * 100)}%</span>
          </li>
        ))}
      </ul>
      <p className={`text-[13px] leading-relaxed ${flagged ? "text-pearl" : "text-mist"}`}>
        {flagged
          ? t("lotFlag", lang)
              .replace("{l}", flagged.lot)
              .replace("{d}", String(Math.round((mean - flagged.fresh) * 100)))
          : t("lotOk", lang)}
      </p>
      <p className="text-[11px] text-smoke">{t("lotNote", lang)}</p>
    </div>
  );
}
