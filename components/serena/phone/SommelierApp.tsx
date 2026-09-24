"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, ChevronLeft, ScanLine, Sparkles } from "lucide-react";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import { COMPANY, MOMENTS, MOODS, SEGMENTS } from "@/lib/personas";
import type { Company, Moment, Mood, Persona, Segment } from "@/lib/personas";
import { fitFor, recommend } from "@/lib/sommelier";
import type { Recommendation } from "@/lib/sommelier";
import type { Tasting } from "@/lib/tasting";
import { WINES, WINE_IDS, realSweetness } from "@/lib/wines";
import type { WineId } from "@/lib/wines";
import Bubbles from "../Bubbles";
import WineVisual from "../WineVisual";
import TastingFlow from "./TastingFlow";
import type { AutoAnswers, TastingResult } from "./TastingFlow";
import Reward from "./Reward";
import WineCard from "./WineCard";

type Screen = "age" | "home" | "ask" | "reco" | "scan" | "scanned" | "taste" | "reward";

const AGE_KEY = "serena.segment";

function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function useTypewriter(text: string, cps: number, run: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => setN(0), [text]);
  useEffect(() => {
    if (!run || n >= text.length) return;
    const id = setTimeout(() => setN((v) => Math.min(text.length, v + 2)), 2000 / cps);
    return () => clearTimeout(id);
  }, [n, text, run, cps]);
  return { shown: text.slice(0, n), done: n >= text.length };
}

export default function SommelierApp({
  lang,
  persona,
  onTasting,
  framed = true,
  auto = false,
  onAutoDone,
}: {
  lang: Lang;
  persona: Persona | null;
  onTasting: (t: Tasting) => void;
  framed?: boolean;
  auto?: boolean;
  onAutoDone?: () => void;
}) {
  const [guestSegment, setGuestSegment] = useState<Segment | null>(null);
  const [screen, setScreen] = useState<Screen>(persona ? "home" : "age");
  const [reco, setReco] = useState<Recommendation | null>(null);
  const [asked, setAsked] = useState("");
  const [context, setContext] = useState<{ mood?: Mood; company?: Company; moment?: Moment }>({});
  const [wine, setWine] = useState<WineId>("medea");
  const [result, setResult] = useState<TastingResult | null>(null);
  const [done, setDone] = useState(0);
  const [lastSweet, setLastSweet] = useState<number | null>(null);
  const autoDone = useRef(onAutoDone);
  autoDone.current = onAutoDone;

  // Autoplay only advances the screens that have no button of their own to press.
  useEffect(() => {
    if (!auto || !persona) return;
    if (screen === "home") {
      const id = setTimeout(() => setScreen("ask"), 1400);
      return () => clearTimeout(id);
    }
    if (screen === "reward") {
      const id = setTimeout(() => autoDone.current?.(), 3400);
      return () => clearTimeout(id);
    }
  }, [auto, persona, screen]);

  useEffect(() => {
    if (persona) return;
    try {
      const saved = localStorage.getItem(AGE_KEY) as Segment | null;
      if (saved && SEGMENTS.includes(saved)) {
        setGuestSegment(saved);
        setScreen("home");
      }
    } catch {}
  }, [persona]);

  const name = persona?.name ?? t("guest", lang);
  const usualSweet = persona?.usualSweet ?? lastSweet;

  const chooseAge = (s: Segment) => {
    setGuestSegment(s);
    try {
      localStorage.setItem(AGE_KEY, s);
    } catch {}
    setScreen("home");
  };

  const finishTasting = (r: TastingResult) => {
    const segment = persona?.segment ?? guestSegment ?? "25-34";
    onTasting({
      id: newId(),
      at: Date.now(),
      name: persona?.name ?? t("guest", "it"),
      segment,
      wine,
      sweet: r.sweet,
      bubbles: r.bubbles,
      aroma: r.aroma,
      again: r.again,
      mood: context.mood ?? persona?.mood,
      company: context.company ?? persona?.company,
      moment: context.moment ?? persona?.moment,
      seconds: r.seconds,
    });
    setLastSweet(r.sweet);
    setResult(r);
    setDone((d) => d + 1);
    setScreen("reward");
  };

  const back = () => {
    if (screen === "taste") setScreen(reco ? "reco" : "scanned");
    else if (screen === "scanned") setScreen("scan");
    else setScreen("home");
  };

  return (
    <div className="relative size-full overflow-hidden bg-night">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 60% at 50% 0%, rgba(232,214,168,.12) 0%, rgba(10,11,14,0) 60%), radial-gradient(90% 50% at 50% 110%, rgba(201,165,92,.10) 0%, rgba(10,11,14,0) 70%)",
        }}
      />
      <Bubbles count={16} height={860} />

      <div className={`no-scrollbar relative z-10 h-full overflow-y-auto ${framed ? "pt-12" : "pt-[max(env(safe-area-inset-top),16px)]"}`}>
        {screen !== "home" && screen !== "age" && screen !== "reward" && (
          <div className="sticky top-0 z-20 flex items-center justify-between bg-night/85 px-5 py-3 backdrop-blur-md">
            <button
              onClick={back}
              aria-label={t("back", lang)}
              className="chip flex size-10 items-center justify-center text-champagne"
            >
              <ChevronLeft strokeWidth={1.4} className="size-5" />
            </button>
            <Wordmark small />
            <span className="size-10" />
          </div>
        )}

        {screen === "age" && <AgeScreen lang={lang} onPick={chooseAge} />}

        {screen === "home" && (
          <Home
            lang={lang}
            name={name}
            onAsk={() => setScreen("ask")}
            onScan={() => {
              setReco(null);
              setScreen("scan");
            }}
          />
        )}

        {screen === "ask" && (
          <Ask
            key={persona?.id ?? "guest"}
            auto={auto}
            lang={lang}
            persona={persona}
            onSend={(text, ctx) => {
              setAsked(text);
              setContext(ctx);
              const r = recommend(text, ctx.mood, ctx.company, ctx.moment, persona ?? undefined);
              setReco(r);
              setWine(r.wine);
              setScreen("reco");
            }}
          />
        )}

        {screen === "reco" && reco && (
          <Conversation
            auto={auto}
            lang={lang}
            asked={asked}
            reco={reco}
            onTaste={(id) => {
              setWine(id);
              setScreen("taste");
            }}
          />
        )}

        {screen === "scan" && (
          <Scan
            lang={lang}
            onRecognised={(id) => {
              setWine(id);
              setScreen("scanned");
            }}
          />
        )}

        {screen === "scanned" && (
          <div className="enter px-5 pb-10">
            <p className="mb-4 text-center text-[11px] uppercase tracking-[0.4em] text-champagne">
              {t("recognised", lang)}
            </p>
            <WineCard
              id={wine}
              lang={lang}
              fit={usualSweet !== null ? fitFor(wine, usualSweet) : undefined}
              onTaste={() => setScreen("taste")}
            />
          </div>
        )}

        {screen === "taste" && (
          <TastingFlow
            key={wine}
            lang={lang}
            wine={wine}
            onDone={finishTasting}
            auto={auto && persona ? autoAnswers(persona, wine) : undefined}
          />
        )}

        {screen === "reward" && result && (
          <Reward
            lang={lang}
            result={result}
            wine={wine}
            precision={Math.min(97, (persona ? 58 : 34) + done * (persona ? 9 : 12))}
            onClose={() => {
              setReco(null);
              setScreen("home");
            }}
          />
        )}
      </div>
    </div>
  );
}

