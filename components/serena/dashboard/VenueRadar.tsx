import { AlertTriangle, CheckCircle2, Eye } from "lucide-react";
import { CITY_NAMES } from "@/lib/geo";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import { VENUES } from "@/lib/venues";
import type { RadarStatus, VenueRadar as Radar } from "@/lib/venues";
import { WINES } from "@/lib/wines";

const STATUS: Record<RadarStatus, { key: "radarOk" | "radarWatch" | "radarCheck"; Icon: typeof Eye; color: string }> = {
  check: { key: "radarCheck", Icon: AlertTriangle, color: "#e07a5f" },
  watch: { key: "radarWatch", Icon: Eye, color: "#e8d6a8" },
  ok: { key: "radarOk", Icon: CheckCircle2, color: "#827e74" },
};
const ORDER: RadarStatus[] = ["check", "watch", "ok"];

export default function VenueRadar({ items, lang }: { items: Radar[]; lang: Lang }) {
  const sorted = [...items].sort((a, b) => ORDER.indexOf(a.status) - ORDER.indexOf(b.status));
  return (
    <div className="flex flex-col gap-2">
      {sorted.map((r) => {
        const v = VENUES[r.id];
        const s = STATUS[r.status];
        return (
          <div
            key={r.id}
            className={`flex items-start gap-3 rounded-[16px] p-3 ${r.status === "check" ? "bg-[#e07a5f]/10 ring-1 ring-[#e07a5f]/40" : "hairline"}`}
          >
            <s.Icon strokeWidth={1.6} className="mt-0.5 size-4 shrink-0" style={{ color: s.color }} aria-hidden />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-[13px] font-semibold text-pearl">
                  {v.name} <span className="font-normal text-smoke">· {CITY_NAMES[v.city]}</span>
                </span>
                <span className="shrink-0 text-[10px] uppercase tracking-[0.2em]" style={{ color: s.color }}>
                  {t(s.key, lang)}
                </span>
              </div>
              <span className="text-[12px] text-mist">
                {WINES[v.wine].name} · {r.reason[lang]}
              </span>
            </div>
          </div>
        );
      })}
      <p className="mt-2 text-[11px] text-smoke">{t("radarNote", lang)}</p>
    </div>
  );
}
