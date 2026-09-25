"use client";

import { useCallback, useEffect, useState } from "react";
import type { Vote } from "./market";

/** Label A/B votes: own votes show instantly, everyone's arrive by polling. */
export function useVotes(poll = true) {
  const [votes, setVotes] = useState<Vote[]>([]);

  useEffect(() => {
    if (!poll) return;
    let alive = true;
    const load = () =>
      fetch("/api/votes", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : []))
        .then((remote: Vote[]) =>
          alive && setVotes((prev) => [...new Map([...prev, ...remote].map((v) => [v.id, v])).values()]),
        )
        .catch(() => {});
    load();
    const id = setInterval(load, 2500);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [poll]);

  const vote = useCallback((v: Vote) => {
    setVotes((prev) => [...prev.filter((x) => x.id !== v.id), v]);
    fetch("/api/votes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(v) }).catch(() => {});
  }, []);

  const reset = useCallback(() => {
    setVotes([]);
    fetch("/api/votes", { method: "DELETE" }).catch(() => {});
  }, []);

  return { votes, vote, reset };
}
