"use client";

import { useMemo } from "react";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import { BASELINE, MONTHS, againShare, outlook, perception, segments, toRow, zeroShare } from "@/lib/insights";
import type { Tasting } from "@/lib/tasting";
import { int } from "@/lib/wines";
import LiveFeed from "./LiveFeed";
import OutlookChart from "./OutlookChart";
import PerceptionChart from "./PerceptionChart";
import SegmentBubbles from "./SegmentBubbles";

export default function Dashboard({ lang, tastings }: { lang: Lang; tastings: Tasting[] }) {
  const rows = useMemo(() => [...BASELINE, ...tastings.map(toRow)], [tastings]);
  const perc = useMemo(() => perception(rows), [rows]);
  const segs = useMemo(() => segments(rows), [rows]);
  const out = useMemo(() => outlook(rows), [rows]);
  const nf = (n: number) => int(n, lang);

  return (
    <section aria-label={t("dashTitle", lang)} className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-[0.45em] text-champagne">Serena Wines 1881</span>
          <h2 className="font-display text-[40px] leading-none">{t("dashTitle", lang)}</h2>
          <p className="max-w-[520px] text-[14px] text-mist">{t("dashLead", lang)}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 rounded-full hairline px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] text-champagne">
            <span className="size-1.5 animate-pulse rounded-full bg-champagne shadow-[0_0_10px_#e8d6a8]" />
            {t("live", lang)}
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-smoke">{t("illustrative", lang)}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Kpi
          label={t("kTastings", lang)}
          value={nf(rows.length)}
          caption={tastings.length ? `+${tastings.length} ${t("thisSession", lang)}` : t("kTastingsCap", lang)}
          live={tastings.length > 0}
        />
        <Kpi label={t("kAgain", lang)} value={`${Math.round(againShare(rows) * 100)}%`} caption={t("kAgainCap", lang)} />
        <Kpi label={t("kZero", lang)} value={`${Math.round(zeroShare(rows, MONTHS - 1) * 100)}%`} caption={t("kZeroCap", lang)} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card title={t("gapTitle", lang)} lead={t("gapLead", lang)}>
          <PerceptionChart data={perc} lang={lang} />
        </Card>
        <Card title={t("feedTitle", lang)}>
          <LiveFeed tastings={tastings} lang={lang} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card title={t("segTitle", lang)} lead={t("segLead", lang)}>
          <SegmentBubbles data={segs} lang={lang} />
        </Card>
        <Card title={t("outTitle", lang)} lead={t("outLead", lang)}>
          <OutlookChart data={out} lang={lang} />
          <p className="mt-4 font-display text-[20px] italic text-champagne">{t("outInsight", lang)}</p>
        </Card>
      </div>
    </section>
  );
}

function Kpi({ label, value, caption, live = false }: { label: string; value: string; caption: string; live?: boolean }) {
  return (
    <article className="relative overflow-hidden rounded-[24px] bg-deep p-6 hairline">
      <div aria-hidden className="absolute -right-10 -top-10 size-32 rounded-full bg-champagne/5 blur-2xl" />
      <p className="text-[10px] uppercase tracking-[0.32em] text-mist">{label}</p>
      <p key={value} className="enter mt-4 font-display text-[58px] leading-none tabular-nums text-pearl">
        {value}
      </p>
      <p className={`mt-3 text-[12px] ${live ? "text-champagne" : "text-smoke"}`}>{caption}</p>
    </article>
  );
}

function Card({ title, lead, children }: { title: string; lead?: string; children: React.ReactNode }) {
  return (
    <article className="flex flex-col gap-5 rounded-[26px] bg-deep p-6 hairline sm:p-7">
      <div className="flex flex-col gap-1.5">
        <h3 className="font-display text-[28px] leading-tight">{title}</h3>
        {lead && <p className="max-w-[560px] text-[13px] leading-relaxed text-mist">{lead}</p>}
      </div>
      {children}
    </article>
  );
}
