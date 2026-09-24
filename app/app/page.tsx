"use client";

import { useEffect, useState } from "react";
import { CloudOff } from "lucide-react";
import LangToggle from "@/components/serena/LangToggle";
import SommelierApp from "@/components/serena/phone/SommelierApp";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import { useTastings } from "@/lib/useTastings";
import { useVotes } from "@/lib/useVotes";
import { isVenue } from "@/lib/venues";
import type { VenueId } from "@/lib/venues";
import { WINES } from "@/lib/wines";
import type { WineId } from "@/lib/wines";

export default function GuestApp() {
  const [lang, setLang] = useState<Lang>("it");
  const [online, setOnline] = useState(true);
  const [gift, setGift] = useState<{ wine: WineId; from: string } | undefined>();
  const { tastings, add, pending } = useTastings(false, "bollicine.mine");
  const { vote } = useVotes(false);
  const [venue, setVenue] = useState<VenueId | undefined>();

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const q = new URLSearchParams(window.location.search);
    // A venue's own QR code (on its menu or table) opens /app?locale=<venue>.
    const locale = q.get("locale");
    if (isVenue(locale)) setVenue(locale);
    const dono = q.get("dono");
    if (dono && Object.hasOwn(WINES, dono)) setGift({ wine: dono as WineId, from: (q.get("da") || "").slice(0, 30) || "Bollicine" });
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  return (
    <div className="relative h-dvh">
      <div className="absolute inset-x-4 top-[max(env(safe-area-inset-top),12px)] z-30 flex items-center justify-between gap-2">
        {!online || pending > 0 ? (
          <span className="enter flex items-center gap-2 rounded-full bg-night/80 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-champagne backdrop-blur hairline">
            <CloudOff strokeWidth={1.5} className="size-3.5" />
            {online ? `${pending} ${t("pendingSync", lang)}` : t("offline", lang)}
          </span>
        ) : (
          <span />
        )}
        <LangToggle lang={lang} onChange={setLang} />
      </div>
      <SommelierApp lang={lang} persona={null} onTasting={add} framed={false} history={tastings}
        gift={gift}
        venue={venue}
        onVote={(choice) => {
          let segment = "25-34";
          try {
            segment = localStorage.getItem("serena.segment") || segment;
          } catch {}
          vote({ id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`, choice, segment });
        }}
      />
    </div>
  );
}
