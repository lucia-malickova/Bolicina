import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import type { Action } from "@/lib/actions";

export default function ActionsPanel({ items, lang }: { items: Action[]; lang: Lang }) {
  return (
    <section
      aria-label={t("actTitle", lang)}
      className="relative overflow-hidden rounded-[26px] p-6 sm:p-7"
      style={{
        background: "linear-gradient(135deg, rgba(232,214,168,.10), rgba(16,18,23,1) 45%)",
        border: "1px solid rgba(232,214,168,.35)",
      }}
    >
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h3 className="font-display text-[34px] italic leading-none text-champagne">{t("actTitle", lang)}</h3>
        <p className="text-[13px] text-mist">{t("actLead", lang)}</p>
      </div>
      <ol className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {items.map((a, i) => (
          <li key={a.title.en} className="enter flex flex-col gap-3 rounded-[20px] bg-night/60 p-5 hairline" style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="flex items-baseline justify-between">
              <span className="font-display text-[40px] leading-none text-champagne/80">0{i + 1}</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-smoke">{a.kind[lang]}</span>
            </div>
            <p className="font-display text-[23px] leading-[1.15] text-pearl">{a.title[lang]}</p>
            <p className="text-[13px] leading-relaxed text-mist">{a.body[lang]}</p>
            <p className="mt-auto border-t border-champagne/10 pt-3 text-[11px] text-smoke">
              {t("basedOn", lang)} {a.evidence[lang]}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
