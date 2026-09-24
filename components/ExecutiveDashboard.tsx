"use client";

import { Crown, Droplets, ShieldCheck, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SensoryChart from "./SensoryChart";

interface Metric {
  label: string;
  value: React.ReactNode;
  caption: string;
  Icon: LucideIcon;
}

const METRICS: Metric[] = [
  {
    label: "VIP Profiles Registered",
    value: "1,428",
    caption: "Sensory signatures captured to date",
    Icon: Users,
  },
  {
    label: "Perceived Freshness Index",
    value: (
      <>
        98.2<span className="text-[0.5em] text-gold">%</span>
      </>
    ),
    caption: "Guests rating acidity Crisp or Harmonic",
    Icon: Droplets,
  },
  {
    label: "Leading Signature",
    value: <em className="text-[0.8em]">Gold Reserve</em>,
    caption: "Most-registered cuvée across VIP profiles",
    Icon: Crown,
  },
];

export default function ExecutiveDashboard() {
  return (
    <div className="fade-up flex flex-col gap-8 px-4 pb-16 sm:px-8 lg:px-16">
      <section className="flex flex-col justify-between gap-6 pt-12 lg:flex-row lg:items-end lg:pt-18">
        <div className="flex flex-col gap-4">
          <span className="text-[11px] uppercase tracking-[0.5em] text-gold">
            Owner&apos;s Briefing
          </span>
          <h1 className="font-serif text-4xl leading-[1.05] text-ivory sm:text-5xl lg:text-6xl">
            Executive <em className="text-gold">Intelligence</em>
          </h1>
          <p className="max-w-[600px] text-[15px] font-light leading-[1.8] text-mist">
            Live sensory data gathered from every VIP Client Experience,
            distilled for the Maison.
          </p>
        </div>
        <span className="flex h-11 items-center gap-2.5 self-start border border-gold/40 px-4.5 text-[10px] uppercase tracking-[0.35em] text-gold lg:self-auto">
          <span className="size-1.5 animate-pulse bg-gold shadow-[0_0_10px_#d4af37]" />
          Live feed
        </span>
      </section>

      <section
        aria-label="Key metrics"
        className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8"
      >
        {METRICS.map(({ label, value, caption, Icon }) => (
          <article
            key={label}
            className="gold-glow flex flex-col gap-5 border border-gold/40 bg-onyx p-7 lg:p-9"
          >
            <div className="flex items-center justify-between text-gold">
              <span className="text-[10px] uppercase tracking-[0.4em]">{label}</span>
              <Icon aria-hidden strokeWidth={1.4} className="size-5 shrink-0" />
            </div>
            <span className="font-serif text-5xl leading-none text-ivory lg:text-[64px]">
              {value}
            </span>
            <div className="gold-rule" />
            <span className="text-xs font-light text-[#a8a398]">{caption}</span>
          </article>
        ))}
      </section>

      <section
        aria-label="Market Sensory Mapping"
        className="gold-glow flex flex-col gap-8 border border-gold/40 bg-onyx p-6 sm:p-10"
      >
        <div className="flex flex-col gap-2">
          <h2 className="font-serif text-[30px] text-ivory">Market Sensory Mapping</h2>
          <span className="text-[13px] font-light text-[#a8a398]">
            Dominant note selected in Sensory Signature, share of profiles (%)
          </span>
        </div>
        <SensoryChart />
      </section>

      <section className="flex items-center gap-5 border border-gold/55 px-5 py-6 sm:px-8">
        <div className="flex size-12 shrink-0 items-center justify-center border border-gold text-gold">
          <ShieldCheck aria-hidden strokeWidth={1.4} className="size-[22px]" />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold">
            Secure Local Infrastructure
          </span>
          <span className="text-[13px] font-light text-mist">
            All guest profiles and AI inference are processed on the Maison&apos;s
            own on-premise servers. No data leaves the estate · GDPR-aligned.
          </span>
        </div>
      </section>
    </div>
  );
}
