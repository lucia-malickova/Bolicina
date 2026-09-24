# Bollicina · AI Sommelier (PoC)

Proof of concept by **Modelos Inteligencia Artificial S.L. (M.I.A.)** for premium
wineries, using the Bollicina Maison as the case study.

Stack: Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide React, Recharts.
Fonts: Playfair Display (headings), Montserrat (body) via `next/font`.

## What the demo shows

1. **VIP Client Experience (Sommelier & 6s Test)**: the guest scans the QR code
   on the bottle, reads tasting notes and pairings, completes the 6-second
   Sensory Signature (Structure, Acidity, Dominant Note), and unlocks VIP points
   and a reward. On the right, the AI Concierge answers pairing questions.
2. **Executive Intelligence (The Owner's Hidden Gold)**: the distribution pain
   point (winery → distributor → retailer → unknown customer) against the direct
   M.I.A. channel, live metrics, the Market Sensory Mapping chart and the latest
   signatures, followed by **M.I.A. Core**: on-premise AI compared with public cloud
   APIs, and the roadmap from this PoC to the full platform.

Every signature submitted in tab 1 immediately updates the numbers, the chart and
the "Latest Signatures" list in tab 2. That is the moment to show the owner.

## Honest scope of the PoC

- Dashboard figures start from an illustrative baseline (1,428 profiles) and are
  labelled "Illustrative PoC data" in the UI.
- The concierge replies come from keyword rules in `conciergeReply()` in
  `components/data.ts`. In production this is replaced by a call to the
  on-premise open-weights LLM.
- Nothing is stored. Refreshing the page resets the session.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

## Deploy to Vercel

1. vercel.com → **Add New… → Project** → import `lucia-malickova/Bolicina`.
2. Framework preset: **Next.js** (detected automatically). No environment variables.
3. **Deploy**. Every push to `main` redeploys.

## Structure

- `app/layout.tsx`: fonts and metadata
- `app/page.tsx`: trust bar, navigation, shared session state between the tabs
- `components/VipExperience.tsx`: bottle, Sensory Signature with timer and rewards, AI Concierge
- `components/ExecutiveDashboard.tsx`: pain point, live metrics, chart, latest signatures
- `components/MiaCore.tsx`: on-premise vs public cloud, platform roadmap, compliance badge
- `components/SensoryChart.tsx`: Recharts bar chart
- `components/data.ts`: wines, questions, baseline data, mock concierge
- `design/`: source of the earlier design canvas screens (backup)
