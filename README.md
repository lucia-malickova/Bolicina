# Bollicine · Serena 1881 (PoC)

**Bollicine** is the guest app; this repo is a meeting demo for Serena Wines 1881: a personal sommelier for every guest on the
left, and what the winery learns from it, live, on the right. Italian and English.

Stack: Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide, `qrcode`.
Fonts: Cormorant Garamond (display) and Manrope (UI) via `next/font`.

## Routes

- `/` presenter stage: pick one of 11 guests, use the phone, watch the dashboard update.
- `/app` the guest app alone, full screen, for a real phone (the QR button on `/` points here).
  Installable (PWA) and works offline: see "Offline" below.
- `/api/tastings` in-memory store that lets tastings from phones reach the stage.

## What the demo shows

1. **Sommelier.** Mood, company and moment as chips plus free text. The answer is one
   personal sentence and one real Serena bottle, with kcal and sugar per glass.
2. **Scan.** Tap a bottle to simulate a label scan; the card says whether it fits the
   guest's usual taste.
3. **Tasting (gamification).** Four gestures in about 10 seconds: sweetness, bubbles,
   aroma, would you buy it again. Reward: a taste profile, not points.
4. **Memory and sharing.** A returning guest is greeted with their last wine and profile,
   and a scanned bottle they already tasted shows what they felt last time. The profile
   can be shared as an Instagram-sized image.
5. **Voice.** A microphone button dictates the question instead of typing it.
6. **Autoplay.** "Demo automatica" runs all 11 guests while the presenter talks; tapping
   any guest stops it and hands control back.
7. **Winery intelligence.** Tastings recorded, repurchase intent, Serena 0.0 among
   under-25s, perceived vs real sweetness per wine, age groups, 12-month outlook, and:
   - *Cosa fare domani*: three decisions in plain words, recomputed with every tasting;
   - *Assaggio virtuale*: design a wine that doesn't exist (sugar, alcohol, aroma, bubbles)
     and see estimated appeal per age group and the closest wine already in the range;
   - *Chiedi ai tuoi dati*: prepared questions answered in one sentence;
   - *Domani*: weather and weekday/weekend change the expected tastings per wine;
   - *Il valore dei vostri dati*: the first-party data asset the winery is building.

## Honest scope

- The 9 wines, their figures and bottle photos come from Serena's technical sheets (2025).
- kcal per 125 ml glass are estimates from alcohol and residual sugar, not Serena data.
- Sommelier answers are **simulated**: written replies for the 11 guests and keyword
  routing for free text (`lib/sommelier.ts`). In production this is the model trained
  on Serena's own data.
- Dashboard numbers are an illustrative baseline (`lib/insights.ts`, fixed seed) plus
  every tasting made in the session. The forecast is a linear trend, labelled as such.
- Virtual tasting, tomorrow's forecast and data answers are simple, explainable estimates
  over the same data (`lib/simulate.ts`); weather coefficients are examples.
- Voice uses the browser's own speech recogniser (Chrome, Safari). Chrome sends the audio
  to Google to transcribe, so it is neither offline nor on-premise; production would use
  a speech model on the winery's server or on the phone.
- Tastings live in server memory. Phones share them only when one server process serves
  them all (`npm run build && npm start` on a laptop, phones on the same Wi-Fi). On
  Vercel, instances may not share memory, so the phone → stage link can miss.

## Offline

`/app` registers a service worker (`public/sw.js`, production builds only) that keeps the
app, its code, fonts and bottle images on the phone. Without signal the sommelier,
scanning and tasting all still work; tastings wait in a queue on the phone
(`localStorage`) and are sent automatically when the connection returns. The phone also
remembers its own last 50 tastings for the "welcome back" greeting.

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
- `lib/actions.ts` the three decisions and the data-value figures
- `lib/simulate.ts` virtual tasting, data questions, tomorrow's forecast
- `lib/useTastings.ts` live sync, offline queue, on-phone memory
- `lib/useDictation.ts` voice input; `lib/shareCard.ts` shareable profile image
- `lib/tasting.ts` tasting type, payload validation, taste profiles
- `lib/insights.ts` illustrative baseline and dashboard aggregations
- `lib/i18n.ts` all interface text in Italian and English
- `components/serena/phone/*` the guest app; `components/serena/dashboard/*` the winery view
- `public/wines/*` bottle cut-outs extracted from the technical sheets

The previous Bollicina PoC files (`components/*.tsx`, `components/data.ts`, `design/`)
are no longer used by any route.
