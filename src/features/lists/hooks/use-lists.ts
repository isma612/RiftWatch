"use client";

import { useQuery } from "@tanstack/react-query";

interface ListSummaryLite {
  id: string;
  name: string;
  itemCount: number;
  includeInCollection: boolean;
}

async function fetchLists(): Promise<ListSummaryLite[]> {
  const res = await fetch("/api/lists");
  if (!res.ok) return [];
  return res.json();
}

export function useListsForUser() {
  return useQuery({
    queryKey: ["user-lists"],
    queryFn: fetchLists,
    staleTime: 30_000,
  });
}
