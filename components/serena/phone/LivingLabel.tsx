"use client";

import { useEffect, useRef, useState } from "react";
import { t } from "@/lib/i18n";
import type { L10n, Lang } from "@/lib/i18n";
import { WINES } from "@/lib/wines";
import type { WineId } from "@/lib/wines";
import Bubbles from "../Bubbles";
import WineVisual from "../WineVisual";

// Every line comes from the wine's technical sheet (Valdobbiadene: UNESCO site since 2019).
const STORY: Record<WineId, L10n[]> = {
  audace: [
    { it: "Golfo di Trieste", en: "Gulf of Trieste" },
    { it: "20 metri sotto il mare", en: "20 metres under the sea" },
    { it: "Oltre 4 mesi al buio", en: "Over 4 months in the dark" },
    { it: "6.492 bottiglie al mondo", en: "6,492 bottles in the world" },
  ],
  valdobbiadene: [
    { it: "Valdobbiadene", en: "Valdobbiadene" },
    { it: "Le Colline del Prosecco, patrimonio UNESCO", en: "The Prosecco Hills, a UNESCO site" },
    { it: "Rosa, gelsomino, mela verde", en: "Rose, jasmine, green apple" },
  ],
  bio: [
    { it: "Agricoltura biologica", en: "Organic farming" },
    { it: "Vegan friendly", en: "Vegan friendly" },
    { it: "Fiori d'acacia e mela gialla", en: "Acacia blossom and yellow apple" },
  ],
  medea: [
    { it: "Treviso", en: "Treviso" },
    { it: "Extra Dry, giovane ed euforico", en: "Extra Dry, young and exciting" },
    { it: "Fiori bianchi e mela golden", en: "White flowers and golden apple" },
  ],
  frizzante: [
    { it: "Come una volta", en: "The way it used to be" },
    { it: "Ricorda l'antica versione sur lie", en: "Recalls the old sur lie style" },
    { it: "Una bollicina gentile", en: "Gentle bubbles" },
  ],
  soe: [
    { it: "Ribolla Gialla", en: "Ribolla Gialla" },
    { it: "Un vitigno antico del Friuli", en: "An ancient grape of Friuli" },
    { it: "Glicine, iris, mela golden", en: "Wisteria, iris, golden apple" },
  ],
  chardonnay: [
    { it: "Chardonnay", en: "Chardonnay" },
    { it: "Crosta di pane e mela verde", en: "Bread crust and green apple" },
    { it: "Asciutto e sapido", en: "Dry-tasting and saline" },
  ],
  ice: [
    { it: "Serena ICE", en: "Serena ICE" },
    { it: "Pesca e albicocca", en: "Peach and apricot" },
    { it: "Dolce, fresco, armonico", en: "Sweet, fresh, harmonious" },
  ],
  zero: [
    { it: "0,0%", en: "0.0%" },
    { it: "Tutto il brindisi", en: "The whole toast" },
    { it: "Zero alcol", en: "Zero alcohol" },
  ],
};

export default function LivingLabel({ wine, lang, onDone }: { wine: WineId; lang: Lang; onDone: () => void }) {
  const w = WINES[wine];
  const deep = wine === "audace";
  const [depth, setDepth] = useState(0);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    const id = setTimeout(() => done.current(), deep ? 5600 : 4600);
    return () => clearTimeout(id);
  }, [deep]);

  useEffect(() => {
    if (!deep) return;
    const id = setInterval(() => setDepth((d) => Math.min(20, d + 1)), 110);
    return () => clearInterval(id);
  }, [deep]);

  return (
    <div
      className="absolute inset-0 z-40 flex flex-col items-center overflow-hidden px-6 pb-10 pt-16"
      style={{
        background: deep
          ? "linear-gradient(180deg, #0d3a44 0%, #072029 45%, #05080b 100%)"
          : `radial-gradient(90% 60% at 50% 30%, ${w.accent}40 0%, #0a0b0e 70%)`,
      }}
    >
      {deep && (
        <div
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{ background: "repeating-linear-gradient(100deg, rgba(255,255,255,.06) 0 2px, transparent 2px 60px)" }}
        />
      )}
      <Bubbles count={deep ? 30 : 18} height={820} />
      {deep && (
        <p className="enter relative font-display text-[64px] tabular-nums leading-none text-[#bfe7ee]">
          −{depth}
          <span className="text-[26px]"> m</span>
        </p>
      )}
      <div className={`enter relative ${deep ? "mt-6" : "mt-10"}`} style={{ animationDuration: "1.2s" }}>
        <WineVisual id={wine} size={deep ? 250 : 300} />
      </div>
      <div className="relative mt-8 flex flex-col items-center gap-2 text-center">
        {STORY[wine].map((line, i) => (
          <p
            key={line.en}
            className={`enter ${i === 0 ? "font-display text-[30px] italic text-champagne" : "text-[15px] text-pearl"}`}
            style={{ animationDelay: `${0.5 + i * 0.7}s` }}
          >
            {line[lang]}
          </p>
        ))}
      </div>
      <button onClick={onDone} className="btn-ghost relative mt-auto px-6 py-2 text-[11px] uppercase tracking-[0.25em]">
        {t("skip", lang)}
      </button>
    </div>
  );
}
