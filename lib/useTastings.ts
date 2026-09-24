"use client";

import { useCallback, useEffect, useState } from "react";
import type { Tasting } from "./tasting";

function merge(a: Tasting[], b: Tasting[]) {
  const byId = new Map(a.map((t) => [t.id, t]));
  b.forEach((t) => byId.set(t.id, t));
  return [...byId.values()].sort((x, y) => x.at - y.at);
}

/** Local tastings appear instantly; tastings from other phones arrive by polling. */
export function useTastings(poll = true) {
  const [tastings, setTastings] = useState<Tasting[]>([]);

  useEffect(() => {
    if (!poll) return;
    let alive = true;
    const load = () =>
      fetch("/api/tastings", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : []))
        .then((remote: Tasting[]) => alive && setTastings((prev) => merge(prev, remote)))
        .catch(() => {});
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

  return { tastings, add };
}
