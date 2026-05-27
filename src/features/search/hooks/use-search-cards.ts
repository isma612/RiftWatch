"use client";

import { useQuery } from "@tanstack/react-query";
import type { RiftboundCard } from "@/features/cards/services/riftcodex.service";

async function fetchCards(q: string): Promise<RiftboundCard[]> {
  if (!q || q.length < 2) return [];
  const res = await fetch(
    `/api/cards/search?q=${encodeURIComponent(q)}&limit=8`
  );
  if (!res.ok) return [];
  return res.json();
}

export function useSearchCards(query: string) {
  return useQuery({
    queryKey: ["card-search", query],
    queryFn: () => fetchCards(query),
    enabled: query.length >= 2,
    staleTime: 30_000,
  });
}
