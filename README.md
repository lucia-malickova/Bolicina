# Bollicina · AI Sommelier (PoC)

Boutique Next.js (App Router) proof of concept for the Bollicina Maison:
a VIP tasting experience that collects a 6-second "Sensory Signature",
plus an Executive Intelligence dashboard for the owner.

Stack: Next.js 16, React 19, Tailwind CSS v4, Lucide React, Recharts.
Fonts: Playfair Display (headings), Montserrat (body) via `next/font`.

## Run locally

```bash
cd bolicina
npm install
npm run dev      # http://localhost:3000
```

## Structure

- `app/layout.tsx`: fonts and global shell
- `app/page.tsx`: navigation toggle between the two views
- `components/VipExperience.tsx`: cuvée selector, Sensory Signature, AI Concierge chat
- `components/ExecutiveDashboard.tsx`: metric cards and compliance badge
- `components/SensoryChart.tsx`: Recharts "Market Sensory Mapping" bar chart
- `components/data.ts`: wines, sensory questions, mock chart data and the mock concierge

The concierge answers from keyword rules in `conciergeReply()`. Swap it for a call
to a locally hosted model to make it real. Dashboard figures are static PoC values.

## Design

`design/` holds the source of the two screens from the Claude design canvas
(VIP Client Experience and Executive Intelligence), kept as a backup.