function Wordmark({ small = false }: { small?: boolean }) {
  return (
    <div className="flex flex-col items-center leading-none">
      <span className={`font-display tracking-[0.34em] text-champagne ${small ? "text-[15px]" : "text-[22px]"}`}>SERENA</span>
      <span className={`mt-1 tracking-[0.5em] text-smoke ${small ? "text-[7px]" : "text-[9px]"}`}>1881</span>
    </div>
  );
}

function AgeScreen({ lang, onPick }: { lang: Lang; onPick: (s: Segment) => void }) {
  return (
    <div className="enter flex min-h-full flex-col items-center px-7 pb-12 pt-10">
      <Wordmark />
      <h1 className="mt-14 text-center font-display text-[34px] italic leading-tight text-pearl">{t("ageQ", lang)}</h1>
      <div className="mt-12 flex flex-wrap justify-center gap-4">
        {SEGMENTS.map((s, i) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="orb float flex size-[92px] items-center justify-center font-display text-[22px] text-pearl"
            style={{ animationDelay: `${i * -0.8}s` }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function Home({ lang, name, onAsk, onScan }: { lang: Lang; name: string; onAsk: () => void; onScan: () => void }) {
  return (
    <div className="enter flex min-h-full flex-col items-center px-7 pb-10 pt-8">
      <Wordmark />
      <p className="mt-12 text-[11px] uppercase tracking-[0.42em] text-smoke">
        {t("hello", lang)}, {name}
      </p>
      <h1 className="mt-3 text-center font-display text-[44px] italic leading-[1.02] text-pearl">{t("homeLead", lang)}</h1>

      <div className="relative mt-10 h-[380px] w-full">
        <div className="absolute left-1/2 top-2 -translate-x-[58%]">
          <span aria-hidden className="pulse-ring absolute inset-0 rounded-full border border-champagne/40" />
          <button onClick={onAsk} className="orb float flex size-[210px] flex-col items-center justify-center gap-3 text-pearl">
            <Sparkles strokeWidth={1.1} className="size-7 text-champagne" />
            <span className="max-w-[140px] text-center font-display text-[25px] leading-tight">{t("askSommelier", lang)}</span>
          </button>
        </div>
        <button
          onClick={onScan}
          className="orb float absolute bottom-3 right-2 flex size-[140px] flex-col items-center justify-center gap-2 text-pearl"
          style={{ animationDelay: "-2.5s" }}
        >
          <ScanLine strokeWidth={1.1} className="size-6 text-champagne" />
          <span className="max-w-[100px] text-center text-[12px] font-medium uppercase leading-snug tracking-[0.16em]">
            {t("scanBottle", lang)}
          </span>
        </button>
        <span aria-hidden className="orb absolute bottom-24 left-6 size-9 opacity-60" />
        <span aria-hidden className="orb absolute bottom-6 left-24 size-5 opacity-40" />
      </div>
      <p className="mt-auto text-[10px] uppercase tracking-[0.4em] text-smoke">{t("brandTag", lang)}</p>
    </div>
  );
}

function ChipRow<K extends string>({
  label,
  options,
  value,
  onChange,
  lang,
}: {
  label: string;
  options: Record<K, { it: string; en: string }>;
  value: K | undefined;
  onChange: (k: K | undefined) => void;
  lang: Lang;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="px-5 text-[10px] uppercase tracking-[0.35em] text-smoke">{label}</span>
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-1">
        {(Object.keys(options) as K[]).map((k) => (
          <button
            key={k}
            data-on={value === k}
            onClick={() => onChange(value === k ? undefined : k)}
            className="chip shrink-0 px-4 py-2 text-[13px]"
          >
            {options[k][lang]}
          </button>
        ))}
      </div>
    </div>
  );
}

function autoAnswers(p: Persona, wine: WineId): AutoAnswers {
  const young = p.segment === "18-24" || p.segment === "25-34";
  const softer = young && (wine === "medea" || wine === "frizzante" || wine === "chardonnay") ? 0.5 : 0;
  return {
    sweet: Math.min(5, Math.max(1, Math.round((realSweetness(WINES[wine]) + softer) * 2) / 2)),
    bubbles: wine === "frizzante" ? "delicate" : p.moment === "party" ? "explosive" : "lively",
    aroma: WINES[wine].aromas[0],
    again: p.id === "sofia" ? "maybe" : "yes",
  };
}

function Ask({
  lang,
  persona,
  onSend,
  auto,
}: {
  auto: boolean;
  lang: Lang;
  persona: Persona | null;
  onSend: (text: string, ctx: { mood?: Mood; company?: Company; moment?: Moment }) => void;
}) {
  const [mood, setMood] = useState<Mood | undefined>(persona?.mood);
  const [company, setCompany] = useState<Company | undefined>(persona?.company);
  const [moment, setMoment] = useState<Moment | undefined>(persona?.moment);
  const [edited, setEdited] = useState<string | null>(null);
  const typed = useTypewriter(persona?.message[lang] ?? "", 55, !!persona && edited === null);
  const send = useRef(onSend);
  send.current = onSend;
  const text = edited ?? typed.shown;
  const full = edited ?? persona?.message[lang] ?? "";
  const canSend = full.trim().length > 0 || !!mood || !!moment;

  useEffect(() => {
    if (!auto || !typed.done || edited !== null) return;
    const id = setTimeout(() => send.current(full, { mood, company, moment }), 900);
    return () => clearTimeout(id);
    // Fire once, when the persona's message has finished typing.
  }, [auto, typed.done]);

  return (
    <div className="enter flex min-h-[calc(100%-64px)] flex-col pb-5">
      <h2 className="px-5 font-display text-[36px] italic leading-tight">{t("askSommelier", lang)}</h2>
      <div className="mt-6 flex flex-col gap-6">
        <ChipRow label={t("howFeel", lang)} options={MOODS} value={mood} onChange={setMood} lang={lang} />
        <ChipRow label={t("withWhom", lang)} options={COMPANY} value={company} onChange={setCompany} lang={lang} />
        <ChipRow label={t("moment", lang)} options={MOMENTS} value={moment} onChange={setMoment} lang={lang} />
      </div>
      <div className="mt-auto px-4 pt-8">
        <div className="glass flex items-end gap-3 rounded-[28px] p-3 pl-5">
          <textarea
            value={text}
            onChange={(e) => setEdited(e.target.value)}
            placeholder={t("tellMore", lang)}
            rows={3}
            className="min-h-[72px] flex-1 resize-none bg-transparent py-2 text-[15px] leading-relaxed text-pearl placeholder:text-smoke focus:outline-none"
          />
          <button
            onClick={() => canSend && onSend(full, { mood, company, moment })}
            disabled={!canSend}
            aria-label={t("send", lang)}
            className="btn flex size-12 shrink-0 items-center justify-center disabled:opacity-30"
          >
            <ArrowUp strokeWidth={1.8} className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Conversation({
  lang,
  asked,
  reco,
  onTaste,
  auto,
}: {
  auto: boolean;
  lang: Lang;
  asked: string;
  reco: Recommendation;
  onTaste: (id: WineId) => void;
}) {
  const [thinking, setThinking] = useState(true);
  const reply = useTypewriter(reco.reply[lang], 90, !thinking);
  const endRef = useRef<HTMLDivElement>(null);
  const taste = useRef(onTaste);
  taste.current = onTaste;

  useEffect(() => {
    if (!auto || thinking || !reply.done) return;
    const id = setTimeout(() => taste.current(reco.wine), 2200);
    return () => clearTimeout(id);
  }, [auto, thinking, reply.done, reco.wine]);

  useEffect(() => {
    const id = setTimeout(() => setThinking(false), 1500);
    return () => clearTimeout(id);
  }, []);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [reply.shown.length, reply.done]);

  return (
    <div className="flex flex-col gap-5 px-5 pb-10">
      {asked && (
        <div className="enter ml-auto max-w-[82%] rounded-[22px] rounded-br-md bg-champagne/12 px-4 py-3 text-[14px] leading-relaxed text-pearl hairline">
          {asked}
        </div>
      )}
      <div className="flex items-start gap-3">
        <span className="orb flex size-9 shrink-0 items-center justify-center font-display text-[16px] italic text-champagne">S</span>
        {thinking ? (
          <p className="shimmer pt-2 text-[14px] tracking-wide">{t("thinking", lang)}…</p>
        ) : (
          <p className="pt-1.5 text-[15px] leading-[1.7] text-pearl">
            {reply.shown}
            {!reply.done && <span className="ml-0.5 inline-block h-4 w-px animate-pulse bg-champagne align-middle" />}
          </p>
        )}
      </div>
      {reply.done && !thinking && (
        <>
          <WineCard id={reco.wine} lang={lang} onTaste={() => onTaste(reco.wine)} />
          {reco.also && (
            <button onClick={() => onTaste(reco.also!)} className="glass enter flex items-center gap-4 rounded-[24px] p-4 text-left">
              <WineVisual id={reco.also} size={96} />
              <span className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-[0.35em] text-smoke">{t("alsoFor", lang)}</span>
                <span className="font-display text-[24px] leading-none">{WINES[reco.also].name}</span>
                <span className="text-[12px] text-mist">{WINES[reco.also].style[lang]}</span>
                <span className="mt-1 text-[11px] uppercase tracking-[0.2em] text-champagne">{t("tasteNow", lang)} →</span>
              </span>
            </button>
          )}
        </>
      )}
      <div ref={endRef} />
    </div>
  );
}

function Scan({ lang, onRecognised }: { lang: Lang; onRecognised: (id: WineId) => void }) {
  const [picked, setPicked] = useState<WineId | null>(null);
  const cb = useRef(onRecognised);
  cb.current = onRecognised;

  useEffect(() => {
    if (!picked) return;
    const id = setTimeout(() => cb.current(picked), 1400);
    return () => clearTimeout(id);
  }, [picked]);

  return (
    <div className="enter flex flex-col items-center pb-8">
      <h2 className="font-display text-[32px] italic">{t("scanTitle", lang)}</h2>
      <div className="relative mt-6 flex h-[340px] w-[250px] items-center justify-center">
        {(["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "left-0 bottom-0 border-l border-b", "right-0 bottom-0 border-r border-b"] as const).map((c) => (
          <span key={c} aria-hidden className={`absolute size-10 rounded-[6px] border-champagne ${c}`} />
        ))}
        {picked ? (
          <div className="enter">
            <WineVisual id={picked} size={300} />
          </div>
        ) : (
          <p className="max-w-[160px] text-center text-[12px] leading-relaxed text-smoke">{t("scanHint", lang)}</p>
        )}
        <span aria-hidden className="scanline absolute left-3 right-3 h-px bg-champagne shadow-[0_0_18px_4px_rgba(232,214,168,.45)]" />
      </div>
      <div className="no-scrollbar mt-8 flex w-full gap-3 overflow-x-auto px-6 pb-2">
        {WINE_IDS.map((id) => (
          <button
            key={id}
            onClick={() => setPicked(id)}
            disabled={!!picked}
            aria-label={WINES[id].name}
            data-on={picked === id}
            className="orb flex size-[86px] shrink-0 items-center justify-center overflow-hidden"
          >
            <WineVisual id={id} size={id === "audace" ? 100 : 76} />
          </button>
        ))}
      </div>
    </div>
  );
}
