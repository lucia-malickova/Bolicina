import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import { MOMENTS, MOODS } from "@/lib/personas";
import type { Tasting } from "@/lib/tasting";
import { AROMAS, WINES, fmt } from "@/lib/wines";

const AGAIN = { yes: "yes", maybe: "maybe", no: "no" } as const;

export default function LiveFeed({ tastings, lang }: { tastings: Tasting[]; lang: Lang }) {
  const latest = [...tastings].reverse().slice(0, 6);
  if (!latest.length) return <p className="text-[13px] leading-relaxed text-mist">{t("feedEmpty", lang)}</p>;
  return (
    <ol className="flex flex-col">
      {latest.map((x) => (
        <li key={x.id} className="enter flash-in flex flex-col gap-1.5 rounded-xl border-t border-champagne/10 px-2 py-3 first:border-t-0">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-display text-[18px] leading-none text-pearl">{WINES[x.wine].name}</span>
            <span className="text-[11px] tabular-nums text-champagne">
              {fmt(x.seconds, lang)} {t("seconds", lang)}
            </span>
          </div>
          <span className="text-[11px] text-mist">
            {x.name} · {x.segment}
            {x.mood ? ` · ${MOODS[x.mood][lang]}` : ""}
            {x.moment ? ` · ${MOMENTS[x.moment][lang]}` : ""}
          </span>
          <span className="text-[11px] text-smoke">
            {fmt(x.sweet, lang)}/5 · {AROMAS[x.aroma][lang]} · {t(AGAIN[x.again], lang)}
          </span>
        </li>
      ))}
    </ol>
  );
}
