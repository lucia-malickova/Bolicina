"use client";

import { useState } from "react";
import LangToggle from "@/components/serena/LangToggle";
import SommelierApp from "@/components/serena/phone/SommelierApp";
import type { Lang } from "@/lib/i18n";
import { useTastings } from "@/lib/useTastings";

export default function GuestApp() {
  const [lang, setLang] = useState<Lang>("it");
  const { add } = useTastings(false);

  return (
    <div className="relative h-dvh">
      <div className="absolute right-4 top-[max(env(safe-area-inset-top),12px)] z-30">
        <LangToggle lang={lang} onChange={setLang} />
      </div>
      <SommelierApp lang={lang} persona={null} onTasting={add} framed={false} />
    </div>
  );
}
