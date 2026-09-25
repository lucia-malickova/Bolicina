"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, CloudRain, PackageCheck, ShoppingBag, Sun, SunMedium } from "lucide-react";
import { OCCASIONS, SHELF, shelfPick } from "@/lib/ecosystem";
import type { ListWine, Occasion } from "@/lib/ecosystem";
import type { L10n, Lang } from "@/lib/i18n";
import { BASELINE } from "@/lib/insights";
import { tomorrow } from "@/lib/simulate";
import type { Day, Weather } from "@/lib/simulate";
import { WINES, int } from "@/lib/wines";
import PhoneFrame from "../PhoneFrame";
import Bubbles from "../Bubbles";
import WineVisual from "../WineVisual";
import GenericBottle from "./GenericBottle";

const TX = {
  shelf: { it: "Inquadra lo scaffale", en: "Point at the shelf" },
  occasion: { it: "Per quale occasione?", en: "For what occasion?" },
  budget: { it: "Budget", en: "Budget" },
  pick: { it: "Prendi questa", en: "Take this one" },
  reserve: { it: "Prenota e ritira", en: "Reserve and collect" },
  reserved: { it: "Prenotata: ti aspetta alla cassa", en: "Reserved: waiting for you at the till" },
  none: { it: "Nessuna bottiglia in questo budget.", en: "No bottle within this budget." },
  dash: { it: "Dashboard dell'enoteca", en: "Wine shop dashboard" },
  plan: { it: "Clicca e ritira gratis · Insights gratis il primo anno", en: "Click & collect free · Insights free in year one" },
  brought: { it: "Clienti portati dall'app", en: "Customers brought by the app" },
  sales: { it: "Vendite dall'app", en: "Sales from the app" },
  waiting: { it: "Ritiri in attesa", en: "Pick-ups waiting" },
  month: { it: "questo mese", en: "this month" },
  queue: { it: "Clicca e ritira", en: "Click & collect" },
  ready: { it: "Pronta", en: "Ready" },
  collected: { it: "Ritirata", en: "Collected" },
  emptyQ: { it: "Prenota dal telefono: la prenotazione arriva qui.", en: "Reserve on the phone: it lands here." },
  restock: { it: "Cosa ordinare per il weekend", en: "What to stock for the weekend" },
  restockLead: { it: "Dal meteo e da ciò che bevono i clienti della zona.", en: "From the weather and what local guests drink." },
  weekday: { it: "Feriale", en: "Weekday" },
  weekend: { it: "Weekend", en: "Weekend" },
  demo: { it: "Enoteca e altri produttori fittizi · prezzi e numeri illustrativi", en: "Fictional shop and producers · illustrative prices and numbers" },
} satisfies Record<string, L10n>;

interface Reservation {
  id: number;
  wine: ListWine;
  status: "new" | "ready" | "collected";
}

const WEATHER = [
  ["hot", 31, Sun],
  ["mild", 22, SunMedium],
  ["cold", 12, CloudRain],
] as const;

function Visual({ w, size }: { w: ListWine; size: number }) {
  return w.serena ? <WineVisual id={w.serena} size={w.serena === "audace" ? size * 0.75 : size} /> : <GenericBottle letter={w.producer.slice(-1)} size={size} />;
}

