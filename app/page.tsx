"use client";

import { useState } from "react";
import { Play, Square, Store, UtensilsCrossed, Users, Network } from "lucide-react";
import Bubbles from "@/components/serena/Bubbles";
import LangToggle from "@/components/serena/LangToggle";
import PhoneFrame from "@/components/serena/PhoneFrame";
import QrPopover from "@/components/serena/QrPopover";
import Dashboard from "@/components/serena/dashboard/Dashboard";
import SommelierApp from "@/components/serena/phone/SommelierApp";
import NetworkView from "@/components/serena/eco/NetworkView";
import ShopView from "@/components/serena/eco/ShopView";
import VenueView from "@/components/serena/eco/VenueView";
import type { L10n } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import { CITY_NAMES } from "@/lib/geo";
import { PERSONAS } from "@/lib/personas";
import { useTastings } from "@/lib/useTastings";
import { useVotes } from "@/lib/useVotes";
import { WINES } from "@/lib/wines";

type View = "guest" | "venue" | "shop" | "network";

const VIEWS: { id: View; label: L10n; Icon: typeof Users }[] = [
  { id: "guest", label: { it: "Ospite e cantina", en: "Guest and winery" }, Icon: Users },
  { id: "venue", label: { it: "Ristorante", en: "Restaurant" }, Icon: UtensilsCrossed },
  { id: "shop", label: { it: "Enoteca", en: "Wine shop" }, Icon: Store },
  { id: "network", label: { it: "Rete Bollicine", en: "Bollicine network" }, Icon: Network },
];

export default function Stage() {
  const [view, setView] = useState<View>("guest");
  const [lang, setLang] = useState<Lang>("it");
  const [personaId, setPersonaId] = useState(PERSONAS[0].id);
  const { tastings, add, reset } = useTastings();
  const { votes, vote, reset: resetVotes } = useVotes();
  const persona = PERSONAS.find((p) => p.id === personaId)!;
  const [auto, setAuto] = useState(false);
  const [run, setRun] = useState(0);

  const startAuto = () => {
    setRun((r) => r + 1);
    setAuto(true);
  };
  const nextAuto = () => {
    const i = PERSONAS.findIndex((p) => p.id === personaId);
    if (i === PERSONAS.length - 1) return setAuto(false);
    setPersonaId(PERSONAS[i + 1].id);
  };

  return (
    <div className="relative min-h-dvh overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[700px]"
        style={{ background: "radial-gradient(60% 100% at 50% 0%, rgba(232,214,168,.10), rgba(10,11,14,0) 70%)" }}
      />
      <Bubbles count={26} height={1200} className="opacity-60" />

      <header className="relative z-20 mx-auto flex max-w-[1520px] items-center justify-between gap-4 px-4 py-5 sm:px-8">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-[30px] italic tracking-[0.1em] text-champagne">Bollicine</span>
          <span className="text-[10px] uppercase tracking-[0.45em] text-smoke">Serena 1881</span>
          <span className="hidden text-[10px] uppercase tracking-[0.4em] text-smoke md:inline">· Sommelier</span>
        </div>
        <div className="flex items-center gap-3">
          <QrPopover lang={lang} />
          <LangToggle lang={lang} onChange={setLang} />
        </div>
      </header>

      <nav aria-label="Views" className="relative z-20 mx-auto max-w-[1520px] px-4 sm:px-8">
        <div className="no-scrollbar flex gap-2 overflow-x-auto rounded-full hairline p-1.5">
          {VIEWS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => {
                setAuto(false);
                setView(id);
              }}
              aria-pressed={view === id}
              data-on={view === id}
              className="chip flex shrink-0 items-center gap-2 border-transparent px-4 py-2 text-[12px] font-medium"
            >
              <Icon strokeWidth={1.5} className="size-4" />
              {label[lang]}
            </button>
          ))}
        </div>
      </nav>

      <div hidden={view !== "guest"}>
      <section className="relative z-10 mx-auto max-w-[1520px] px-4 pt-6 sm:px-8">
        <h1 className="font-display text-[44px] leading-[1.02] sm:text-[64px]">
          <span className="champagne-text italic">{t("stageTitle", lang)}</span>
        </h1>
        <p className="mt-3 max-w-[620px] text-[15px] text-mist">{t("stageLead", lang)}</p>

        <div className="mt-8 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-[10px] uppercase tracking-[0.4em] text-smoke">{t("guests", lang)}</span>
            <button
              onClick={() => (auto ? setAuto(false) : startAuto())}
              aria-pressed={auto}
              className={`${auto ? "btn" : "btn-ghost"} flex items-center gap-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em]`}
            >
              {auto ? <Square strokeWidth={0} className="size-3 fill-current" /> : <Play strokeWidth={0} className="size-3 fill-current" />}
              {auto ? t("stop", lang) : t("autoplay", lang)}
            </button>
          </div>
          <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-3 pt-1 sm:-mx-8 sm:px-8">
            {PERSONAS.map((p) => {
              const on = p.id === personaId;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setAuto(false);
                    setPersonaId(p.id);
                  }}
                  aria-pressed={on}
                  className="group flex w-[104px] shrink-0 flex-col items-center gap-2 text-center"
                >
                  <span
                    data-on={on}
                    className="orb flex size-[68px] items-center justify-center font-display text-[28px] italic"
                    style={{ boxShadow: on ? `0 0 36px ${WINES[p.wine].accent}66, inset 0 0 26px rgba(232,214,168,.3)` : undefined }}
                  >
                    <span className={on ? "text-night" : "text-champagne"}>{p.name[0]}</span>
                  </span>
                  <span className={`text-[13px] ${on ? "text-pearl" : "text-mist"}`}>
                    {p.name}, {p.age}
                  </span>
                  <span className="text-[10px] leading-tight text-smoke">{p.role[lang]}</span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-champagne/70">{CITY_NAMES[p.city]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <main className="relative z-10 mx-auto grid max-w-[1520px] grid-cols-1 gap-10 px-4 pb-20 pt-6 sm:px-8 lg:grid-cols-[400px_1fr]">
        <div className="flex flex-col items-center gap-4 lg:sticky lg:top-6 lg:self-start">
          <PhoneFrame>
            <SommelierApp
              key={`${persona.id}-${run}`}
              lang={lang}
              persona={persona}
              onTasting={add}
              auto={auto}
              onAutoDone={nextAuto}
              history={tastings.filter((x) => x.name === persona.name)}
              onVote={(choice) => vote({ id: `${Date.now().toString(36)}-${persona.id}`, choice, segment: persona.segment })}
            />
          </PhoneFrame>
          <p className="max-w-[360px] text-center text-[11px] leading-relaxed text-smoke">{t("simulation", lang)}</p>
        </div>
        <Dashboard
          lang={lang}
          tastings={tastings}
          votes={votes}
          onReset={() => {
            reset();
            resetVotes();
          }}
        />
      </main>
      </div>

      {view !== "guest" && (
        <div className="enter relative z-10 mx-auto max-w-[1520px] px-4 pb-20 pt-8 sm:px-8">
          {view === "venue" && <VenueView lang={lang} />}
          {view === "shop" && <ShopView lang={lang} />}
          {view === "network" && <NetworkView lang={lang} />}
        </div>
      )}
    </div>
  );
}
