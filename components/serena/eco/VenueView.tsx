"use client";

import { useMemo, useState } from "react";
import { Award, GlassWater, Lightbulb } from "lucide-react";
import { GUEST_TASTES, VENUE_LIST, rankFor } from "@/lib/ecosystem";
import type { GuestTaste } from "@/lib/ecosystem";
import type { L10n, Lang } from "@/lib/i18n";
import { venueRadar } from "@/lib/venues";
import { AROMAS, fmt, int } from "@/lib/wines";
import PhoneFrame from "../PhoneFrame";
import Bubbles from "../Bubbles";
import WineVisual from "../WineVisual";
import GenericBottle from "./GenericBottle";

const TX = {
  list: { it: "Carta delle bollicine", en: "Sparkling list" },
  guest: { it: "Il gusto dell'ospite", en: "The guest's taste" },
  forYou: { it: "Per te", en: "For you" },
  glass: { it: "al calice", en: "per glass" },
  order: { it: "Ordina", en: "Order" },
  fair: {
    it: "Consiglio imparziale su tutta la carta: conta solo il gusto, non il produttore.",
    en: "An impartial pick across the whole list: only taste counts, never the producer.",
  },
  dash: { it: "Dashboard del locale", en: "Venue dashboard" },
  plan: { it: "Piano base gratuito · Insights gratis il primo anno", en: "Free base plan · Insights free in year one" },
  glasses: { it: "Calici stasera", en: "Glasses tonight" },
  revenue: { it: "Incasso bollicine", en: "Sparkling revenue" },
  upsell: { it: "Scelti su consiglio", en: "Chosen on advice" },
  serve: { it: "Perfect Serve", en: "Perfect Serve" },
  certified: { it: "Locale certificato Serena Perfect Serve", en: "Certified Serena Perfect Serve venue" },
  notYet: { it: "Ancora qualche passo per il certificato", en: "A few steps from the certificate" },
  live: { it: "Ordini in diretta", en: "Live orders" },
  empty: { it: "Scegli un gusto e ordina dal telefono: l'ordine arriva qui.", en: "Pick a taste and order on the phone: it lands here." },
  loves: { it: "Cosa amano i tuoi ospiti stasera", en: "What your guests love tonight" },
  tip: { it: "Consiglio per lo staff", en: "Tip for the staff" },
  tipText: {
    it: "Servite gli Extra Dry a 6–7 °C e versate lentamente, calice inclinato: il perlage dura di più.",
    en: "Serve Extra Dry at 6–7 °C and pour slowly into a tilted glass: the bubbles last longer.",
  },
  demo: { it: "Locale e altri produttori fittizi · numeri illustrativi", en: "Fictional venue and producers · illustrative numbers" },
} satisfies Record<string, L10n>;

interface Order {
  id: number;
  wine: string;
  price: number;
  advised: boolean;
  taste: string;
}

