# Serena 1881 · Sommelier (PoC)

A meeting demo for Serena Wines 1881: a personal sommelier for every guest on the
left, and what the winery learns from it, live, on the right. Italian and English.

Stack: Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide, `qrcode`.
Fonts: Cormorant Garamond (display) and Manrope (UI) via `next/font`.

## Routes

- `/` presenter stage: pick one of 11 guests, use the phone, watch the dashboard update.
- `/app` the guest app alone, full screen, for a real phone (the QR button on `/` points here).
- `/api/tastings` in-memory store that lets tastings from phones reach the stage.

## What the demo shows

1. **Sommelier.** Mood, company and moment as chips plus free text. The answer is one
   personal sentence and one real Serena bottle, with kcal and sugar per glass.
2. **Scan.** Tap a bottle to simulate a label scan; the card says whether it fits the
   guest's usual taste.
3. **Tasting (gamification).** Four gestures in about 10 seconds: sweetness, bubbles,
   aroma, would you buy it again. Reward: a taste profile, not points.
4. **Winery intelligence.** Tastings recorded, repurchase intent, Serena 0.0 among
   under-25s, perceived vs real sweetness per wine, age groups, 12-month outlook.

## Honest scope

- The 9 wines, their figures and bottle photos come from Serena's technical sheets (2025).
- kcal per 125 ml glass are estimates from alcohol and residual sugar, not Serena data.
- Sommelier answers are **simulated**: written replies for the 11 guests and keyword
  routing for free text (`lib/sommelier.ts`). In production this is the model trained
  on Serena's own data.
- Dashboard numbers are an illustrative baseline (`lib/insights.ts`, fixed seed) plus
  every tasting made in the session. The forecast is a linear trend, labelled as such.
- Tastings live in server memory. Phones share them only when one server process serves
  them all (`npm run build && npm start` on a laptop, phones on the same Wi-Fi). On
  Vercel, instances may not share memory, so the phone → stage link can miss.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

For the meeting, on the laptop: `npm run build && npm start`, then open `/` and use the
QR button so guests can join from their own phones on the same network.

## Deploy to Vercel

vercel.com → **Add New… → Project** → import `lucia-malickova/bolicina` → **Deploy**.
No environment variables.

## Structure

- `lib/wines.ts` catalogue from the technical sheets, kcal, sugar, sweetness index
- `lib/personas.ts` the 11 guests and their simulated sommelier replies (IT/EN)
- `lib/sommelier.ts` free-text routing and "fits your taste" logic
- `lib/tasting.ts` tasting type, payload validation, taste profiles
- `lib/insights.ts` illustrative baseline and dashboard aggregations
- `lib/i18n.ts` all interface text in Italian and English
- `components/serena/phone/*` the guest app; `components/serena/dashboard/*` the winery view
- `public/wines/*` bottle cut-outs extracted from the technical sheets

The previous Bollicina PoC files (`components/*.tsx`, `components/data.ts`, `design/`)
are no longer used by any route.
