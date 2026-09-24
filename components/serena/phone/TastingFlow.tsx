"use client";

import { useEffect, useRef, useState } from "react";
import { t } from "@/lib/i18n";
import type { Lang, UIKey } from "@/lib/i18n";
import type { Again, Bubbles } from "@/lib/tasting";
import { AROMAS, WINES, fmt } from "@/lib/wines";
import type { Aroma, WineId } from "@/lib/wines";
import WineVisual from "../WineVisual";

export interface TastingResult {
  sweet: number;
  bubbles: Bubbles;
  aroma: Aroma;
  again: Again;
  seconds: number;
}

export type AutoAnswers = Omit<TastingResult, "seconds">;

const SWEET_LABELS: UIKey[] = ["dry", "dry", "balanced", "sweet", "sweet"];

export default function TastingFlow({
  lang,
  wine,
  onDone,
  auto,
}: {
  lang: Lang;
  wine: WineId;
  onDone: (r: TastingResult) => void;
  auto?: AutoAnswers;
}) {
  const start = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [step, setStep] = useState(0);
  const [sweet, setSweet] = useState(3);
  const [bubbles, setBubbles] = useState<Bubbles | null>(null);
  const [aroma, setAroma] = useState<Aroma | null>(null);
  const [popped, setPopped] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => setElapsed((Date.now() - start.current) / 1000), 100);
    return () => clearInterval(id);
  }, []);

  // Autoplay: glide the sweetness bubble to its answer, then tap the other orbs one by one.
  useEffect(() => {
    if (!auto) return;
    if (step === 0) {
      const done = sweet === auto.sweet;
      const id = setTimeout(
        () => (done ? setStep(1) : setSweet((v) => v + Math.sign(auto.sweet - v) * 0.5)),
        done ? 800 : 320,
      );
      return () => clearTimeout(id);
    }
    const pickers = [
      null,
      () => choose(auto.bubbles, () => (setBubbles(auto.bubbles), setStep(2))),
      () => choose(auto.aroma, () => (setAroma(auto.aroma), setStep(3))),
      () => choose(auto.again, () => onDone({ ...auto, seconds: Math.round((Date.now() - start.current) / 100) / 10 })),
    ];
    const id = setTimeout(() => pickers[step]?.(), 1100);
    return () => clearTimeout(id);
    // choose/onDone are stable enough for a one-shot timer per step.
  }, [auto, step, sweet]);

  // Let the chosen orb pop before moving on.
  const choose = (key: string, then: () => void) => {
    setPopped(key);
    setTimeout(() => {
      setPopped(null);
      then();
    }, 380);
  };

  const w = WINES[wine];
  const intPart = Math.floor(sweet);
  const sweetLabel = t(SWEET_LABELS[Math.min(4, Math.round(sweet) - 1)], lang);

  return (
    <div className="flex min-h-[calc(100%-64px)] flex-col px-5 pb-8">
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-11 items-end justify-center overflow-hidden">
          <WineVisual id={wine} size={wine === "audace" ? 60 : 64} />
        </div>
        <div className="flex flex-1 flex-col">
          <span className="text-[10px] uppercase tracking-[0.35em] text-champagne">{t("tastingTitle", lang)}</span>
          <span className="font-display text-[22px] leading-tight">{w.name}</span>
        </div>
        <span className="font-display text-[26px] tabular-nums text-champagne">
          {fmt(elapsed, lang)}
          <span className="text-[14px]">{t("seconds", lang)}</span>
        </span>
      </div>

      <div className="mt-5 flex items-center gap-2" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${i <= step ? "bg-champagne" : "bg-champagne/15"}`}
          />
        ))}
      </div>
      <p className="mt-3 text-[12px] text-smoke">{t("tastingLead", lang)}</p>

      <div key={step} className="enter flex flex-1 flex-col items-center justify-center py-6">
        {step === 0 && (
          <div className="flex w-full flex-col items-center">
            <Question>{t("qSweet", lang)}</Question>
            <p className="mt-8 font-display text-[54px] italic leading-none text-pearl">{sweetLabel}</p>
            <div className="mt-2 flex gap-1.5" aria-hidden>
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className="rounded-full border border-champagne/60 transition-all duration-300"
                  style={{
                    width: 6 + i * 2,
                    height: 6 + i * 2,
                    background: i <= intPart ? "#e8d6a8" : "transparent",
                  }}
                />
              ))}
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={0.5}
              value={sweet}
              onChange={(e) => setSweet(Number(e.target.value))}
              aria-label={t("qSweet", lang)}
              aria-valuetext={sweetLabel}
              className="sweet-range mt-10"
            />
            <div className="mt-1 flex w-full justify-between text-[10px] uppercase tracking-[0.3em] text-smoke">
              <span>{t("dry", lang)}</span>
              <span>{t("sweet", lang)}</span>
            </div>
            <button onClick={() => setStep(1)} className="btn mt-10 px-10 py-3.5 text-[13px] font-semibold uppercase tracking-[0.2em]">
              {t("confirm", lang)}
            </button>
          </div>
        )}

        {step === 1 && (
          <>
            <Question>{t("qBubbles", lang)}</Question>
            <div className="mt-10 flex items-end justify-center gap-5">
              {(
                [
                  ["delicate", "bDelicate", 78],
                  ["lively", "bLively", 100],
                  ["explosive", "bExplosive", 124],
                ] as const
              ).map(([k, label, size]) => (
                <Orb
                  key={k}
                  size={size}
                  on={popped === k}
                  label={t(label, lang)}
                  onClick={() => choose(k, () => (setBubbles(k), setStep(2)))}
                />
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <Question>{t("qAroma", lang)}</Question>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5">
              {(Object.keys(AROMAS) as Aroma[]).map((k, i) => (
                <Orb
                  key={k}
                  size={122}
                  float={i}
                  on={popped === k}
                  label={AROMAS[k][lang]}
                  onClick={() => choose(k, () => (setAroma(k), setStep(3)))}
                />
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <Question>{t("qAgain", lang)}</Question>
            <div className="mt-10 flex items-center justify-center gap-5">
              {(
                [
                  ["yes", "yes", 118],
                  ["maybe", "maybe", 96],
                  ["no", "no", 80],
                ] as const
              ).map(([k, label, size]) => (
                <Orb
                  key={k}
                  size={size}
                  on={popped === k}
                  label={t(label, lang)}
                  big
                  onClick={() =>
                    choose(k, () =>
                      onDone({
                        sweet,
                        bubbles: bubbles ?? "lively",
                        aroma: aroma ?? w.aromas[0],
                        again: k,
                        seconds: Math.round((Date.now() - start.current) / 100) / 10,
                      }),
                    )
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Question({ children }: { children: React.ReactNode }) {
  return <h3 className="text-center font-display text-[32px] leading-tight text-pearl">{children}</h3>;
}

function Orb({
  size,
  label,
  on,
  onClick,
  float,
  big = false,
}: {
  size: number;
  label: string;
  on: boolean;
  onClick: () => void;
  float?: number;
  big?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      data-on={on}
      className={`orb flex shrink-0 items-center justify-center p-3 text-center text-pearl ${on ? "pop" : ""} ${float !== undefined ? "float" : ""}`}
      style={{ width: size, height: size, animationDelay: float !== undefined ? `${float * -1.3}s` : undefined }}
    >
      <span className={big ? "font-display text-[24px]" : "text-[12px] font-medium uppercase leading-snug tracking-[0.14em]"}>
        {label}
      </span>
    </button>
  );
}
