"use client";

import { useState } from "react";
import { Mic } from "lucide-react";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import { parseTastingSpeech } from "@/lib/speechTasting";
import type { Heard } from "@/lib/speechTasting";
import { useDictation } from "@/lib/useDictation";
import { AROMAS } from "@/lib/wines";

const BUBBLE_KEY = { delicate: "bDelicate", lively: "bLively", explosive: "bExplosive" } as const;
const AGAIN_KEY = { yes: "yes", maybe: "maybe", no: "no" } as const;

export default function SayIt({ lang, onApply, onClose }: { lang: Lang; onApply: (h: Heard) => void; onClose: () => void }) {
  const [text, setText] = useState("");
  const [heard, setHeard] = useState<Heard | null>(null);
  const voice = useDictation(lang, (said) => setText(said));

  const fill = () => {
    const h = parseTastingSpeech(text);
    setHeard(h);
    setTimeout(() => onApply(h), 1100);
  };

  const chips: string[] = heard
    ? [
        heard.sweet !== undefined ? t(heard.sweet <= 2 ? "dry" : heard.sweet < 3.5 ? "balanced" : "sweet", lang) : "",
        heard.bubbles ? t(BUBBLE_KEY[heard.bubbles], lang) : "",
        heard.aroma ? AROMAS[heard.aroma][lang] : "",
        heard.again ? `${t("qAgain", lang)} ${t(AGAIN_KEY[heard.again], lang)}` : "",
      ].filter(Boolean)
    : [];

  return (
    <div className="enter flex w-full flex-col items-center gap-4">
      <h3 className="text-center font-display text-[30px] leading-tight">{t("sayIt", lang)}</h3>
      <p className="max-w-[270px] text-center text-[12px] leading-relaxed text-mist">{t("sayItLead", lang)}</p>
      {voice.supported && (
        <button
          onClick={voice.toggle}
          data-on={voice.listening}
          aria-label={t("speak", lang)}
          className="orb relative mt-2 flex size-[96px] items-center justify-center text-champagne data-[on=true]:text-night"
        >
          {voice.listening && <span aria-hidden className="pulse-ring absolute inset-0 rounded-full border border-champagne" />}
          <Mic strokeWidth={1.3} className="size-8" />
        </button>
      )}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder={t("sayItPlaceholder", lang)}
        className="glass w-full resize-none rounded-[22px] px-5 py-3 text-[14px] leading-relaxed text-pearl placeholder:text-smoke focus:outline-none"
      />
      {heard ? (
        <div className="enter flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-champagne">{t("sayItHeard", lang)}</span>
          <div className="flex flex-wrap justify-center gap-2">
            {chips.map((c) => (
              <span key={c} className="chip px-3 py-1.5 text-[12px]" data-on="true">
                {c}
              </span>
            ))}
          </div>
          {chips.length < 4 && <span className="text-[11px] text-smoke">{t("sayItMissing", lang)}</span>}
        </div>
      ) : (
        <div className="flex gap-3">
          <button onClick={fill} disabled={!text.trim()} className="btn px-8 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] disabled:opacity-30">
            {t("sayItFill", lang)}
          </button>
          <button onClick={onClose} className="btn-ghost px-6 py-3 text-[12px] uppercase tracking-[0.2em]">
            {t("back", lang)}
          </button>
        </div>
      )}
    </div>
  );
}
