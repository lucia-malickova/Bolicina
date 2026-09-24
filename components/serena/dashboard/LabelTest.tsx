import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import { LABEL_BASE } from "@/lib/market";
import type { Vote } from "@/lib/market";
import { SEGMENTS } from "@/lib/personas";
import { int } from "@/lib/wines";
import { Classic, Contemporary } from "../phone/LabelVote";

const A = "#b8893a";
const B = "#2f95b3";

export default function LabelTest({ votes, lang }: { votes: Vote[]; lang: Lang }) {
  const rows = SEGMENTS.map((s) => {
    const [a0, b0] = LABEL_BASE[s];
    const a = a0 + votes.filter((v) => v.segment === s && v.choice === "a").length;
    const b = b0 + votes.filter((v) => v.segment === s && v.choice === "b").length;
    return { s, a, b, pa: a / (a + b) };
  });
  const total = rows.reduce((n, r) => n + r.a + r.b, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        {(
          [
            [A, "labelA", <Classic key="a" />],
            [B, "labelB", <Contemporary key="b" />],
          ] as const
        ).map(([color, key, art]) => (
          <div key={key} className="flex items-center gap-3">
            <div className="w-14 overflow-hidden rounded-md">{art}</div>
            <span className="flex items-center gap-2 text-[12px] text-pearl">
              <span className="size-2.5 rounded-full" style={{ background: color }} />
              {t(key, lang)}
            </span>
          </div>
        ))}
      </div>
      <ul className="flex flex-col gap-2.5">
        {rows.map((r) => (
          <li key={r.s} className="grid grid-cols-[48px_36px_1fr_36px] items-center gap-2 text-[12px]">
            <span className="tabular-nums text-mist">{r.s}</span>
            <span className="text-right tabular-nums text-pearl">{Math.round(r.pa * 100)}%</span>
            <span className="flex h-3 gap-[2px] overflow-hidden rounded-full">
              <span className="h-full rounded-l-full transition-[width] duration-500" style={{ width: `${r.pa * 100}%`, background: A }} />
              <span className="h-full flex-1 rounded-r-full" style={{ background: B }} />
            </span>
            <span className="tabular-nums text-pearl">{Math.round((1 - r.pa) * 100)}%</span>
          </li>
        ))}
      </ul>
      <p className="text-[11px] text-smoke">
        {int(total, lang)} {t("lblVotes", lang)}
        {votes.length > 0 && <span className="text-champagne"> · +{votes.length} {t("thisSession", lang)}</span>}
      </p>
    </div>
  );
}
