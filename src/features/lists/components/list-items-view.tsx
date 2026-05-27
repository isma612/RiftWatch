"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { RarityBadge } from "@/components/common/badges/rarity-badge";
import { DomainBadges } from "@/components/common/riftbound/domain-badge";
import {
  removeFromListAction,
  updateListItemAction,
} from "@/features/lists/actions/list-actions";
import type { ListItemEntry } from "@/features/lists/services/lists.service";
import { toast } from "sonner";

interface ListItemsViewProps {
  items: ListItemEntry[];
  listId: string;
}

export function ListItemsView({ items, listId }: ListItemsViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  function handleDelete(cardId: string) {
    setDeletingId(cardId);
    startTransition(async () => {
      await removeFromListAction(listId, cardId);
      router.refresh();
      setDeletingId(null);
      toast.success("Carta eliminada");
    });
  }

  function handleQty(cardId: string, delta: number, current: number) {
    const next = Math.max(1, current + delta);
    startTransition(async () => {
      await updateListItemAction(listId, cardId, { quantity: next });
      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            "flex gap-3 rounded-2xl border border-border/60 bg-card p-3 transition-opacity",
            deletingId === item.card.id && "pointer-events-none opacity-40"
          )}
        >
          {/* Card image */}
          <Link
            href={`/card/${item.card.riftboundId}`}
            className="relative h-[78px] w-[56px] shrink-0 overflow-hidden rounded-lg bg-muted/20"
          >
            {item.card.imageUrl ? (
              <Image
                src={item.card.imageUrl}
                alt={item.card.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="h-full w-full rounded-lg bg-muted/30" />
            )}
          </Link>

          {/* Info */}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex items-start justify-between gap-2">
              <Link
                href={`/card/${item.card.riftboundId}`}
                className="truncate text-sm font-medium hover:text-primary transition-colors"
              >
                {item.card.name}
              </Link>
              {item.isFoil && (
                <span className="shrink-0 rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-500">
                  ✨ Foil
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] uppercase text-muted-foreground">
                {item.card.setId.toUpperCase()}
              </span>
              <RarityBadge rarity={item.card.rarity} />
              {item.card.cardType && (
                <span className="text-[10px] text-muted-foreground">
                  {item.card.cardType}
                </span>
              )}
            </div>

            {item.card.domains.length > 0 && (
              <DomainBadges domains={item.card.domains} size="xs" />
            )}

            {/* Controls */}
            <div className="mt-auto flex items-center justify-between gap-2 pt-1">
              {/* Qty stepper */}
              <div className="flex items-center gap-1 rounded-lg border border-border/60">
                <button
                  onClick={() => handleQty(item.card.id, -1, item.quantity)}
                  disabled={isPending}
                  className="flex h-7 w-7 items-center justify-center rounded-l-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="min-w-[24px] text-center text-xs font-medium tabular-nums">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleQty(item.card.id, 1, item.quantity)}
                  disabled={isPending}
                  className="flex h-7 w-7 items-center justify-center rounded-r-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              {/* Delete */}
              <button
                onClick={() => handleDelete(item.card.id)}
                disabled={deletingId !== null}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                title="Eliminar"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
