import { NextResponse } from "next/server";
import { parseTasting } from "@/lib/tasting";
import type { Tasting } from "@/lib/tasting";

// In-memory store: shared across phones as long as one server process serves them
// (e.g. `npm start` on a laptop). On serverless hosting instances may not share it.
const store = globalThis as unknown as { __tastings?: Tasting[] };
const MAX = 500;

function list() {
  store.__tastings ??= [];
  return store.__tastings;
}

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(list());
}

export async function POST(req: Request) {
  const tasting = parseTasting(await req.json().catch(() => null));
  if (!tasting) return NextResponse.json({ error: "invalid tasting" }, { status: 400 });
  const all = list();
  if (!all.some((t) => t.id === tasting.id)) {
    all.push(tasting);
    if (all.length > MAX) all.splice(0, all.length - MAX);
  }
  return NextResponse.json({ ok: true });
}

export function DELETE() {
  list().length = 0;
  return NextResponse.json({ ok: true });
}
