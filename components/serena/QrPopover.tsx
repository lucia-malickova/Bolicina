"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { QrCode, X } from "lucide-react";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

export default function QrPopover({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const [svg, setSvg] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!open || svg) return;
    const target = `${window.location.origin}/app`;
    setUrl(target);
    QRCode.toString(target, { type: "svg", margin: 1, color: { dark: "#0a0b0e", light: "#efe2bd" } })
      .then(setSvg)
      .catch(() => {});
  }, [open, svg]);

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="btn-ghost flex items-center gap-2 px-4 py-2 text-[11px] uppercase tracking-[0.2em]">
        <QrCode strokeWidth={1.4} className="size-4" />
        <span className="hidden sm:inline">{t("tryPhone", lang)}</span>
      </button>
      {open && (
        <div className="enter absolute right-0 top-12 z-50 w-[260px] rounded-[24px] border border-champagne/25 bg-deep p-5 shadow-2xl">
          <button onClick={() => setOpen(false)} aria-label="Close" className="absolute right-3 top-3 text-smoke hover:text-pearl">
            <X strokeWidth={1.4} className="size-4" />
          </button>
          <p className="font-display text-[20px] leading-tight">{t("tryPhone", lang)}</p>
          <p className="mt-1 text-[12px] text-mist">{t("tryPhoneHint", lang)}</p>
          <div className="mt-4 overflow-hidden rounded-2xl" dangerouslySetInnerHTML={{ __html: svg }} />
          <p className="mt-3 break-all text-center text-[10px] text-smoke">{url}</p>
        </div>
      )}
    </div>
  );
}
