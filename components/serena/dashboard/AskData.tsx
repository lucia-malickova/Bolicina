"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import type { Row } from "@/lib/insights";
import { QUESTIONS, answer, routeQuestion } from "@/lib/simulate";
import type { Question } from "@/lib/simulate";

export default function AskData({ rows, lang }: { rows: Row[]; lang: Lang }) {
  const [asked, setAsked] = useState<{ key: Question | null; text: string } | null>(null);
  const [draft, setDraft] = useState("");
  const [shown, setShown] = useState(0);

  const ask = (key: Question | null, text: string) => {
    setAsked({ key, text });
    setShown(0);
  };
  const label = asked ? (asked.key ? QUESTIONS[asked.key][lang] : asked.text) : "";
  const reply = asked ? (asked.key ? answer(rows, asked.key, lang) : t("askUnknown", lang)) : "";

  useEffect(() => {
    if (shown >= reply.length) return;
    const id = setTimeout(() => setShown((n) => Math.min(reply.length, n + 3)), 18);
    return () => clearTimeout(id);
  }, [reply, shown]);

  return (
    <article className="flex flex-col gap-5 rounded-[26px] bg-deep p-6 hairline sm:p-7">
      <div className="flex flex-col gap-1.5">
        <h3 className="font-display text-[28px] leading-tight">{t("askTitle", lang)}</h3>
        <p className="text-[13px] text-mist">{t("askLead", lang)}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(QUESTIONS) as Question[]).map((q) => (
          <button key={q} onClick={() => ask(q, QUESTIONS[q][lang])} className="chip px-3.5 py-2 text-left text-[12px]">
            {QUESTIONS[q][lang]}
          </button>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.trim()) return;
          ask(routeQuestion(draft), draft);
          setDraft("");
        }}
        className="flex items-center gap-2 rounded-full hairline py-1.5 pl-4 pr-1.5"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t("askPlaceholder", lang)}
          className="min-w-0 flex-1 bg-transparent text-[13px] text-pearl placeholder:text-smoke focus:outline-none"
        />
        <button type="submit" aria-label={t("send", lang)} className="btn flex size-8 items-center justify-center">
          <ArrowUp strokeWidth={1.8} className="size-4" />
        </button>
      </form>
      {asked && (
        <div key={label} className="enter flex flex-col gap-3 border-t border-champagne/10 pt-4">
          <p className="text-[12px] text-smoke">{label}</p>
          <p className="font-display text-[21px] leading-snug text-pearl">
            {reply.slice(0, shown)}
            {shown < reply.length && <span className="ml-0.5 inline-block h-4 w-px animate-pulse bg-champagne align-middle" />}
          </p>
        </div>
      )}
    </article>
  );
}
