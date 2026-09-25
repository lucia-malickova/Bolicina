"use client";

import {
  ArrowRight,
  Crown,
  Droplets,
  Radio,
  Store,
  Truck,
  Users,
  Wine as WineIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BASELINE, SensoryProfile, WINES, sensoryMapping } from "./data";
import MiaCore from "./MiaCore";
import SensoryChart from "./SensoryChart";

// Baseline profiles that rated acidity Crisp or Harmonic (98.2% of 1,428).
const BASELINE_FRESH = 1402;

export default function ExecutiveDashboard({
  profiles,
  visible,
}: {
  profiles: SensoryProfile[];
  visible: boolean;
}) {
  const total = BASELINE.profiles + profiles.length;
  const fresh = BASELINE_FRESH + profiles.filter((p) => p.acidity !== "Soft").length;
  const freshness = ((fresh / total) * 100).toFixed(1);

  const metrics: { label: string; value: React.ReactNode; caption: string; Icon: LucideIcon }[] = [
    {
      label: "Verified Sensory Profiles",
      value: total.toLocaleString("en-US"),
      caption:
        profiles.length > 0
          ? `+${profiles.length} captured live in this session`
          : "Direct consumer signatures, owned by the Maison",
      Icon: Users,
    },
    {
      label: "Perceived Freshness Index",
      value: (
        <>
          {freshness}
          <span className="text-[0.5em] text-gold">%</span>
        </>
      ),
      caption: "Guests rating acidity Crisp or Harmonic",
      Icon: Droplets,
    },
    {
      label: "Leading Signature",
      value: <em className="text-[0.8em]">{BASELINE.leadingSignature}</em>,
      caption: "Most-registered cuvée across VIP profiles",
      Icon: Crown,
    },
  ];

  return (
    <div className="fade-up flex flex-col gap-8 px-4 pb-16 sm:px-8 lg:px-16">
      <section className="flex flex-col justify-between gap-6 pt-12 lg:flex-row lg:items-end lg:pt-16">
        <div className="flex flex-col gap-4">
          <span className="text-[11px] uppercase tracking-[0.5em] text-gold">Owner&apos;s Briefing</span>
          <h1 className="font-serif text-4xl leading-[1.05] text-ivory sm:text-5xl lg:text-6xl">
            Your <em className="text-gold">hidden gold</em>:
            <br className="hidden sm:block" /> the customer behind every bottle.
          </h1>
        </div>
        <span className="flex h-11 items-center gap-2.5 self-start border border-gold/40 px-4 text-[10px] uppercase tracking-[0.35em] text-gold lg:self-auto">
          <span className="size-1.5 animate-pulse bg-gold shadow-[0_0_10px_#d4af37]" />
          Live feed
        </span>
      </section>

      {/* The owner's pain point, and the fix */}
      <section aria-label="Why it matters" className="grid grid-cols-1 border border-gold/40 lg:grid-cols-[1fr_auto_1fr]">
        <div className="flex flex-col gap-5 p-6 sm:p-9">
          <span className="text-[10px] uppercase tracking-[0.4em] text-ash">Today · Traditional distribution</span>
          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-mist">
            <Chip Icon={WineIcon} label="Winery" />
            <ArrowRight aria-hidden strokeWidth={1.2} className="size-4 text-ash" />
            <Chip Icon={Truck} label="Distributor" />
            <ArrowRight aria-hidden strokeWidth={1.2} className="size-4 text-ash" />
            <Chip Icon={Store} label="Retailer" />
            <ArrowRight aria-hidden strokeWidth={1.2} className="size-4 text-ash" />
            <span className="border border-dashed border-ash/60 px-3 py-2 text-ash">Customer ?</span>
          </div>
          <p className="text-sm font-light leading-[1.8] text-mist">
            Every intermediary stands between you and the person who opens the
            bottle. You never learn who they are, what they taste or why they
            come back.
          </p>
        </div>
        <div className="hidden w-px bg-gold/30 lg:block" />
        <div className="flex flex-col gap-5 border-t border-gold/30 bg-[#0e0c07] p-6 sm:p-9 lg:border-t-0">
          <span className="text-[10px] uppercase tracking-[0.4em] text-gold">With M.I.A. · Direct intelligence</span>
          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-ivory">
            <Chip Icon={WineIcon} label="Winery" gold />
            <span className="flex items-center gap-2 text-gold">
              <span className="h-px w-8 bg-gold" />
              <Radio aria-hidden strokeWidth={1.4} className="size-4" />
              <span className="h-px w-8 bg-gold" />
            </span>
            <Chip Icon={Users} label="Customer" gold />
          </div>
          <p className="text-sm font-light leading-[1.8] text-[#d6d2c8]">
            One QR scan on the bottle opens a direct, first-party channel. Every
            sensory signature, pairing question and reward lands in your own
            database, not a distributor&apos;s or a cloud provider&apos;s.
          </p>
        </div>
      </section>

      <div className="flex items-center justify-between">
        <h2 className="font-serif text-[30px] text-ivory">Real-time Intelligence</h2>
        <span className="border border-ash/40 px-3 py-1.5 text-[9px] uppercase tracking-[0.3em] text-ash">
          Illustrative PoC data
        </span>
      </div>

      <section aria-label="Key metrics" className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
        {metrics.map(({ label, value, caption, Icon }) => (
          <article key={label} className="gold-glow flex flex-col gap-5 border border-gold/40 bg-onyx p-7 lg:p-9">
            <div className="flex items-center justify-between text-gold">
              <span className="text-[10px] uppercase tracking-[0.4em]">{label}</span>
              <Icon aria-hidden strokeWidth={1.4} className="size-5 shrink-0" />
            </div>
            <span className="font-serif text-5xl leading-none text-ivory tabular-nums lg:text-[64px]">{value}</span>
            <div className="gold-rule" />
            <span className="text-xs font-light text-[#a8a398]">{caption}</span>
          </article>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <section
          aria-label="Market Sensory Mapping"
          className="gold-glow flex flex-col gap-8 border border-gold/40 bg-onyx p-6 sm:p-10 lg:col-span-8"
        >
          <div className="flex flex-col gap-2">
            <h3 className="font-serif text-[28px] text-ivory">Market Sensory Mapping</h3>
            <span className="text-[13px] font-light text-[#a8a398]">
              Dominant note in Sensory Signatures, share of profiles (%)
            </span>
          </div>
          {visible && <SensoryChart data={sensoryMapping(profiles)} />}
        </section>

        <section aria-label="Latest signatures" className="flex flex-col gap-5 border border-gold/40 bg-onyx p-6 sm:p-8 lg:col-span-4">
          <h3 className="font-serif text-[22px] text-ivory">Latest Signatures</h3>
          {profiles.length === 0 ? (
            <p className="text-sm font-light leading-[1.8] text-mist">
              Complete a 6-second test in the VIP Client Experience. It appears
              here instantly and moves the numbers above.
            </p>
          ) : (
            <ol className="flex flex-col">
              {[...profiles].reverse().slice(0, 6).map((p) => (
                <li key={p.id} className="fade-up flex items-center justify-between gap-3 border-t border-gold/20 py-3.5 first:border-t-0">
                  <div className="flex flex-col gap-1">
                    <span className="font-serif text-base text-ivory">{WINES[p.wine].short}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-mist">
                      {p.structure} · {p.acidity} · {p.note}
                    </span>
                  </div>
                  <span className="text-xs tabular-nums text-gold">{p.seconds.toFixed(1)} s</span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <MiaCore />
    </div>
  );
}

function Chip({ Icon, label, gold }: { Icon: LucideIcon; label: string; gold?: boolean }) {
  return (
    <span className={`flex items-center gap-2 border px-3 py-2 ${gold ? "border-gold text-gold" : "border-ash/50"}`}>
      <Icon aria-hidden strokeWidth={1.4} className="size-3.5" />
      {label}
    </span>
  );
}
