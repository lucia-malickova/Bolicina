"use client";

import { useState } from "react";
import { Gift as GiftIcon } from "lucide-react";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import { WINES } from "@/lib/wines";
import type { WineId } from "@/lib/wines";
import WineVisual from "../WineVisual";

export default function Gift({ lang, wine, from, onDone }: { lang: Lang; wine: WineId; from: string; onDone: () => void }) {
  const w = WINES[wine];
  const [to, setTo] = useState("");
  const [msg, setMsg] = useState(
    lang === "it" ? `Ho pensato a te: ${w.name}. ${w.pitch.it}` : `I thought of you: ${w.name}. ${w.pitch.en}`,
  );
  const [sent, setSent] = useState<"shared" | "copied" | null>(null);

  const send = async () => {
    const url = `${window.location.origin}/app?dono=${wine}&da=${encodeURIComponent(from.slice(0, 30))}`;
    const text = `${to ? `${to}, ` : ""}${msg}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Bollicine", text, url });
        setSent("shared");
        return;
      }
    } catch {
      return;
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
    } catch {}
    setSent("copied");
  };

  return (
    <div className="enter flex flex-col items-center px-5 pb-10">
      <h2 className="self-start font-display text-[34px] italic leading-tight">{t("giftTitle", lang)}</h2>
      <p className="self-start text-[12px] text-mist">{t("giftLead", lang)}</p>
      <div className="relative mt-4 flex h-[200px] items-end">
        <span aria-hidden className="pulse-ring absolute inset-x-6 bottom-6 top-6 rounded-full border border-champagne/40" />
        <WineVisual id={wine} size={190} />
      </div>
      {sent ? (
        <div className="enter mt-6 flex flex-col items-center gap-3 text-center">
          <GiftIcon strokeWidth={1.2} className="size-8 text-champagne" />
          <p className="font-display text-[26px] leading-tight">{t("giftSent", lang)}</p>
          <p className="max-w-[260px] text-[12px] text-mist">{t(sent === "shared" ? "giftSharedHint" : "giftCopiedHint", lang)}</p>
          <button onClick={onDone} className="btn-ghost mt-3 px-8 py-3 text-[12px] uppercase tracking-[0.2em]">
            {t("done", lang)}
          </button>
        </div>
      ) : (
        <div className="mt-5 flex w-full flex-col gap-3">
          <input
            value={to}
            onChange={(e) => setTo(e.target.value.slice(0, 30))}
            placeholder={t("giftTo", lang)}
            className="glass rounded-full px-5 py-3 text-[14px] text-pearl placeholder:text-smoke focus:outline-none"
          />
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value.slice(0, 280))}
            rows={4}
            className="glass resize-none rounded-[22px] px-5 py-3 text-[14px] leading-relaxed text-pearl focus:outline-none"
          />
          <button onClick={send} className="btn mt-2 flex items-center justify-center gap-2 py-3.5 text-[13px] font-semibold uppercase tracking-[0.2em]">
            <GiftIcon strokeWidth={1.6} className="size-4" />
            {t("giftSend", lang)}
          </button>
        </div>
      )}
    </div>
  );
}
