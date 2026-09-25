import {
  Activity,
  Atom,
  BrainCircuit,
  Check,
  CloudOff,
  Database,
  HeartHandshake,
  ScanLine,
  ServerCog,
  ShieldCheck,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const COMPARISON: { topic: string; cloud: string; mia: string }[] = [
  {
    topic: "Where the AI runs",
    cloud: "Third-party servers abroad",
    mia: "Your own on-premise hardware",
  },
  {
    topic: "Your customer data",
    cloud: "Leaves the estate with every request",
    mia: "Never leaves the estate",
  },
  {
    topic: "Recipes & trade secrets",
    cloud: "Exposed to an external provider",
    mia: "Stay inside your walls",
  },
  {
    topic: "Model",
    cloud: "Generic, rented, changes without notice",
    mia: "Open-weights, fine-tuned on your cuvées",
  },
  {
    topic: "GDPR",
    cloud: "Cross-border transfers to justify",
    mia: "Compliant by architecture",
  },
];

const ROADMAP: { Icon: LucideIcon; title: string; text: string; now?: boolean }[] = [
  {
    Icon: ScanLine,
    title: "VIP Sommelier & 6s Test",
    text: "QR-activated tasting experience and sensory data capture. The PoC you are looking at.",
    now: true,
  },
  {
    Icon: HeartHandshake,
    title: "Direct-to-Consumer Engagement",
    text: "Loyalty, rewards, allocations and private events driven by each guest's signature.",
  },
  {
    Icon: BrainCircuit,
    title: "Fine-tuned Wine Concierge",
    text: "Local open-weights LLMs trained on your vintages, cellar notes and house style.",
  },
  {
    Icon: Database,
    title: "GDPR Consumer Data Pipelines",
    text: "Consent-first, auditable pipelines from bottle scan to your own data warehouse.",
  },
  {
    Icon: Atom,
    title: "Sovereign & Quantum-secured Data",
    text: "Local data sovereignty with post-quantum encryption for long-term protection.",
  },
  {
    Icon: Activity,
    title: "Automated Sensory Analytics",
    text: "Vintage-by-vintage perception trends that inform blending and release strategy.",
  },
];

export default function MiaCore() {
  return (
    <section aria-label="M.I.A. Core" className="flex flex-col gap-8 pt-8">
      <div className="flex flex-col gap-4">
        <span className="text-[11px] uppercase tracking-[0.5em] text-gold">M.I.A. Core</span>
        <h2 className="font-serif text-4xl leading-[1.1] text-ivory sm:text-5xl">
          Intelligence that <em className="text-gold">never leaves</em> the estate.
        </h2>
        <p className="max-w-[720px] text-[15px] font-light leading-[1.8] text-mist">
          Not a public-cloud chatbot wired to a third-party API. M.I.A. runs
          fine-tuned open-weights language models on infrastructure the winery
          owns, so every conversation, profile and trade secret stays yours.
        </p>
      </div>

      <div className="overflow-x-auto border border-gold/40">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-gold/40 text-[10px] uppercase tracking-[0.35em]">
              <th scope="col" className="px-6 py-5 font-medium text-ash">&nbsp;</th>
              <th scope="col" className="px-6 py-5 font-medium text-ash">
                <span className="flex items-center gap-2">
                  <CloudOff aria-hidden strokeWidth={1.4} className="size-4" />
                  Public cloud AI APIs
                </span>
              </th>
              <th scope="col" className="bg-[#0e0c07] px-6 py-5 font-semibold text-gold">
                <span className="flex items-center gap-2">
                  <ServerCog aria-hidden strokeWidth={1.4} className="size-4" />
                  M.I.A. on-premise
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map((row) => (
              <tr key={row.topic} className="border-b border-gold/15 last:border-b-0">
                <th scope="row" className="px-6 py-4 font-serif text-base font-normal text-ivory">
                  {row.topic}
                </th>
                <td className="px-6 py-4 text-sm font-light text-mist">
                  <span className="flex items-start gap-2.5">
                    <X aria-hidden strokeWidth={1.5} className="mt-0.5 size-4 shrink-0 text-ash" />
                    {row.cloud}
                  </span>
                </td>
                <td className="bg-[#0e0c07] px-6 py-4 text-sm text-ivory">
                  <span className="flex items-start gap-2.5">
                    <Check aria-hidden strokeWidth={1.8} className="mt-0.5 size-4 shrink-0 text-gold" />
                    {row.mia}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-6 pt-6">
        <div className="flex flex-col gap-2">
          <h3 className="font-serif text-[28px] text-ivory">From Proof of Concept to Platform</h3>
          <span className="text-[13px] font-light text-[#a8a398]">
            Start with the sensory test today. Grow into a complete on-premise AI ecosystem.
          </span>
        </div>
        <ol className="grid grid-cols-1 gap-px bg-gold/25 sm:grid-cols-2 lg:grid-cols-3">
          {ROADMAP.map(({ Icon, title, text, now }, i) => (
            <li key={title} className={`flex flex-col gap-4 p-7 ${now ? "bg-[#0e0c07]" : "bg-noir"}`}>
              <div className="flex items-center justify-between">
                <Icon aria-hidden strokeWidth={1.3} className="size-6 text-gold" />
                <span
                  className={`text-[9px] uppercase tracking-[0.35em] ${
                    now ? "border border-gold px-2.5 py-1 text-gold" : "text-ash"
                  }`}
                >
                  {now ? "Live today" : `Phase ${i + 1}`}
                </span>
              </div>
              <span className="font-serif text-xl text-ivory">{title}</span>
              <p className="text-sm font-light leading-[1.7] text-mist">{text}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex items-center gap-5 border border-gold/55 px-5 py-6 sm:px-8">
        <div className="flex size-12 shrink-0 items-center justify-center border border-gold text-gold">
          <ShieldCheck aria-hidden strokeWidth={1.4} className="size-[22px]" />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold">
            Secure Local Infrastructure
          </span>
          <span className="text-[13px] font-light text-mist">
            Designed for on-premise deployment: guest profiles and AI inference
            stay on the Maison&apos;s own servers. No data leaves the estate ·
            GDPR-aligned.
          </span>
        </div>
      </div>
    </section>
  );
}
