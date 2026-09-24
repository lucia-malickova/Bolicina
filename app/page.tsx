"use client";

import { useState } from "react";
import { Lock, ServerCog, ShieldCheck } from "lucide-react";
import ExecutiveDashboard from "@/components/ExecutiveDashboard";
import VipExperience from "@/components/VipExperience";
import type { SensoryProfile } from "@/components/data";

type View = "vip" | "executive";

const TABS: { id: View; label: string; kicker: string }[] = [
  { id: "vip", label: "VIP Client Experience", kicker: "Sommelier & 6s Test" },
  { id: "executive", label: "Executive Intelligence", kicker: "The Owner's Hidden Gold" },
];

const TRUST = [
  { Icon: ServerCog, text: "On-premise open-weights LLM" },
  { Icon: ShieldCheck, text: "GDPR by design" },
  { Icon: Lock, text: "Zero data egress" },
];

export default function Home() {
  const [view, setView] = useState<View>("vip");
  const [profiles, setProfiles] = useState<SensoryProfile[]>([]);

  const addProfile = (p: Omit<SensoryProfile, "id">) =>
    setProfiles((prev) => [...prev, { ...p, id: prev.length + 1 }]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b border-gold/15 bg-[#080808]">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-x-8 gap-y-1 px-4 py-2 text-[9px] uppercase tracking-[0.35em] text-ash sm:justify-end sm:px-8 lg:px-16">
          {TRUST.map(({ Icon, text }) => (
            <span key={text} className="flex items-center gap-2">
              <Icon aria-hidden strokeWidth={1.4} className="size-3 text-gold" />
              {text}
            </span>
          ))}
        </div>
      </div>

      <header className="z-20 lg:sticky lg:top-0 border-b border-gold/35 bg-noir/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-5 sm:px-8 lg:h-[96px] lg:flex-row lg:items-center lg:justify-between lg:px-16 lg:py-0">
          <div className="flex items-baseline gap-4">
            <span className="font-serif text-2xl tracking-[0.32em] text-gold sm:text-3xl">
              BOLLICINA
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.4em] text-ash sm:inline">
              powered by M.I.A.
            </span>
          </div>
          <nav aria-label="Views" role="tablist" className="flex w-full border border-gold/50 lg:w-auto">
            {TABS.map((tab) => {
              const active = view === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setView(tab.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 px-4 py-2 transition-colors duration-300 sm:px-7 lg:flex-none ${
                    active ? "bg-gold text-noir" : "text-[#cfcac0] hover:text-gold-light"
                  }`}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] sm:text-[11px] sm:tracking-[0.28em]">
                    {tab.label}
                  </span>
                  <span
                    className={`font-serif text-[11px] italic tracking-wide sm:text-xs ${
                      active ? "text-noir/75" : "text-ash"
                    }`}
                  >
                    {tab.kicker}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1440px] flex-1">
        {/* Both views stay mounted so chat history and the test survive tab switches. */}
        <div hidden={view !== "vip"}>
          <VipExperience onRegister={addProfile} />
        </div>
        <div hidden={view !== "executive"}>
          <ExecutiveDashboard profiles={profiles} visible={view === "executive"} />
        </div>
      </main>

      <footer className="border-t border-gold/20">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-7 text-[10px] uppercase tracking-[0.35em] text-[#7d7a72] sm:flex-row sm:justify-between sm:px-8 lg:px-16">
          <span>Built by Modelos Inteligencia Artificial S.L. · M.I.A.</span>
          <span>Bollicina · Proof of Concept</span>
        </div>
      </footer>
    </div>
  );
}
