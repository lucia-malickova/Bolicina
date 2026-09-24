import type { CSSProperties } from "react";

// Deterministic pseudo-random layout so server and client render the same markup.
function r(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export default function Bubbles({ count = 18, height = 900, className = "" }: { count?: number; height?: number; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {Array.from({ length: count }, (_, i) => {
        const size = `${(3 + r(i, 1) * 11).toFixed(1)}px`;
        const style = {
          left: `${(r(i, 2) * 100).toFixed(2)}%`,
          width: size,
          height: size,
          "--t": `${(9 + r(i, 3) * 11).toFixed(2)}s`,
          "--d": `${(-r(i, 4) * 20).toFixed(2)}s`,
          "--dx": `${((r(i, 5) - 0.5) * 60).toFixed(1)}px`,
          "--o": `${(0.25 + r(i, 6) * 0.45).toFixed(2)}`,
          "--h": `${height}px`,
        } as CSSProperties;
        return <span key={i} className="bubble" style={style} />;
      })}
    </div>
  );
}
