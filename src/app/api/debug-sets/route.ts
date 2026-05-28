import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch("https://api.riftcodex.com/sets", {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(10_000),
    });
    const text = await res.text();
    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      bodySnippet: text.slice(0, 300),
    });
  } catch (err) {
    return NextResponse.json(
      { error: String(err), type: (err as Error)?.constructor?.name },
      { status: 500 }
    );
  }
}
