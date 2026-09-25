"use client";

import { useEffect, useState } from "react";

export interface Weather {
  tMax: number;
  tomorrow?: number;
  source: "live" | "manual" | "estimate";
  place?: string;
}

const KEY = "bollicine.weather";

// Rough monthly maximums for northern Italy, used only when there is no network and no cache.
const MONTHLY = [7, 10, 15, 19, 24, 28, 31, 30, 25, 19, 12, 8];

async function fetchForecast(lat: number, lon: number): Promise<{ tMax: number; tomorrow: number }> {
  // Rounded to ~10 km: enough for a forecast, not a precise location.
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(1)}&longitude=${lon.toFixed(1)}` +
    `&daily=temperature_2m_max&timezone=auto&forecast_days=2`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(String(r.status));
  const j = (await r.json()) as { daily?: { temperature_2m_max?: number[] } };
  const t = j.daily?.temperature_2m_max;
  if (!t || typeof t[0] !== "number") throw new Error("no data");
  return { tMax: t[0], tomorrow: t[1] ?? t[0] };
}

function position(): Promise<[number, number]> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) return reject(new Error("no geolocation"));
    navigator.geolocation.getCurrentPosition(
      (p) => resolve([p.coords.latitude, p.coords.longitude]),
      reject,
      { timeout: 6000, maximumAge: 3_600_000 },
    );
  });
}

/**
 * Today's and tomorrow's maximum temperature. With `at` (a city's coordinates) it looks
 * that place up; otherwise it asks the phone for its position. Falls back to the last
 * forecast seen, then to a seasonal estimate, so it also works offline.
 */
export function useWeather(at?: { lat: number; lon: number; place: string }) {
  const [w, setW] = useState<Weather>({ tMax: MONTHLY[new Date().getMonth()], source: "estimate" });
  const [manual, setManual] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [lat, lon] = at ? [at.lat, at.lon] : await position();
        const f = await fetchForecast(lat, lon);
        if (!alive) return;
        const next: Weather = { ...f, source: "live", place: at?.place };
        setW(next);
        try {
          localStorage.setItem(KEY, JSON.stringify({ ...next, at: Date.now() }));
        } catch {}
      } catch {
        try {
          const cached = JSON.parse(localStorage.getItem(KEY) ?? "null") as (Weather & { at: number }) | null;
          if (alive && cached && Date.now() - cached.at < 2 * 86_400_000) setW({ ...cached, source: "live" });
        } catch {}
      }
    })();
    return () => {
      alive = false;
    };
  }, [at?.lat, at?.lon, at?.place]);

  const current: Weather = manual === null ? w : { ...w, tMax: manual, source: "manual" };
  return { weather: current, setManual };
}
