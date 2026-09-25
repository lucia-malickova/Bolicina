import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import type { Missing, NewWine } from "@/lib/simulate";
import { AROMAS, dosage, fmt } from "@/lib/wines";

export default function MissingWine({ m, lang, onTry }: { m: Missing | null; lang: Lang; onTry: (spec: NewWine) => void }) {
  return (
    <article className="flex flex-col gap-4 rounded-[26px] p-6 sm:p-7" style={{ background: "linear-gradient(160deg, rgba(232,214,168,.09), rgba(16,18,23,1) 55%)", border: "1px solid rgba(232,214,168,.3)" }}>
      <div className="flex flex-col gap-1.5">
        <h3 className="font-display text-[28px] italic leading-tight text-champagne">{t("mwTitle", lang)}</h3>
        <p className="text-[13px] text-mist">{t("mwLead", lang)}</p>
      </div>
      {m ? (
        <>
          <p className="font-display text-[24px] leading-snug text-pearl">
            {dosage(m.spec.sugar)} · {m.spec.sugar} g/l · {m.spec.abv === 0 ? "0,0%" : `${fmt(m.spec.abv, lang, m.spec.abv % 1 ? 1 : 0)}%`} · {AROMAS[m.spec.aroma][lang]}
          </p>
          <p className="text-[14px] leading-relaxed text-mist">
            {t("mwFor", lang)} <span className="text-pearl">{m.segment}</span> {t("mwYears", lang)}{" "}
            <span className="tabular-nums text-pearl">{m.from}%</span> {t("mwTo", lang)}{" "}
            <span className="font-display text-[22px] tabular-nums text-champagne">{m.to}%</span>.
          </p>
          <button onClick={() => onTry(m.spec)} className="btn-ghost self-start px-5 py-2.5 text-[11px] uppercase tracking-[0.2em]">
            {t("mwTry", lang)} →
          </button>
        </>
      ) : (
        <p className="text-[14px] text-mist">{t("mwNone", lang)}</p>
      )}
    </article>
  );
}
