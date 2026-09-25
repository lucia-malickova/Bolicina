import { NextResponse } from "next/server";
import type { Vote } from "@/lib/market";
import { SEGMENTS } from "@/lib/personas";
import type { Segment } from "@/lib/personas";

// In-memory, like /api/tastings: enough for a demo served by one process.
const store = globalThis as unknown as { __votes?: Vote[] };
const list = () => (store.__votes ??= []);

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(list());
}

export async function POST(req: Request) {
  const o = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (
    !o ||
    typeof o.id !== "string" ||
    o.id.length > 64 ||
    (o.choice !== "a" && o.choice !== "b") ||
    !SEGMENTS.includes(o.segment as Segment)
  ) {
    return NextResponse.json({ error: "invalid vote" }, { status: 400 });
  }
  const all = list();
  if (!all.some((v) => v.id === o.id)) {
    all.push({ id: o.id, choice: o.choice, segment: o.segment as string });
    if (all.length > 2000) all.splice(0, all.length - 2000);
  }
  return NextResponse.json({ ok: true });
}

export function DELETE() {
  list().length = 0;
  return NextResponse.json({ ok: true });
}
