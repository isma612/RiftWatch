const BASE = "https://api.riftcodex.com";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RiftboundCard {
  id: string;
  name: string;
  riftbound_id?: string;
  tcgplayer_id?: string;
  collector_number?: string;
  attributes: {
    energy?: number | null;
    might?: number | null;
    power?: number | null;
  };
  classification: {
    type?: string;
    supertype?: string;
    rarity?: string;
    domain?: string[];
  };
  text: {
    rich?: string | null;
    plain?: string | null;
    flavour?: string | null;
  };
  set: {
    set_id: string;
    label?: string;
  };
  media: {
    image_url?: string | null;
    artist?: string | null;
  };
  tags?: string[];
  metadata?: {
    clean_name?: string;
    alternate_art?: boolean;
    [key: string]: unknown;
  };
}

export interface RiftboundSet {
  id: string;
  label: string;
  set_type?: string;
  card_count?: number;
  symbol_url?: string;
  released_at?: string;
}

interface PaginatedResponse<T> {
  items: T[];
  page: number;
  size: number;
  pages: number;
  total: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    throw new Error(`RiftCodex API error ${res.status}: ${path}`);
  }
  return res.json() as Promise<T>;
}

// ─── Cards ────────────────────────────────────────────────────────────────────

export async function searchCards(
  q: string,
  limit = 20
): Promise<RiftboundCard[]> {
  try {
    const params = new URLSearchParams({ q, limit: String(limit) });
    const data = await apiFetch<PaginatedResponse<RiftboundCard> | RiftboundCard[]>(
      `/cards/search?${params}`,
      { next: { revalidate: 60 } }
    );
    if (Array.isArray(data)) return data;
    return data.items ?? [];
  } catch {
    // Fallback: filter from list endpoint
    const data = await getCardsFiltered({ limit });
    return data.cards.filter((c) =>
      c.name.toLowerCase().includes(q.toLowerCase())
    );
  }
}

export async function getCardsFiltered(opts: {
  setId?: string;
  rarity?: string;
  domain?: string;
  type?: string;
  page?: number;
  limit?: number;
}): Promise<{ cards: RiftboundCard[]; total: number; pages: number }> {
  const params = new URLSearchParams();
  if (opts.setId) params.set("set", opts.setId);
  if (opts.rarity) params.set("rarity", opts.rarity);
  if (opts.domain) params.set("domain", opts.domain);
  if (opts.type) params.set("type", opts.type);
  params.set("page", String(opts.page ?? 1));
  params.set("limit", String(opts.limit ?? 100));

  const data = await apiFetch<PaginatedResponse<RiftboundCard>>(
    `/cards?${params}`,
    { next: { revalidate: 3600 } }
  );
  return { cards: data.items ?? [], total: data.total ?? 0, pages: data.pages ?? 1 };
}

export async function getAllCardsInSet(setId: string): Promise<RiftboundCard[]> {
  const first = await getCardsFiltered({ setId, page: 1, limit: 100 });
  if (first.pages <= 1) return first.cards;

  const rest = await Promise.all(
    Array.from({ length: first.pages - 1 }, (_, i) =>
      getCardsFiltered({ setId, page: i + 2, limit: 100 })
    )
  );
  return [...first.cards, ...rest.flatMap((r) => r.cards)];
}

export async function getCardById(id: string): Promise<RiftboundCard | null> {
  try {
    return await apiFetch<RiftboundCard>(`/cards/${id}`, {
      next: { revalidate: 3600 },
    });
  } catch {
    return null;
  }
}

// ─── Sets ─────────────────────────────────────────────────────────────────────

export async function getAllSets(): Promise<RiftboundSet[]> {
  try {
    const data = await apiFetch<PaginatedResponse<RiftboundSet> | RiftboundSet[]>(
      `/sets`,
      { next: { revalidate: 86400 } }
    );
    if (Array.isArray(data)) return data;
    return data.items ?? [];
  } catch {
    return [];
  }
}

export async function getSetById(setId: string): Promise<RiftboundSet | null> {
  try {
    return await apiFetch<RiftboundSet>(`/sets/${setId}`, {
      next: { revalidate: 86400 },
    });
  } catch {
    return null;
  }
}
