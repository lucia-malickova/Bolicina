import { WINES } from "@/lib/wines";
import type { WineId } from "@/lib/wines";

/** A bottle standing in its own halo; Audace is shown by its under-sea photo instead. */
export default function WineVisual({ id, size = 220, className = "" }: { id: WineId; size?: number; className?: string }) {
  const w = WINES[id];
  if (id === "audace") {
    return (
      <div
        className={`relative shrink-0 overflow-hidden rounded-full ${className}`}
        style={{ width: size * 0.78, height: size * 0.78, boxShadow: `0 0 60px ${w.accent}55, inset 0 0 0 1px rgba(232,214,168,.4)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={w.image} alt={`${w.name}, ${w.denomination}`} className="size-full object-cover object-[50%_62%]" />
        <div className="absolute inset-0 rounded-full" style={{ boxShadow: "inset 0 0 40px rgba(0,0,0,.55)" }} />
      </div>
    );
  }
  return (
    <div className={`relative flex shrink-0 items-end justify-center ${className}`} style={{ width: size * 0.62, height: size }}>
      <div
        aria-hidden
        className="absolute bottom-[8%] left-1/2 aspect-square w-[150%] -translate-x-1/2 rounded-full blur-2xl"
        style={{ background: `radial-gradient(circle, ${w.accent}44 0%, ${w.accent}10 45%, transparent 70%)` }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={w.image}
        alt={`${w.name}, ${w.denomination}`}
        className="relative h-full w-auto object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.6)]"
      />
      <div aria-hidden className="absolute -bottom-1 left-1/2 h-3 w-2/3 -translate-x-1/2 rounded-full bg-black/60 blur-md" />
    </div>
  );
}
