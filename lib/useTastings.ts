"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Tasting } from "./tasting";

function merge(a: Tasting[], b: Tasting[]) {
  const byId = new Map(a.map((t) => [t.id, t]));
  b.forEach((t) => byId.set(t.id, t));
  return [...byId.values()].sort((x, y) => x.at - y.at);
}

/** Local tastings appear instantly; tastings from other phones arrive by polling. */
export function useTastings(poll = true) {
  const [tastings, setTastings] = useState<Tasting[]>([]);
  // Bumped on reset so a poll that started before the reset can't bring old tastings back.
  const generation = useRef(0);

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
    fetch("/api/tastings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(t),
    }).catch(() => {});
  }, []);

  const reset = useCallback(() => {
    generation.current += 1;
    setTastings([]);
    fetch("/api/tastings", { method: "DELETE" })
      .catch(() => {})
      .finally(() => (generation.current += 1));
  }, []);

  return { tastings, add, reset };
}
