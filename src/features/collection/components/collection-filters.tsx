"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { RarityBadge } from "@/components/common/badges/rarity-badge";
import { DomainBadge } from "@/components/common/riftbound/domain-badge";
import { removeCardFromCollectionAction } from "@/features/lists/actions/list-actions";
import type { CollectionCard } from "@/features/collection/services/collection.service";
import { toast } from "sonner";

const RARITIES = ["Common", "Uncommon", "Rare", "Epic", "Showcase"];
const DOMAINS = ["Calm", "Chaos", "Order", "Body", "Mind", "Fury"];

interface CollectionFiltersProps {
  cards: CollectionCard[];
}

export function CollectionFilters({ cards }: CollectionFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const [query, setQuery] = React.useState("");
  const [rarities, setRarities] = React.useState<string[]>([]);
  const [domains, setDomains] = React.useState<string[]>([]);

  function toggleRarity(r: string) {
    setRarities((prev) => prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]);
  }
  function toggleDomain(d: string) {
    setDomains((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  }

  const filtered = React.useMemo(() => {
    let result = cards;
    if (query) {
      const q = query.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q));
    }
    if (rarities.length) {
      result = result.filter((c) => rarities.includes(c.rarity ?? ""));
    }
    if (domains.length) {
      result = result.filter((c) => domains.every((d) => c.domains.includes(d)));
    }
    return result;
  }, [cards, query, rarities, domains]);

  function handleDelete(cardDbId: string, cardName: string) {
    if (!confirm(`¿Eliminar "${cardName}" de toda tu colección?`)) return;
    setDeletingId(cardDbId);
    startTransition(async () => {
      await removeCardFromCollectionAction(cardDbId);
      router.refresh();
      setDeletingId(null);
      toast.success(`"${cardName}" eliminada de la colección`);
    });
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar en colección…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {RARITIES.map((r) => (
            <button
              key={r}
              onClick={() => toggleRarity(r)}
              className={cn(
                "rounded-xl border px-2.5 py-1 text-xs transition-colors",
                rarities.includes(r)
                  ? "border-primary/60 bg-primary/10 text-primary font-medium"
                  : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {DOMAINS.map((d) => (
            <button
              key={d}
              onClick={() => toggleDomain(d)}
              className={cn(
                "rounded-xl border px-1.5 py-1 text-xs transition-colors",
                domains.includes(d)
                  ? "border-primary/60 bg-primary/10"
                  : "border-border/60 text-muted-foreground hover:border-border"
              )}
            >
              <DomainBadge domain={d} size="xs" className="border-0 bg-transparent p-0" />
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} carta{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Cards list */}
      <div className="space-y-2">
        {filtered.map((card) => {
          const hasFoil = card.lists.some((l) => l.isFoil);
          return (
            <div
              key={card.cardDbId}
              className={cn(
                "flex gap-3 rounded-2xl border border-border/60 bg-card p-3 transition-opacity",
                deletingId === card.cardDbId && "pointer-events-none opacity-40"
              )}
            >
              <Link
                href={`/card/${card.riftboundId}`}
                className="relative h-[78px] w-[56px] shrink-0 overflow-hidden rounded-lg bg-muted/20"
              >
                {card.imageUrl ? (
                  <Image
                    src={card.imageUrl}
                    alt={card.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="h-full w-full rounded-lg bg-muted/30" />
                )}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/card/${card.riftboundId}`}
                    className="truncate text-sm font-medium hover:text-primary transition-colors"
                  >
                    {card.name}
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] uppercase text-muted-foreground">
                    {card.setId.toUpperCase()}
                  </span>
                  <RarityBadge rarity={card.rarity} />
                  {hasFoil && (
                    <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-500">
                      ✨ Foil
                    </span>
                  )}
                </div>

                <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>×{card.totalQty}</span>
                    {card.lists.length > 1 && (
                      <span>· {card.lists.length} listas</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(card.cardDbId, card.name)}
                    disabled={deletingId !== null}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    title="Eliminar de colección"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Sin cartas con los filtros actuales.
          </p>
        )}
      </div>
    </div>
  );
}
