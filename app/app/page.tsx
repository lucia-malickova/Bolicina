"use client";

import { useEffect, useState } from "react";
import { CloudOff } from "lucide-react";
import LangToggle from "@/components/serena/LangToggle";
import SommelierApp from "@/components/serena/phone/SommelierApp";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import { useTastings } from "@/lib/useTastings";

export default function GuestApp() {
  const [lang, setLang] = useState<Lang>("it");
  const [online, setOnline] = useState(true);
  const { tastings, add, pending } = useTastings(false, "bollicine.mine");

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
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
      <SommelierApp lang={lang} persona={null} onTasting={add} framed={false} history={tastings} />
    </div>
  );
}
