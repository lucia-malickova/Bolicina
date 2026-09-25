"use client";

import { useEffect, useMemo, useState } from "react";
import { Printer } from "lucide-react";
import { actions, dataValue } from "@/lib/actions";
import { alerts } from "@/lib/alerts";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import { BASELINE, MONTHS, againShare, outlook, perception, toRow, zeroShare } from "@/lib/insights";
import { missingWine } from "@/lib/simulate";
import { venueRadar } from "@/lib/venues";
import { useTastings } from "@/lib/useTastings";
import { AROMAS, WINES, dosage, fmt, int } from "@/lib/wines";

const GOLD = "#8a6a2c";

export default function Report() {
  const [lang, setLang] = useState<Lang>("it");
  const { tastings } = useTastings();

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("lang") === "en") setLang("en");
  }, []);

  const rows = useMemo(() => [...BASELINE, ...tastings.map(toRow)], [tastings]);
  const perc = useMemo(() => perception(rows), [rows]);
  const out = useMemo(() => outlook(rows), [rows]);
  const todo = useMemo(() => actions(rows, perc, out), [rows, perc, out]);
  const value = useMemo(() => dataValue(rows), [rows]);
  const news = useMemo(() => alerts(rows, [], venueRadar(tastings)), [rows, tastings]);
  const gap = useMemo(() => missingWine(rows), [rows]);
  const gaps = [...perc].sort((a, b) => Math.abs(b.perceived - b.real) - Math.abs(a.perceived - a.real)).slice(0, 4);
  const today = new Date().toLocaleDateString(lang === "it" ? "it-IT" : "en-GB", { day: "numeric", month: "long", year: "numeric" });

  const keys: [string, string][] = [
    [t("kTastings", lang), int(rows.length, lang)],
    [t("kAgain", lang), `${Math.round(againShare(rows) * 100)}%`],
    [t("kZero", lang), `${Math.round(zeroShare(rows, MONTHS - 1) * 100)}%`],
    [t("vGrowth", lang), `+${fmt(value.growth * 100, lang)}%`],
  ];

  return (
    <div className="min-h-dvh py-10 print:py-0">
      <style>{`@page { size: A4; margin: 14mm } @media print { html, body { background: #fff !important } }`}</style>
      <div className="mx-auto mb-6 flex max-w-[820px] justify-end gap-3 px-4 print:hidden">
        <button onClick={() => window.print()} className="btn flex items-center gap-2 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.2em]">
          <Printer strokeWidth={1.6} className="size-4" />
          {t("reportSave", lang)}
        </button>
      </div>

      <article className="mx-auto max-w-[820px] bg-white px-12 py-12 text-[#1a1a1a] shadow-2xl print:max-w-none print:px-0 print:py-0 print:shadow-none">
        <header className="flex items-end justify-between border-b pb-5" style={{ borderColor: GOLD }}>
          <div>
            <p className="font-display text-[34px] italic leading-none" style={{ color: GOLD }}>
              Bollicine
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.4em] text-[#666]">Serena Wines 1881</p>
          </div>
          <div className="text-right">
            <p className="font-display text-[22px] leading-tight">{t("reportTitle", lang)}</p>
            <p className="text-[12px] text-[#666]">{today}</p>
          </div>
        </header>

        <section className="mt-8 grid grid-cols-4 gap-4">
          {keys.map(([label, v]) => (
            <div key={label} className="border-l-2 pl-3" style={{ borderColor: GOLD }}>
              <p className="font-display text-[34px] leading-none tabular-nums">{v}</p>
              <p className="mt-1 text-[10px] uppercase leading-snug tracking-[0.15em] text-[#666]">{label}</p>
            </div>
          ))}
        </section>

        <Section title={t("actTitle", lang)}>
          <ol className="flex flex-col gap-4">
            {todo.map((a, i) => (
              <li key={a.title.en} className="flex gap-4 break-inside-avoid">
                <span className="font-display text-[28px] leading-none" style={{ color: GOLD }}>
                  0{i + 1}
                </span>
                <div>
                  <p className="font-display text-[19px] leading-snug">{a.title[lang]}</p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-[#444]">{a.body[lang]}</p>
                  <p className="mt-1 text-[10.5px] text-[#888]">
                    {t("basedOn", lang)} {a.evidence[lang]}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section title={t("alertsTitle", lang)}>
          <ul className="flex flex-col gap-2">
            {news.map((a) => (
              <li key={a.id} className="break-inside-avoid text-[12.5px] leading-relaxed">
                <b>{a.title[lang]}.</b> <span className="text-[#444]">{a.body[lang]}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={t("gapTitle", lang)}>
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="border-b border-[#ddd] text-left text-[10px] uppercase tracking-[0.15em] text-[#888]">
                <th className="py-1.5 font-medium">&nbsp;</th>
                <th className="py-1.5 text-right font-medium">{t("real", lang)}</th>
                <th className="py-1.5 text-right font-medium">{t("perceived", lang)}</th>
                <th className="py-1.5 text-right font-medium">Δ</th>
              </tr>
            </thead>
            <tbody>
              {gaps.map((g) => {
                const d = g.perceived - g.real;
                return (
                  <tr key={g.wine} className="border-b border-[#eee]">
                    <td className="py-1.5">{WINES[g.wine].name}</td>
                    <td className="py-1.5 text-right tabular-nums">{fmt(g.real, lang)}</td>
                    <td className="py-1.5 text-right tabular-nums">{fmt(g.perceived, lang)}</td>
                    <td className="py-1.5 text-right font-semibold tabular-nums">
                      {d >= 0 ? "+" : "−"}
                      {fmt(Math.abs(d), lang)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Section>

        {gap && (
          <Section title={t("mwTitle", lang)}>
            <p className="font-display text-[19px]">
              {dosage(gap.spec.sugar)} · {gap.spec.sugar} g/l · {fmt(gap.spec.abv, lang, gap.spec.abv % 1 ? 1 : 0)}% · {AROMAS[gap.spec.aroma][lang]}
            </p>
            <p className="mt-1 text-[12.5px] text-[#444]">
              {t("mwFor", lang)} {gap.segment} {t("mwYears", lang)} {gap.from}% {t("mwTo", lang)} <b>{gap.to}%</b>.
            </p>
          </Section>
        )}

        <Section title={t("valTitle", lang)}>
          <p className="font-display text-[18px] italic leading-snug" style={{ color: GOLD }}>
            {t("valClosing", lang)}
          </p>
        </Section>

        <footer className="mt-10 border-t border-[#ddd] pt-3 text-[10px] text-[#888]">{t("reportFooter", lang)}</footer>
      </article>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-9 break-inside-avoid">
      <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: GOLD }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
