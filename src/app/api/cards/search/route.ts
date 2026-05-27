import { NextRequest, NextResponse } from "next/server";
import { searchCards } from "@/features/cards/services/riftcodex.service";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? "8");

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const cards = await searchCards(q, limit);
  return NextResponse.json(cards);
}
