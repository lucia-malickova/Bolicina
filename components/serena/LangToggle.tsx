import type { Lang } from "@/lib/i18n";

export default function LangToggle({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div role="group" aria-label="Language" className="flex rounded-full hairline p-1">
      {(["it", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          aria-pressed={lang === l}
          data-on={lang === l}
          className="chip border-transparent px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em]"
        >
          {l}
        </button>
      ))}
    </div>
  );
}
