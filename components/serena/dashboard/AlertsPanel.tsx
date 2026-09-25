import { Sparkle, TrendingDown, TrendingUp } from "lucide-react";
import type { Alert } from "@/lib/alerts";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

const ICON = { up: TrendingUp, down: TrendingDown, new: Sparkle };

export default function AlertsPanel({ items, lang }: { items: Alert[]; lang: Lang }) {
  return (
    <div className="flex flex-col gap-2.5">
      {items.map((a) => {
        const Icon = ICON[a.trend];
        return (
          <article key={a.id} className="enter flash-in flex gap-3 rounded-[18px] bg-night/70 p-3.5 backdrop-blur hairline">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon-192.png" alt="" className="size-9 shrink-0 rounded-[10px]" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-smoke">
                <span>Bollicine</span>
                <span className="normal-case tracking-normal">{a.when[lang]}</span>
              </div>
              <p className="flex items-start gap-1.5 text-[13px] font-semibold leading-snug text-pearl">
                <Icon strokeWidth={1.8} className="mt-0.5 size-3.5 shrink-0 text-champagne" aria-label={t(a.trend === "down" ? "trendDown" : a.trend === "up" ? "trendUp" : "trendNew", lang)} />
                {a.title[lang]}
              </p>
              <p className="text-[12px] leading-snug text-mist">{a.body[lang]}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
