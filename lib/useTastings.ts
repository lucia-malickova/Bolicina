"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { parseTasting } from "./tasting";
import type { Tasting } from "./tasting";

const QUEUE_KEY = "bollicine.queue";

function merge(a: Tasting[], b: Tasting[]) {
  const byId = new Map(a.map((t) => [t.id, t]));
  b.forEach((t) => byId.set(t.id, t));
  return [...byId.values()].sort((x, y) => x.at - y.at);
}

function readList(key: string): Tasting[] {
  try {
    const raw = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(raw) ? raw.map(parseTasting).filter((t): t is Tasting => !!t) : [];
  } catch {
    return [];
  }
}

function writeList(key: string, list: Tasting[]) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {}
}

async function post(t: Tasting) {
  const r = await fetch("/api/tastings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(t),
  });
  if (!r.ok && r.status !== 400) throw new Error(String(r.status));
}

/**
 * Local tastings appear instantly; tastings from other phones arrive by polling.
 * A tasting that can't be sent (no signal) waits in a queue on the phone and is sent on reconnect.
 * With `keep`, this phone's own tastings are also remembered across visits.
 */
export function useTastings(poll = true, keep?: string) {
  const [tastings, setTastings] = useState<Tasting[]>([]);
  const [pending, setPending] = useState(0);
  // Bumped on reset so a poll that started before the reset can't bring old tastings back.
  const generation = useRef(0);
  const flushing = useRef(false);

  const flush = useCallback(async () => {
    if (flushing.current) return;
    flushing.current = true;
    try {
      let queue = readList(QUEUE_KEY);
      while (queue.length) {
        await post(queue[0]);
        queue = queue.slice(1);
        writeList(QUEUE_KEY, queue);
      }
    } catch {
      // Still offline: keep the rest for the next reconnect.
    } finally {
      setPending(readList(QUEUE_KEY).length);
      flushing.current = false;
    }
  }, []);

  useEffect(() => {
    if (keep) setTastings(readList(keep));
    flush();
    window.addEventListener("online", flush);
    return () => window.removeEventListener("online", flush);
  }, [keep, flush]);

  useEffect(() => {
    if (keep && tastings.length) writeList(keep, tastings.slice(-50));
  }, [keep, tastings]);

  useEffect(() => {
    if (!poll) return;
    let alive = true;
    const load = () => {
      const gen = generation.current;
      fetch("/api/tastings", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : []))
        .then((remote: Tasting[]) => alive && gen === generation.current && setTastings((prev) => merge(prev, remote)))
        .catch(() => {});
    };
    load();
    const id = setInterval(load, 2500);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [poll]);

  const add = useCallback((t: Tasting) => {
    setTastings((prev) => merge(prev, [t]));
    post(t).catch(() => {
      writeList(QUEUE_KEY, merge(readList(QUEUE_KEY), [t]));
      setPending(readList(QUEUE_KEY).length);
    });
  }, []);

  const reset = useCallback(() => {
    generation.current += 1;
    setTastings([]);
    fetch("/api/tastings", { method: "DELETE" })
      .catch(() => {})
      .finally(() => (generation.current += 1));
  }, []);

  return { tastings, add, reset, pending };
}