export default function ShopView({ lang }: { lang: Lang }) {
  const [occasion, setOccasion] = useState<Occasion>("gift");
  const [budget, setBudget] = useState(40);
  const [res, setRes] = useState<Reservation[]>([]);
  const [weather, setWeather] = useState<Weather>("hot");
  const [day, setDay] = useState<Day>("weekend");
  const picks = useMemo(() => shelfPick(occasion, budget), [occasion, budget]);
  const top = picks[0];
  const fc = useMemo(() => tomorrow(BASELINE, weather, day), [weather, day]);
  const onShelf = new Set(SHELF.filter((w) => w.serena).map((w) => w.serena));
  const restock = fc.wines.filter((w) => onShelf.has(w.id));
  const tx = (k: keyof typeof TX) => TX[k][lang];
  const lastReserved = res.length ? res[res.length - 1].wine.id : null;

  const brought = 124 + res.length;
  const sales = 2310 + res.reduce((s, r) => s + r.wine.price, 0);
  const waiting = res.filter((r) => r.status !== "collected").length;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[400px_1fr]">
      <div className="flex flex-col items-center gap-3 lg:sticky lg:top-6 lg:self-start">
        <PhoneFrame>
          <div className="relative size-full overflow-hidden bg-night">
            <Bubbles count={12} height={820} />
            <div className="no-scrollbar relative z-10 h-full overflow-y-auto px-5 pb-10 pt-14">
              <p className="text-center text-[10px] uppercase tracking-[0.4em] text-smoke">Enoteca Centrale · Milano</p>
              <h2 className="mt-1 text-center font-display text-[30px] italic">{tx("shelf")}</h2>
              <div className="mt-4 flex items-end justify-between rounded-[14px] border-b-4 border-[#5a4630] bg-gradient-to-b from-transparent to-[#2a2018]/60 px-2 pt-3">
                {SHELF.map((w) => (
                  <div key={w.id} className={`transition-all duration-500 ${top && top.id === w.id ? "-translate-y-2 drop-shadow-[0_0_14px_rgba(232,214,168,.6)]" : "opacity-60"}`}>
                    <Visual w={w} size={78} />
                  </div>
                ))}
              </div>
              <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-smoke">{tx("occasion")}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(Object.keys(OCCASIONS) as Occasion[]).map((o) => (
                  <button key={o} data-on={occasion === o} onClick={() => setOccasion(o)} className="chip px-3.5 py-1.5 text-[12px]">
                    {OCCASIONS[o][lang]}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-smoke">{tx("budget")}</p>
              <div className="mt-2 flex gap-2">
                {[12, 20, 40].map((b) => (
                  <button key={b} data-on={budget === b} onClick={() => setBudget(b)} className="chip px-3.5 py-1.5 text-[12px] tabular-nums">
                    ≤ {b} €
                  </button>
                ))}
              </div>
              {top ? (
                <article key={`${occasion}-${budget}`} className="glass enter mt-5 flex items-center gap-4 rounded-[24px] p-4">
                  <div className="flex h-28 w-14 items-end justify-center">
                    <Visual w={top} size={110} />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-champagne">{tx("pick")}</span>
                    <span className="text-[10px] text-smoke">{top.producer}</span>
                    <span className="font-display text-[20px] leading-tight">{top.name}</span>
                    <span className="text-[11px] text-mist">{top.style}</span>
                    <span className="font-display text-[20px] tabular-nums text-pearl">{top.price} €</span>
                    {lastReserved === top.id ? (
                      <span className="enter flex items-center gap-1.5 text-[11px] text-champagne">
                        <CheckCircle2 strokeWidth={1.6} className="size-4" />
                        {tx("reserved")}
                      </span>
                    ) : (
                      <button
                        onClick={() => setRes((r) => [...r, { id: r.length + 1, wine: top, status: "new" }])}
                        className="btn mt-1 flex items-center justify-center gap-2 py-2 text-[11px] font-semibold uppercase tracking-[0.15em]"
                      >
                        <ShoppingBag strokeWidth={1.6} className="size-4" />
                        {tx("reserve")}
                      </button>
                    )}
                  </div>
                </article>
              ) : (
                <p className="mt-5 text-[13px] text-mist">{tx("none")}</p>
              )}
            </div>
          </div>
        </PhoneFrame>
      </div>

      <section className="flex flex-col gap-5">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.45em] text-champagne">Enoteca Centrale · Milano</span>
            <h2 className="font-display text-[40px] leading-none">{tx("dash")}</h2>
          </div>
          <span className="rounded-full hairline px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-champagne">{tx("plan")}</span>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Tile label={tx("brought")} value={String(brought)} cap={tx("month")} />
          <Tile label={tx("sales")} value={`${int(sales, lang)} €`} cap={tx("month")} />
          <Tile label={tx("waiting")} value={String(waiting)} />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <article className="flex flex-col gap-3 rounded-[24px] bg-deep p-6 hairline">
            <h3 className="font-display text-[24px]">{tx("queue")}</h3>
            {res.length === 0 ? (
              <p className="text-[13px] text-mist">{tx("emptyQ")}</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {[...res].reverse().map((r) => (
                  <li key={r.id} className="enter flash-in flex items-center gap-3 rounded-[16px] p-2.5 hairline">
                    <div className="flex h-12 w-7 items-end justify-center">
                      <Visual w={r.wine} size={46} />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-[13px] text-pearl">{r.wine.name}</span>
                      <span className="text-[11px] text-smoke">
                        #{String(r.id).padStart(3, "0")} · {r.wine.price} €
                      </span>
                    </div>
                    {r.status === "collected" ? (
                      <span className="flex items-center gap-1 text-[11px] text-smoke">
                        <PackageCheck strokeWidth={1.5} className="size-4" />
                        {tx("collected")}
                      </span>
                    ) : (
                      <button
                        onClick={() => setRes((all) => all.map((x) => (x.id === r.id ? { ...x, status: x.status === "new" ? "ready" : "collected" } : x)))}
                        className={`${r.status === "new" ? "btn" : "btn-ghost"} px-3 py-1.5 text-[10px] uppercase tracking-[0.15em]`}
                      >
                        {r.status === "new" ? tx("ready") : tx("collected")}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </article>

          <article className="flex flex-col gap-4 rounded-[24px] bg-deep p-6 hairline">
            <div>
              <h3 className="font-display text-[24px]">{tx("restock")}</h3>
              <p className="text-[12px] text-mist">{tx("restockLead")}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {WEATHER.map(([k, deg, Icon]) => (
                <button key={k} data-on={weather === k} onClick={() => setWeather(k)} className="chip flex items-center gap-1.5 px-3 py-1.5 text-[12px]">
                  <Icon strokeWidth={1.4} className="size-4" />
                  {deg} °C
                </button>
              ))}
              {(["weekday", "weekend"] as const).map((d) => (
                <button key={d} data-on={day === d} onClick={() => setDay(d)} className="chip px-3 py-1.5 text-[12px]">
                  {tx(d)}
                </button>
              ))}
            </div>
            <ul className="flex flex-col gap-2">
              {restock.map((w) => (
                <li key={w.id} className="flex items-center gap-3 text-[13px]">
                  <div className="flex h-10 w-6 items-end justify-center">
                    <WineVisual id={w.id} size={w.id === "audace" ? 30 : 40} />
                  </div>
                  <span className="flex-1 text-pearl">{WINES[w.id].name}</span>
                  <span className={`tabular-nums ${w.change >= 0 ? "text-champagne" : "text-smoke"}`}>
                    {w.change >= 0 ? "+" : "−"}
                    {Math.abs(Math.round(w.change * 100))}%
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </div>
        <p className="text-[11px] text-smoke">{tx("demo")}</p>
      </section>
    </div>
  );
}

function Tile({ label, value, cap }: { label: string; value: string; cap?: string }) {
  return (
    <article className="flex flex-col gap-2 rounded-[22px] bg-deep p-5 hairline">
      <p className="text-[10px] uppercase tracking-[0.3em] text-mist">{label}</p>
      <p key={value} className="enter font-display text-[46px] leading-none tabular-nums text-pearl">
        {value}
      </p>
      {cap && <p className="text-[11px] text-smoke">{cap}</p>}
    </article>
  );
}
