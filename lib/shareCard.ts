"use client";

import type { Identity } from "./tasting";
import type { Lang } from "./i18n";

function family(varName: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return v || fallback;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/** Draws a 1080×1350 (Instagram portrait) profile card and returns it as a PNG blob. */
export async function renderShareCard(id: Identity, lang: Lang): Promise<Blob | null> {
  await document.fonts.ready;
  const display = family("--font-cormorant", "Georgia");
  const ui = family("--font-manrope", "system-ui");
  const W = 1080;
  const H = 1350;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");
  if (!ctx) return null;

  const bg = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, H);
  bg.addColorStop(0, "#2a2418");
  bg.addColorStop(0.55, "#0a0b0e");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Rising bubbles
  for (let i = 0; i < 38; i++) {
    const x = ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;
    const y = ((Math.sin(i * 78.233) * 12543.123) % 1 + 1) % 1;
    const r = 3 + (i % 7) * 2.2;
    if (y > 0.66 && x > 0.2 && x < 0.8) continue;
    ctx.beginPath();
    ctx.arc(x * W, y * H, r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(243,227,182,0.35)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  const cx = W / 2;
  const cy = 560;
  const R = 330;
  ctx.save();
  ctx.shadowColor = "rgba(232,214,168,0.45)";
  ctx.shadowBlur = 90;
  const orb = ctx.createRadialGradient(cx - R * 0.36, cy - R * 0.5, 10, cx, cy, R);
  orb.addColorStop(0, "#fffaf0");
  orb.addColorStop(0.38, "#efdfb4");
  orb.addColorStop(1, "#c9a55c");
  ctx.fillStyle = orb;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(10,11,14,0.65)";
  ctx.font = `500 26px ${ui}`;
  ctx.fillText(lang === "it" ? "I L   M I O   P R O F I L O" : "M Y   P R O F I L E", cx, cy - 110);

  ctx.fillStyle = "#0a0b0e";
  ctx.font = `italic 500 104px ${display}`;
  const nameLines = wrap(ctx, id.name[lang], R * 1.6);
  const top = cy - ((nameLines.length - 1) * 100) / 2 + 20;
  nameLines.forEach((l, i) => ctx.fillText(l, cx, top + i * 100));

  ctx.fillStyle = "#f3eee4";
  ctx.font = `400 36px ${ui}`;
  id.traits.forEach((tr, i) => ctx.fillText(tr[lang], cx, 1000 + i * 54));

  ctx.fillStyle = "#e8d6a8";
  ctx.font = `italic 500 72px ${display}`;
  ctx.fillText("Bollicine", cx, 1238);
  ctx.fillStyle = "#827e74";
  ctx.font = `500 22px ${ui}`;
  ctx.fillText("S E R E N A   1 8 8 1", cx, 1280);

  return new Promise((resolve) => c.toBlob(resolve, "image/png"));
}

/** Opens the phone's share sheet with the card, or downloads it where sharing files isn't supported. */
export async function shareCard(id: Identity, lang: Lang) {
  const blob = await renderShareCard(id, lang);
  if (!blob) return;
  const file = new File([blob], "bollicine-profilo.png", { type: "image/png" });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title: "Bollicine" });
      return;
    } catch {
      return;
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
