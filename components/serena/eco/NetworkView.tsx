"use client";

import { useEffect, useMemo, useState } from "react";
import { Lock, Pause, Play, Share2, UserCheck } from "lucide-react";
import { DEFAULT_PARAMS, network } from "@/lib/ecosystem";
import type { MonthState, Params } from "@/lib/ecosystem";
import type { L10n, Lang } from "@/lib/i18n";
import { BASELINE, againShare } from "@/lib/insights";
import { int } from "@/lib/wines";

const TX = {
  title: { it: "La rete Bollicine", en: "The Bollicine network" },
  lead: {
    it: "Premi play: ventiquattro mesi di crescita. Il primo anno è gratis per tutti, poi pagano le cantine e chi vuole i propri insights.",
    en: "Press play: twenty-four months of growth. Year one is free for everyone, then wineries pay, and anyone who wants their own insights.",
  },
  month: { it: "Mese", en: "Month" },
  free: { it: "Anno 1 · gratis per tutti · partner fondatori", en: "Year 1 · free for everyone · founding partners" },
  saas: { it: "Anno 2 · SaaS", en: "Year 2 · SaaS" },
  wineries: { it: "Cantine di Prosecco", en: "Prosecco wineries" },
  founders: { it: "di cui fondatori", en: "of which founders" },
  venues: { it: "Ristoranti e bar", en: "Restaurants and bars" },
  shops: { it: "Enoteche", en: "Wine shops" },
  guests: { it: "Ospiti (sempre gratis)", en: "Guests (always free)" },
  mrr: { it: "Ricavo mensile ricorrente", en: "Monthly recurring revenue" },
  params: { it: "Parametri dello scenario", en: "Scenario parameters" },
  pWinery: { it: "Cantina, € al mese", en: "Winery, € per month" },
  pVenue: { it: "Insights locale, € al mese", en: "Venue insights, € per month" },
  pShop: { it: "Insights enoteca, € al mese", en: "Shop insights, € per month" },
  pFounders: { it: "Sconto fondatori, per sempre", en: "Founders' discount, for life" },
  index: { it: "Prosecco Index", en: "Prosecco Index" },
  indexLead: {
    it: "Ogni cantina si confronta con la media anonima della rete: più cantine, più valore per tutte.",
    en: "Each winery compares itself with the network's anonymous average: more wineries, more value for all.",
  },
  yours: { it: "Serena · Medea", en: "Serena · Medea" },
  market: { it: "Media Extra Dry della rete", en: "Network Extra Dry average" },
  again: { it: "Lo ricomprerebbe", en: "Would buy again" },
  fresh: { it: "Freschezza percepita", en: "Perceived freshness" },
  rules: { it: "Le regole dei dati", en: "The data rules" },
  r1: { it: "Ogni cantina possiede i propri dati", en: "Each winery owns its own data" },
  r2: { it: "La rete vede solo medie anonime", en: "The network only sees anonymous averages" },
  r3: { it: "Gli ospiti usano l'app gratis, per sempre", en: "Guests use the app free, for ever" },
  note: {
    it: "Scenario illustrativo: curve di adozione e prezzi sono ipotesi modificabili, non previsioni.",
    en: "Illustrative scenario: adoption curves and prices are editable assumptions, not forecasts.",
  },
} satisfies Record<string, L10n>;

const GOLD = "#b8893a";
const AQUA = "#2f95b3";

