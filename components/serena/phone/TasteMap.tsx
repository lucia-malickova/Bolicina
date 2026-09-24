import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import { WINES, WINE_IDS, realSweetness } from "@/lib/wines";
import type { Aroma } from "@/lib/wines";

export interface TastePoint {
  sweet: number;
  aroma: Aroma;
}

// Vertical axis: from saline/mineral (bottom) to fruity/floral (top).
const AROMA_Y: Record<Aroma, number> = { mineral: 0.12, apple: 0.45, flowers: 0.7, yellowFruit: 0.9 };

const S = 300;
const PAD = 26;
const px = (sweet: number) => PAD + ((sweet - 1) / 4) * (S - 2 * PAD);
const py = (y: number) => S - PAD - y * (S - 2 * PAD);
// Small deterministic spread so repeated tastings don't sit on one pixel.
const jitter = (i: number) => Math.sin(i * 12.9898) * 0.035;

export default function TasteMap({ lang, points }: { lang: Lang; points: TastePoint[] }) {
  const pts = points.map((p, i) => ({ x: p.sweet, y: AROMA_Y[p.aroma] + jitter(i) }));
  const recent = pts.slice(-3);
  const cur = recent.length
    ? { x: recent.reduce((s, p) => s + p.x, 0) / recent.length, y: recent.reduce((s, p) => s + p.y, 0) / recent.length }
    : null;
  const wines = WINE_IDS.map((id) => ({ id, x: realSweetness(WINES[id]), y: AROMA_Y[WINES[id].aromas[0]] }));
  const near = cur
    ? [...wines].sort((a, b) => Math.hypot((a.x - cur.x) / 4, a.y - cur.y) - Math.hypot((b.x - cur.x) / 4, b.y - cur.y)).slice(0, 3)
    : [];

  const labelY = new Map<string, number>();
  [...near].sort((a, b) => py(a.y) - py(b.y)).forEach((w, i, arr) => {
    const prev = i ? labelY.get(arr[i - 1].id)! : -Infinity;
    labelY.set(w.id, Math.max(py(w.y) + 3, prev + 12));
  });

  let drift = t("mapStable", lang);
  if (pts.length >= 2 && cur) {
    const dx = cur.x - pts[0].x;
    const dy = cur.y - pts[0].y;
    if (Math.abs(dx) >= Math.abs(dy) * 4 && Math.abs(dx) > 0.35) drift = t(dx < 0 ? "mapToDry" : "mapToSoft", lang);
    else if (Math.abs(dy) > 0.12) drift = t(dy < 0 ? "mapToMineral" : "mapToFruity", lang);
  }

  return (
    <div className="enter flex flex-col px-5 pb-10">
      <h2 className="font-display text-[34px] italic leading-tight">{t("myTaste", lang)}</h2>
      <p className="mt-1 text-[12px] text-mist">{t("mapLead", lang)}</p>

      <div className="glass relative mt-5 rounded-[26px] p-3">
        <svg viewBox={`0 0 ${S} ${S}`} className="w-full" role="img" aria-label={t("myTaste", lang)}>
          <defs>
            <radialGradient id="me" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fffaf0" />
              <stop offset="45%" stopColor="#efdfb4" />
              <stop offset="100%" stopColor="#c9a55c" />
            </radialGradient>
          </defs>
          <line x1={S / 2} x2={S / 2} y1={PAD} y2={S - PAD} stroke="rgba(232,214,168,.12)" />
          <line x1={PAD} x2={S - PAD} y1={S / 2} y2={S / 2} stroke="rgba(232,214,168,.12)" />
          <circle cx={S / 2} cy={S / 2} r={S / 2 - PAD} fill="none" stroke="rgba(232,214,168,.08)" />
          <circle cx={S / 2} cy={S / 2} r={(S / 2 - PAD) / 2} fill="none" stroke="rgba(232,214,168,.06)" />
          <text x={PAD} y={S / 2 - 6} className="fill-smoke text-[9px] uppercase tracking-[0.15em]">
            {t("dry", lang)}
          </text>
          <text x={S - PAD} y={S / 2 - 6} textAnchor="end" className="fill-smoke text-[9px] uppercase tracking-[0.15em]">
            {t("sweet", lang)}
          </text>
          <text x={S / 2} y={PAD - 10} textAnchor="middle" className="fill-smoke text-[9px] uppercase tracking-[0.15em]">
            {t("mapFruity", lang)}
          </text>
          <text x={S / 2} y={S - PAD + 18} textAnchor="middle" className="fill-smoke text-[9px] uppercase tracking-[0.15em]">
            {t("mapMineral", lang)}
          </text>

          {wines.map((w) => {
            const isNear = near.some((n) => n.id === w.id);
            return (
              <g key={w.id} opacity={isNear ? 1 : 0.45}>
                <circle cx={px(w.x)} cy={py(w.y)} r={3.5} fill={WINES[w.id].accent} />
                {isNear && (
                  <text x={px(w.x) + 7} y={labelY.get(w.id)} className="fill-mist text-[9px]">
                    {WINES[w.id].name}
                  </text>
                )}
              </g>
            );
          })}

          {pts.length > 1 && (
            <polyline
              points={pts.map((p) => `${px(p.x)},${py(p.y)}`).join(" ")}
              fill="none"
              stroke="rgba(232,214,168,.45)"
              strokeWidth={1.5}
              strokeDasharray="3 4"
            />
          )}
          {pts.map((p, i) => (
            <circle key={i} cx={px(p.x)} cy={py(p.y)} r={3} fill="#e8d6a8" opacity={0.25 + (0.6 * (i + 1)) / pts.length} />
          ))}
          {cur && (
            <g>
              <circle cx={px(cur.x)} cy={py(cur.y)} r={20} fill="rgba(232,214,168,.12)" className="pulse-ring" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
              <circle cx={px(cur.x)} cy={py(cur.y)} r={11} fill="url(#me)" />
            </g>
          )}
        </svg>
        {!cur && (
          <p className="absolute inset-x-10 top-1/2 -translate-y-1/2 text-center text-[13px] leading-relaxed text-mist">{t("mapEmpty", lang)}</p>
        )}
      </div>

      {cur && (
        <>
          <p className="mt-5 font-display text-[24px] italic leading-snug text-champagne">{drift}</p>
          <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-smoke">{t("mapNear", lang)}</p>
          <p className="mt-1 text-[14px] text-pearl">{near.map((n) => WINES[n.id].name).join(" · ")}</p>
        </>
      )}
    </div>
  );
}
