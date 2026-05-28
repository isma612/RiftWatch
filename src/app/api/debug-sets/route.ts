import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch("https://api.riftcodex.com/sets", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://riftcodex.com/",
        "Origin": "https://riftcodex.com",
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