export default function NetworkView({ lang }: { lang: Lang }) {
  const [month, setMonth] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [p, setP] = useState<Params>(DEFAULT_PARAMS);
  const series = useMemo(() => Array.from({ length: 24 }, (_, i) => network(i + 1, p)), [p]);
  const s = series[month - 1];
  const tx = (k: keyof typeof TX) => TX[k][lang];

  useEffect(() => {
    if (!playing) return;
    if (month >= 24) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setMonth((m) => m + 1), 550);
    return () => clearTimeout(id);
  }, [playing, month]);

  const medea = BASELINE.filter((r) => r.wine === "medea");
  const medeaAgain = againShare(medea);
  const medeaFresh = medea.filter((r) => r.bubbles !== "delicate").length / medea.length;
  const maxMrr = Math.max(...series.map((x) => x.mrr), 1);

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10px] uppercase tracking-[0.45em] text-champagne">Bollicine</span>
        <h2 className="font-display text-[44px] leading-none">{tx("title")}</h2>
        <p className="max-w-[760px] text-[14px] text-mist">{tx("lead")}</p>
      </header>

      <div className="flex flex-col gap-3 rounded-[24px] bg-deep p-5 hairline">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (month >= 24) setMonth(1);
              setPlaying((v) => !v);
            }}
            aria-label={playing ? "Pause" : "Play"}
            className="btn flex size-12 shrink-0 items-center justify-center"
          >
            {playing ? <Pause strokeWidth={0} className="size-4 fill-current" /> : <Play strokeWidth={0} className="size-4 fill-current" />}
          </button>
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-baseline justify-between">
              <span className="font-display text-[26px] tabular-nums">
                {tx("month")} {month}
              </span>
              <span className={`text-[11px] uppercase tracking-[0.2em] ${month <= 12 ? "text-champagne" : "text-pearl"}`}>{month <= 12 ? tx("free") : tx("saas")}</span>
            </div>
            <input
              type="range"
              min={1}
              max={24}
              value={month}
              onChange={(e) => {
                setPlaying(false);
                setMonth(Number(e.target.value));
              }}
              aria-label={tx("month")}
              className="w-full accent-[#e8d6a8]"
            />
            <div className="flex h-1.5 overflow-hidden rounded-full">
              <span className="w-1/2 bg-champagne/60" />
              <span className="w-1/2 bg-[#2f95b3]/60" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Kpi label={tx("wineries")} value={int(s.wineries, lang)} sub={`${int(s.founders, lang)} ${tx("founders")}`} series={series} pick={(x) => x.wineries} month={month} />
        <Kpi label={tx("venues")} value={int(s.venues, lang)} series={series} pick={(x) => x.venues} month={month} />
        <Kpi label={tx("shops")} value={int(s.shops, lang)} series={series} pick={(x) => x.shops} month={month} />
        <Kpi label={tx("guests")} value={int(s.guests, lang)} series={series} pick={(x) => x.guests} month={month} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
        <article className="flex flex-col gap-4 rounded-[24px] bg-deep p-6 hairline">
          <div className="flex items-baseline justify-between">
            <h3 className="font-display text-[24px]">{tx("mrr")}</h3>
            <span className="font-display text-[34px] tabular-nums text-champagne">{int(s.mrr, lang)} €</span>
          </div>
          <div className="flex h-40 items-end gap-[3px]">
            {series.map((x) => (
              <div key={x.month} className="flex h-full flex-1 items-end" title={`${tx("month")} ${x.month}: ${int(x.mrr, lang)} €`}>
                <div
                  className="w-full rounded-t-[4px] transition-all duration-300"
                  style={{
                    height: x.mrr ? `${Math.max(3, (x.mrr / maxMrr) * 100)}%` : "3px",
                    background: x.month <= 12 ? "rgba(232,214,168,.18)" : GOLD,
                    opacity: x.month <= month ? 1 : 0.25,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-smoke">
            <span>{tx("free")}</span>
            <span>{tx("saas")}</span>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-4 border-t border-champagne/10 pt-4 sm:grid-cols-2">
            <p className="text-[10px] uppercase tracking-[0.3em] text-smoke sm:col-span-2">{tx("params")}</p>
            <Param label={tx("pWinery")} v={p.wineryPrice} min={99} max={1500} step={10} fmtV={(v) => `${int(v, lang)} €`} on={(v) => setP({ ...p, wineryPrice: v })} />
            <Param label={tx("pVenue")} v={p.venuePrice} min={0} max={150} step={1} fmtV={(v) => `${v} €`} on={(v) => setP({ ...p, venuePrice: v })} />
            <Param label={tx("pShop")} v={p.shopPrice} min={0} max={150} step={1} fmtV={(v) => `${v} €`} on={(v) => setP({ ...p, shopPrice: v })} />
            <Param
              label={tx("pFounders")}
              v={p.foundingDiscount}
              min={0}
              max={0.6}
              step={0.05}
              fmtV={(v) => `−${Math.round(v * 100)}%`}
              on={(v) => setP({ ...p, foundingDiscount: v })}
            />
          </div>
        </article>

        <div className="flex flex-col gap-4">
          <article className="flex flex-col gap-4 rounded-[24px] bg-deep p-6 hairline">
            <div>
              <h3 className="font-display text-[24px]">{tx("index")}</h3>
              <p className="text-[12px] text-mist">{tx("indexLead")}</p>
            </div>
            <div className="flex gap-5 text-[11px] text-mist">
              <span className="flex items-center gap-2">
                <span className="size-2.5 rounded-full" style={{ background: GOLD }} />
                {tx("yours")}
              </span>
              <span className="flex items-center gap-2">
                <span className="size-2.5 rounded-full" style={{ background: AQUA }} />
                {tx("market")}
              </span>
            </div>
            <Compare label={tx("again")} a={medeaAgain} b={0.62} />
            <Compare label={tx("fresh")} a={medeaFresh} b={0.63} />
          </article>
          <article className="flex flex-col gap-3 rounded-[24px] bg-deep p-6 hairline">
            <h3 className="font-display text-[24px]">{tx("rules")}</h3>
            {(
              [
                [Lock, "r1"],
                [Share2, "r2"],
                [UserCheck, "r3"],
              ] as const
            ).map(([Icon, k]) => (
              <p key={k} className="flex items-center gap-3 text-[13px] text-pearl">
                <Icon strokeWidth={1.4} className="size-5 shrink-0 text-champagne" />
                {tx(k)}
              </p>
            ))}
          </article>
        </div>
      </div>
      <p className="text-[11px] text-smoke">{tx("note")}</p>
    </section>
  );
}

function Kpi({
  label,
  value,
  sub,
  series,
  pick,
  month,
}: {
  label: string;
  value: string;
  sub?: string;
  series: MonthState[];
  pick: (x: MonthState) => number;
  month: number;
}) {
  const W = 200;
  const H = 44;
  const max = Math.max(...series.map(pick));
  const pts = series.slice(0, month).map((x, i) => `${(i / 23) * W},${H - (pick(x) / max) * (H - 4) - 2}`);
  return (
    <article className="flex flex-col gap-2 rounded-[22px] bg-deep p-5 hairline">
      <p className="text-[10px] uppercase tracking-[0.3em] text-mist">{label}</p>
      <p className="font-display text-[40px] leading-none tabular-nums text-pearl">{value}</p>
      {sub && <p className="text-[11px] text-champagne">{sub}</p>}
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-1 w-full" aria-hidden>
        <polyline points={pts.join(" ")} fill="none" stroke={GOLD} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </article>
  );
}

function Param({
  label,
  v,
  min,
  max,
  step,
  fmtV,
  on,
}: {
  label: string;
  v: number;
  min: number;
  max: number;
  step: number;
  fmtV: (v: number) => string;
  on: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-[12px]">
      <span className="flex justify-between">
        <span className="text-mist">{label}</span>
        <span className="tabular-nums text-pearl">{fmtV(v)}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={v} onChange={(e) => on(Number(e.target.value))} className="w-full accent-[#e8d6a8]" />
    </label>
  );
}

function Compare({ label, a, b }: { label: string; a: number; b: number }) {
  return (
    <div className="flex flex-col gap-1.5 text-[12px]">
      <span className="text-mist">{label}</span>
      {[
        [a, GOLD],
        [b, AQUA],
      ].map(([v, c], i) => (
        <div key={i} className="grid grid-cols-[1fr_40px] items-center gap-3">
          <span className="h-2.5 overflow-hidden rounded-full bg-champagne/8">
            <span className="block h-full rounded-full" style={{ width: `${Number(v) * 100}%`, background: String(c) }} />
          </span>
          <span className="text-right tabular-nums text-pearl">{Math.round(Number(v) * 100)}%</span>
        </div>
      ))}
    </div>
  );
}
