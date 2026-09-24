"use client";

import { useState } from "react";
import ExecutiveDashboard from "@/components/ExecutiveDashboard";
import VipExperience from "@/components/VipExperience";

type View = "vip" | "executive";

const TABS: { id: View; label: string }[] = [
  { id: "vip", label: "VIP Client Experience" },
  { id: "executive", label: "Executive Intelligence" },
];

export default function Home() {
  const [view, setView] = useState<View>("vip");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-gold/35 bg-noir/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-5 sm:px-8 lg:h-[88px] lg:flex-row lg:items-center lg:justify-between lg:px-16 lg:py-0">
          <div className="flex items-baseline gap-4">
            <span className="font-serif text-2xl tracking-[0.32em] text-gold sm:text-3xl">
              BOLLICINA
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.4em] text-ash sm:inline">
              Maison · AI Sommelier
            </span>
          </div>
          <nav
            aria-label="Views"
            role="tablist"
            className="flex w-full border border-gold/50 lg:w-auto"
          >
            {TABS.map((tab) => {
              const active = view === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setView(tab.id)}
                  className={`h-11 flex-1 px-4 text-[10px] font-medium uppercase tracking-[0.24em] transition-colors duration-300 sm:px-7 sm:text-[11px] sm:tracking-[0.28em] lg:flex-none ${
                    active
                      ? "bg-gold text-noir"
                      : "text-[#cfcac0] hover:text-gold-light"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1440px] flex-1">
        {view === "vip" ? <VipExperience /> : <ExecutiveDashboard />}
      </main>

      <footer className="border-t border-gold/20">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-7 text-[10px] uppercase tracking-[0.35em] text-[#7d7a72] sm:flex-row sm:justify-between sm:px-8 lg:px-16">
          <span>Bollicina · Metodo Classico</span>
          <span>Please enjoy responsibly</span>
        </div>
      </footer>
    </div>
  );
}