export default function VenueView({ lang }: { lang: Lang }) {
  const [guest, setGuest] = useState<GuestTaste>(GUEST_TASTES[1]);
  const [orders, setOrders] = useState<Order[]>([]);
  const ranked = useMemo(() => rankFor(VENUE_LIST, guest), [guest]);
  const radar = useMemo(() => venueRadar([]).find((r) => r.id === "portici")!, []);
  const serve = 100 - (radar.flat + radar.warm) * 4;
  const tx = (k: keyof typeof TX) => TX[k][lang];

  const glasses = 38 + orders.length;
  const revenue = 286 + orders.reduce((s, o) => s + o.price, 0);
  const advised = 21 + orders.filter((o) => o.advised).length;
  const tastes = GUEST_TASTES.map((g) => ({ g, n: [9, 14, 8, 7][GUEST_TASTES.indexOf(g)] + orders.filter((o) => o.taste === g.id).length }));
  const maxT = Math.max(...tastes.map((x) => x.n));

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[400px_1fr]">
      <div className="flex flex-col items-center gap-3 lg:sticky lg:top-6 lg:self-start">
        <PhoneFrame>
          <div className="relative size-full overflow-hidden bg-night">
            <Bubbles count={12} height={820} />
            <div className="no-scrollbar relative z-10 h-full overflow-y-auto px-5 pb-10 pt-14">
              <p className="text-center text-[10px] uppercase tracking-[0.4em] text-smoke">Bar Portici · Bologna</p>
              <h2 className="mt-1 text-center font-display text-[30px] italic">{tx("list")}</h2>
              <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-smoke">{tx("guest")}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {GUEST_TASTES.map((g) => (
                  <button key={g.id} data-on={guest.id === g.id} onClick={() => setGuest(g)} className="chip px-3 py-1.5 text-[11px]">
                    {g.label[lang]}
                  </button>
                ))}
              </div>
              <ul className="mt-5 flex flex-col gap-2.5">
                {ranked.map((w, i) => (
                  <li
                    key={`${guest.id}-${w.id}`}
                    className={`enter flex items-center gap-3 rounded-[18px] p-2.5 ${i === 0 ? "bg-champagne/10 ring-1 ring-champagne/60" : "hairline"}`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="flex h-16 w-9 shrink-0 items-end justify-center">
                      {w.serena ? <WineVisual id={w.serena} size={w.serena === "audace" ? 44 : 62} /> : <GenericBottle letter={w.producer.slice(-1)} size={60} rose={w.name.includes("Rosé")} />}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      {i === 0 && <span className="text-[9px] uppercase tracking-[0.3em] text-champagne">{tx("forYou")}</span>}
                      <span className="truncate text-[10px] text-smoke">{w.producer}</span>
                      <span className="truncate font-display text-[16px] leading-tight">{w.name}</span>
                      <span className="text-[10px] text-mist">
                        {w.style} · {AROMAS[w.aroma][lang]}
                      </span>
                      <span className="mt-1 h-1 w-full overflow-hidden rounded-full bg-champagne/10">
                        <span className="block h-full rounded-full bg-champagne/70" style={{ width: `${w.fit}%` }} />
                      </span>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="font-display text-[17px] tabular-nums">{w.price} €</span>
                      <button
                        onClick={() => setOrders((o) => [...o, { id: o.length + 1, wine: `${w.producer} · ${w.name}`, price: w.price, advised: i === 0, taste: guest.id }])}
                        className={`${i === 0 ? "btn" : "btn-ghost"} px-3 py-1 text-[10px] uppercase tracking-[0.15em]`}
                      >
                        {tx("order")}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-center text-[10px] leading-relaxed text-smoke">{tx("fair")}</p>
            </div>
          </div>
        </PhoneFrame>
      </div>

      <section className="flex flex-col gap-5">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.45em] text-champagne">Bar Portici · Bologna</span>
            <h2 className="font-display text-[40px] leading-none">{tx("dash")}</h2>
          </div>
          <span className="rounded-full hairline px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-champagne">{tx("plan")}</span>
        </header>

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <Tile label={tx("glasses")} value={String(glasses)} />
          <Tile label={tx("revenue")} value={`${int(revenue, lang)} €`} />
          <Tile label={tx("upsell")} value={`${Math.round((advised / glasses) * 100)}%`} />
          <article className="flex flex-col gap-2 rounded-[22px] bg-deep p-5 hairline">
            <p className="text-[10px] uppercase tracking-[0.3em] text-mist">{tx("serve")}</p>
            <p className="font-display text-[46px] leading-none tabular-nums text-champagne">
              {serve}
              <span className="text-[18px]">/100</span>
            </p>
            <p className="flex items-center gap-1.5 text-[11px] text-pearl">
              <Award strokeWidth={1.5} className="size-4 text-champagne" />
              {serve >= 85 ? tx("certified") : tx("notYet")}
            </p>
          </article>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <article className="flex flex-col gap-3 rounded-[24px] bg-deep p-6 hairline">
            <h3 className="font-display text-[24px]">{tx("live")}</h3>
            {orders.length === 0 ? (
              <p className="text-[13px] text-mist">{tx("empty")}</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {[...orders].reverse().slice(0, 6).map((o) => (
                  <li key={o.id} className="enter flash-in flex items-center justify-between gap-3 rounded-xl px-2 py-2 text-[13px]">
                    <span className="flex items-center gap-2 text-pearl">
                      <GlassWater strokeWidth={1.4} className="size-4 text-champagne" />
                      {o.wine}
                    </span>
                    <span className="tabular-nums text-mist">
                      {fmt(o.price, lang, 0)} €{o.advised ? " · ✦" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </article>
          <article className="flex flex-col gap-3 rounded-[24px] bg-deep p-6 hairline">
            <h3 className="font-display text-[24px]">{tx("loves")}</h3>
            <ul className="flex flex-col gap-2.5">
              {tastes.map(({ g, n }) => (
                <li key={g.id} className="grid grid-cols-[1fr_120px_28px] items-center gap-3 text-[12px]">
                  <span className="text-mist">{g.label[lang]}</span>
                  <span className="h-2 overflow-hidden rounded-full bg-champagne/8">
                    <span className="block h-full rounded-full transition-[width] duration-500" style={{ width: `${(n / maxT) * 100}%`, background: "#b8893a" }} />
                  </span>
                  <span className="text-right tabular-nums text-pearl">{n}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex gap-3 rounded-[16px] bg-champagne/8 p-3">
              <Lightbulb strokeWidth={1.4} className="size-5 shrink-0 text-champagne" />
              <p className="text-[12px] leading-relaxed text-pearl">
                <b className="font-semibold">{tx("tip")}:</b> {tx("tipText")}
              </p>
            </div>
          </article>
        </div>
        <p className="text-[11px] text-smoke">{tx("demo")}</p>
      </section>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <article className="flex flex-col gap-2 rounded-[22px] bg-deep p-5 hairline">
      <p className="text-[10px] uppercase tracking-[0.3em] text-mist">{label}</p>
      <p key={value} className="enter font-display text-[46px] leading-none tabular-nums text-pearl">
        {value}
      </p>
    </article>
  );
}
