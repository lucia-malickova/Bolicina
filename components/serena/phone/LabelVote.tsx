"use client";

import { useState } from "react";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import { LABEL_BASE } from "@/lib/market";
import type { LabelChoice } from "@/lib/market";
import type { Segment } from "@/lib/personas";

export function Classic() {
  return (
    <svg viewBox="0 0 120 160" className="w-full" aria-hidden>
      <rect width="120" height="160" rx="6" fill="#f3ead6" />
      <rect x="6" y="6" width="108" height="148" rx="3" fill="none" stroke="#b8893a" strokeWidth="1.2" />
      <rect x="10" y="10" width="100" height="140" rx="2" fill="none" stroke="#b8893a" strokeWidth="0.5" />
      <text x="60" y="46" textAnchor="middle" fontFamily="Georgia, serif" fontSize="17" letterSpacing="3" fill="#2a2418">SERENA</text>
      <text x="60" y="58" textAnchor="middle" fontFamily="Georgia, serif" fontSize="6" letterSpacing="3" fill="#8a6a2c">1881</text>
      <path d="M36 72 C 48 64, 72 64, 84 72" fill="none" stroke="#b8893a" strokeWidth="0.8" />
      <text x="60" y="100" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="15" fill="#2a2418">Rosé</text>
      <text x="60" y="114" textAnchor="middle" fontFamily="Georgia, serif" fontSize="6" letterSpacing="2" fill="#8a6a2c">BRUT · MILLESIMATO</text>
      <circle cx="60" cy="135" r="6" fill="none" stroke="#b8893a" strokeWidth="0.8" />
      <text x="60" y="137.5" textAnchor="middle" fontFamily="Georgia, serif" fontSize="6" fill="#8a6a2c">S</text>
    </svg>
  );
}

export function Contemporary() {
  return (
    <svg viewBox="0 0 120 160" className="w-full" aria-hidden>
      <defs>
        <linearGradient id="lb" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1a1030" />
          <stop offset="1" stopColor="#0b1a2a" />
        </linearGradient>
      </defs>
      <rect width="120" height="160" rx="6" fill="url(#lb)" />
      {[
        [30, 40, 18],
        [82, 30, 10],
        [70, 70, 24],
        [28, 100, 8],
        [92, 118, 14],
        [50, 132, 6],
      ].map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="none" stroke="#f4a7c0" strokeOpacity="0.7" strokeWidth="1.2" />
      ))}
      <text x="12" y="150" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="22" fill="#f7e9c8">serena</text>
      <text x="108" y="18" textAnchor="end" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="8" letterSpacing="2" fill="#f4a7c0">ROSÉ</text>
    </svg>
  );
}

export default function LabelVote({
  lang,
  segment,
  onVote,
  onDone,
}: {
  lang: Lang;
  segment: Segment;
  onVote: (c: LabelChoice) => void;
  onDone: () => void;
}) {
  const [picked, setPicked] = useState<LabelChoice | null>(null);
  const [a, b] = LABEL_BASE[segment];
  const same = picked ? Math.round((100 * ((picked === "a" ? a : b) + 1)) / (a + b + 1)) : 0;

  const pick = (c: LabelChoice) => {
    if (picked) return;
    setPicked(c);
    onVote(c);
  };

  return (
    <div className="enter flex flex-col items-center px-5 pb-10">
      <h2 className="self-start font-display text-[32px] italic leading-tight">{t("labelTitle", lang)}</h2>
      <p className="self-start text-[12px] text-mist">{t("labelLead", lang)}</p>
      <div className="mt-6 grid w-full grid-cols-2 gap-4">
        {(
          [
            ["a", "labelA", <Classic key="a" />],
            ["b", "labelB", <Contemporary key="b" />],
          ] as const
        ).map(([c, label, art]) => (
          <button
            key={c}
            onClick={() => pick(c)}
            aria-pressed={picked === c}
            className={`flex flex-col items-center gap-3 rounded-[22px] p-3 transition-all duration-500 ${
              picked === c ? "scale-[1.04] bg-champagne/10 ring-1 ring-champagne" : picked ? "opacity-40" : "glass hover:scale-[1.02]"
            }`}
          >
            <div className="w-full overflow-hidden rounded-[10px] shadow-[0_18px_30px_rgba(0,0,0,.5)]">{art}</div>
            <span className="text-[12px] uppercase tracking-[0.2em] text-pearl">{t(label, lang)}</span>
          </button>
        ))}
      </div>
      {picked && (
        <div className="enter mt-8 flex flex-col items-center gap-4 text-center">
          <p className="font-display text-[24px] leading-snug text-champagne">{t("labelResult", lang).replace("{p}", String(same))}</p>
          <button onClick={onDone} className="btn-ghost px-8 py-3 text-[12px] uppercase tracking-[0.2em]">
            {t("done", lang)}
          </button>
        </div>
      )}
    </div>
  );
}
