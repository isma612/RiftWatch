/**
 * Proxy edge para api.riftcodex.com
 *
 * Razón: Cloudflare Bot Protection bloquea las IPs de centros de datos de
 * Vercel (Node.js serverless). Las funciones Edge corren en los nodos de borde
 * de Cloudflare y no están bloqueadas, por lo que actúan como proxy transparente.
 *
 * Flujo: Server Component → fetch(/api/riftcodex/...) → Edge → api.riftcodex.com
 */

export const runtime = "edge";

const UPSTREAM = "https://api.riftcodex.com";

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const { searchParams } = new URL(request.url);

  const upstreamUrl = `${UPSTREAM}/${path.join("/")}${
    searchParams.size > 0 ? `?${searchParams}` : ""
  }`;

  const res = await fetch(upstreamUrl, { headers: BROWSER_HEADERS });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: `Upstream ${res.status}` }), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = await res.text();
  return new Response(data, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
