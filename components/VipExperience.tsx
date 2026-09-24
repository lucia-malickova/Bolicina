"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Crown,
  Gift,
  Lock,
  QrCode,
  RotateCcw,
  Send,
  ServerCog,
  Sparkles,
  Timer,
  UtensilsCrossed,
  Wine as WineIcon,
} from "lucide-react";
import {
  DominantNote,
  SENSORY_QUESTIONS,
  SensoryKey,
  SensoryProfile,
  VIP_POINTS_PER_PROFILE,
  WINES,
  WineId,
  conciergeReply,
} from "./data";

interface Message {
  id: number;
  role: "bot" | "guest";
  text: string;
}

const SUGGESTIONS = [
  "What pairs with the Gold Reserve?",
  "Is Black Label good with sushi?",
  "Is my data sent to the cloud?",
];

type NewProfile = Omit<SensoryProfile, "id">;

export default function VipExperience({
  onRegister,
}: {
  onRegister: (p: NewProfile) => void;
}) {
  const [wineId, setWineId] = useState<WineId>("gold");
  const wine = WINES[wineId];

  return (
    <div className="fade-up">
      <section className="flex flex-col gap-5 px-4 pb-10 pt-12 sm:px-8 lg:px-16 lg:pb-12 lg:pt-16">
        <span className="flex w-fit items-center gap-2.5 border border-gold/40 px-3.5 py-2 text-[10px] uppercase tracking-[0.35em] text-gold">
          <QrCode aria-hidden strokeWidth={1.4} className="size-3.5" />
          Bottle authenticated · scanned via QR
        </span>
        <h1 className="font-serif text-4xl font-normal leading-[1.05] text-ivory sm:text-5xl lg:text-6xl">
          The art of the <em className="text-gold">perlage</em>,
          <br className="hidden sm:block" /> curated for you.
        </h1>
        <p className="max-w-[640px] text-[15px] font-light leading-[1.8] text-mist">
          Discover your cuvée, leave your sensory signature in six seconds, and
          converse with our private AI Concierge for the perfect pairing.
        </p>
      </section>

      <div className="grid grid-cols-1 items-start gap-8 px-4 pb-16 sm:px-8 lg:grid-cols-12 lg:px-16">
        <div className="flex flex-col gap-8 lg:col-span-7">
          <article className="gold-glow flex flex-col gap-7 border border-gold/40 bg-onyx p-6 sm:p-10">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-[28px] text-ivory">Your Bottle</h2>
              <span className="text-[10px] uppercase tracking-[0.4em] text-ash">01 — Discover</span>
            </div>

            <label className="flex flex-col gap-2.5">
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold">Cuvée</span>
              <div className="relative">
                <select
                  value={wineId}
                  onChange={(e) => setWineId(e.target.value as WineId)}
                  className="h-14 w-full cursor-pointer appearance-none border border-gold/55 bg-noir pl-5 pr-14 font-serif text-lg text-ivory transition-shadow duration-300 hover:shadow-[0_0_18px_rgba(212,175,55,0.22)] focus:border-gold focus:shadow-[0_0_18px_rgba(212,175,55,0.22)] focus:outline-none sm:text-xl"
                >
                  {Object.values(WINES).map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden
                  strokeWidth={1.5}
                  className="pointer-events-none absolute right-5 top-1/2 size-4 -translate-y-1/2 text-gold"
                />
              </div>
            </label>

            <div key={wineId} className="fade-up grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-3 border-t border-gold/35 pt-5">
                <div className="flex items-center gap-2.5 text-gold">
                  <WineIcon aria-hidden strokeWidth={1.4} className="size-[18px]" />
                  <span className="text-[10px] uppercase tracking-[0.4em]">Tasting Notes</span>
                </div>
                <p className="text-sm font-light leading-[1.8] text-[#d6d2c8]">{wine.notes}</p>
              </div>
              <div className="flex flex-col gap-3 border-t border-gold/35 pt-5">
                <div className="flex items-center gap-2.5 text-gold">
                  <UtensilsCrossed aria-hidden strokeWidth={1.4} className="size-[18px]" />
                  <span className="text-[10px] uppercase tracking-[0.4em]">Perfect Pairing</span>
                </div>
                <p className="text-sm font-light leading-[1.8] text-[#d6d2c8]">{wine.pairing}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-10 gap-y-2 text-[11px] uppercase tracking-[0.24em] text-ash">
              <span>
                Style <span className="text-[#e8e6e1]">{wine.style}</span>
              </span>
              <span>
                Serve at <span className="text-[#e8e6e1]">{wine.serve}</span>
              </span>
            </div>
          </article>

          <SensorySignature wineId={wineId} onRegister={onRegister} />
        </div>

        <Concierge wineId={wineId} />
      </div>
    </div>
  );
}

function SensorySignature({
  wineId,
  onRegister,
}: {
  wineId: WineId;
  onRegister: (p: NewProfile) => void;
}) {
  const [picks, setPicks] = useState<Partial<Record<SensoryKey, string>>>({});
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [seconds, setSeconds] = useState<number | null>(null);
  const [registered, setRegistered] = useState(false);
  const [points, setPoints] = useState(0);

  const answered = SENSORY_QUESTIONS.filter((q) => picks[q.key]).length;
  const complete = answered === SENSORY_QUESTIONS.length;

  const pick = (key: SensoryKey, value: string) => {
    if (registered) return;
    const now = performance.now();
    const start = startedAt ?? now;
    if (startedAt === null) setStartedAt(now);
    const next = { ...picks, [key]: value };
    setPicks(next);
    if (SENSORY_QUESTIONS.every((q) => next[q.key])) {
      setSeconds(Math.max(0.1, (now - start) / 1000));
    }
  };

  const register = () => {
    if (!complete || registered) return;
    onRegister({
      wine: wineId,
      structure: picks.structure!,
      acidity: picks.acidity!,
      note: picks.note as DominantNote,
      seconds: seconds ?? 0,
    });
    setPoints((p) => p + VIP_POINTS_PER_PROFILE);
    setRegistered(true);
  };

  const reset = () => {
    setPicks({});
    setStartedAt(null);
    setSeconds(null);
    setRegistered(false);
  };

  return (
    <article className="gold-glow flex flex-col gap-7 border border-gold/40 bg-onyx p-6 sm:p-10">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="font-serif text-[28px] text-ivory">Sensory Signature</h2>
          <span className="text-[13px] font-light text-[#a8a398]">
            Three touches. Six seconds. No stars.
          </span>
        </div>
        <span className="flex shrink-0 items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-ash">
          <Timer aria-hidden strokeWidth={1.4} className="size-3.5 text-gold" />
          {seconds !== null ? (
            <span className="text-gold">{seconds.toFixed(1)} s</span>
          ) : (
            "02 — Feel"
          )}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-5">
        {SENSORY_QUESTIONS.map((q) => (
          <fieldset key={q.key} className="flex flex-col gap-2.5" disabled={registered}>
            <legend className="pb-3 text-[10px] uppercase tracking-[0.4em] text-gold">{q.label}</legend>
            {q.options.map((opt) => {
              const on = picks[q.key] === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  aria-pressed={on}
                  onClick={() => pick(q.key, opt)}
                  className={`gold-glow h-12 border text-xs font-medium uppercase tracking-[0.22em] disabled:cursor-default ${
                    on
                      ? "border-gold bg-gold text-noir"
                      : "border-gold/35 bg-transparent text-[#cfcac0] hover:text-gold-light disabled:opacity-40"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </fieldset>
        ))}
      </div>

      {registered ? (
        <div role="status" className="fade-up flex flex-col gap-6 border border-gold bg-[#0e0c07] p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <Crown aria-hidden strokeWidth={1.3} className="mt-1 size-7 shrink-0 text-gold" />
            <div className="flex flex-col gap-2">
              <span className="font-serif text-2xl text-ivory">
                Welcome to the inner circle.
              </span>
              <span className="text-[11px] uppercase tracking-[0.24em] text-gold">
                {picks.structure} · {picks.acidity} · {picks.note} · captured in{" "}
                {seconds?.toFixed(1)} s
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1 border-t border-gold/35 pt-4">
              <span className="text-[10px] uppercase tracking-[0.35em] text-ash">VIP points</span>
              <span className="font-serif text-4xl text-gold">
                +{VIP_POINTS_PER_PROFILE}
                <span className="ml-3 font-sans text-xs tracking-[0.2em] text-mist">
                  BALANCE {points}
                </span>
              </span>
            </div>
            <div className="flex flex-col gap-1.5 border-t border-gold/35 pt-4">
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-ash">
                <Gift aria-hidden strokeWidth={1.4} className="size-3.5 text-gold" />
                Reward unlocked
              </span>
              <span className="text-sm leading-relaxed text-ivory">
                Priority allocation on the next {WINES[wineId].short} release
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-2 text-[11px] text-mist">
              <Lock aria-hidden strokeWidth={1.4} className="size-3.5 shrink-0 text-gold" />
              Your profile is stored only on Bollicina&apos;s own servers.
            </span>
            <button
              type="button"
              onClick={reset}
              className="gold-glow flex h-11 shrink-0 items-center justify-center gap-2 border border-gold/50 px-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-gold hover:text-gold-light"
            >
              <RotateCcw aria-hidden strokeWidth={1.5} className="size-3.5" />
              Taste another
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5 border-t border-gold/20 pt-6 md:flex-row md:items-center md:justify-between">
          <span className="text-xs uppercase tracking-[0.2em] text-ash">
            {complete ? `Signature complete in ${seconds?.toFixed(1)} s` : `${answered} of 3 selected`}
          </span>
          <button
            type="button"
            disabled={!complete}
            onClick={register}
            className={`gold-glow h-14 shrink-0 border border-gold px-8 text-[11px] font-semibold uppercase tracking-[0.3em] disabled:cursor-not-allowed ${
              complete ? "bg-gold text-noir hover:bg-gold-light" : "bg-transparent text-ash"
            }`}
          >
            Register Profile & Claim VIP Points
          </button>
        </div>
      )}
    </article>
  );
}

function Concierge({ wineId }: { wineId: WineId }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "bot",
      text: "Good evening. I am your Bollicina Concierge. Tell me what you are serving tonight and I will compose the perfect pairing.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const nextId = useRef(1);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scroller.current;
    el?.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const ask = (text: string) => {
    const q = text.trim();
    if (!q || typing) return;
    setMessages((m) => [...m, { id: nextId.current++, role: "guest", text: q }]);
    setDraft("");
    setTyping(true);
    const wine = WINES[wineId];
    setTimeout(() => {
      setMessages((m) => [...m, { id: nextId.current++, role: "bot", text: conciergeReply(q, wine) }]);
      setTyping(false);
    }, 1100);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(draft);
  };

  return (
    <aside
      aria-label="AI Concierge"
      className="gold-glow flex h-[680px] flex-col border border-gold/40 bg-onyx lg:sticky lg:top-[120px] lg:col-span-5 lg:h-[880px]"
    >
      <div className="flex flex-col gap-4 border-b border-gold/30 px-6 py-6 sm:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex size-11 items-center justify-center border border-gold text-gold">
              <Sparkles aria-hidden strokeWidth={1.4} className="size-5" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-serif text-[22px] text-ivory">AI Concierge</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-ash">Your private sommelier</span>
            </div>
          </div>
          <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gold">
            <span className="size-1.5 bg-gold shadow-[0_0_10px_#d4af37]" />
            Online
          </span>
        </div>
        <span className="flex w-fit items-center gap-2 border border-gold/30 px-3 py-1.5 text-[9px] uppercase tracking-[0.3em] text-mist">
          <ServerCog aria-hidden strokeWidth={1.4} className="size-3 text-gold" />
          M.I.A. local LLM · on-premise · no public cloud
        </span>
      </div>

      <div ref={scroller} aria-live="polite" className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-7 sm:px-8">
        {messages.map((m) =>
          m.role === "bot" ? (
            <div key={m.id} className="fade-up flex max-w-[86%] flex-col gap-1.5 self-start">
              <span className="text-[9px] uppercase tracking-[0.4em] text-gold">Concierge</span>
              <div className="border border-gold/30 bg-[#111] px-[18px] py-4 text-sm font-light leading-[1.7] text-[#e8e6e1]">
                {m.text}
              </div>
            </div>
          ) : (
            <div key={m.id} className="fade-up flex max-w-[80%] flex-col items-end gap-1.5 self-end">
              <span className="text-[9px] uppercase tracking-[0.4em] text-ash">You</span>
              <div className="border border-gold/50 bg-[#1a1710] px-[18px] py-4 text-sm leading-[1.7] text-ivory">
                {m.text}
              </div>
            </div>
          ),
        )}
        {typing && (
          <div className="self-start border border-gold/30 bg-[#111] px-[18px] py-3.5 text-[11px] uppercase tracking-[0.3em] text-gold">
            <span className="animate-pulse">Composing a pairing…</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 px-6 pb-4 sm:px-8">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => ask(s)}
            className="gold-glow min-h-11 border border-gold/35 px-3.5 text-[11px] tracking-[0.08em] text-[#cfcac0] hover:text-gold-light"
          >
            {s}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex gap-3 border-t border-gold/30 px-6 pb-7 pt-5 sm:px-8">
        <label htmlFor="concierge-input" className="sr-only">
          Ask the concierge
        </label>
        <input
          id="concierge-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask about pairings, service, occasions…"
          autoComplete="off"
          className="h-[52px] min-w-0 flex-1 border border-gold/40 bg-noir px-[18px] text-sm text-ivory placeholder:text-[#7d7a72] transition-shadow duration-300 focus:border-gold focus:shadow-[0_0_18px_rgba(212,175,55,0.22)] focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={!draft.trim() || typing}
          className="gold-glow flex size-[52px] shrink-0 items-center justify-center border border-gold bg-gold text-noir hover:bg-gold-light disabled:opacity-40"
        >
          <Send aria-hidden strokeWidth={1.6} className="size-[18px]" />
        </button>
      </form>
    </aside>
  );
}
