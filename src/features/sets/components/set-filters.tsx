"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { DomainBadge } from "@/components/common/riftbound/domain-badge";
import { RarityBadge } from "@/components/common/badges/rarity-badge";
import { AddToListButton } from "@/features/lists/components/add-to-list-button";
import type { RiftboundCard } from "@/features/cards/services/riftcodex.service";
import Image from "next/image";
import Link from "next/link";

const RARITIES = ["Common", "Uncommon", "Rare", "Epic", "Showcase"];
const TYPES = ["Unit", "Spell", "Legend", "Gear"];
const DOMAINS = ["Calm", "Chaos", "Order", "Body", "Mind", "Fury"];
const SORT_OPTIONS = [
  { value: "collector", label: "Nº colección" },
  { value: "name_asc", label: "Nombre A→Z" },
  { value: "name_desc", label: "Nombre Z→A" },
  { value: "rarity", label: "Rareza" },
];

interface SetFiltersProps {
  cards: RiftboundCard[];
  setLabel: string;
}

export function SetFilters({ cards, setLabel }: SetFiltersProps) {
  const [query, setQuery] = React.useState("");
  const [rarities, setRarities] = React.useState<string[]>([]);
  const [types, setTypes] = React.useState<string[]>([]);
  const [domains, setDomains] = React.useState<string[]>([]);
  const [sort, setSort] = React.useState("collector");

  function toggleFilter<T>(
    set: React.Dispatch<React.SetStateAction<T[]>>,
    arr: T[],
    val: T
  ) {
    set(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  }

  const filtered = React.useMemo(() => {
    let result = cards;

    if (query) {
      const q = query.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q));
    }
    if (rarities.length) {
      result = result.filter((c) =>
        rarities.includes(c.classification.rarity ?? "")
      );
    }
    if (types.length) {
      result = result.filter((c) =>
        types.includes(c.classification.type ?? "")
      );
    }
    if (domains.length) {
      result = result.filter((c) =>
        domains.every((d) => c.classification.domain?.includes(d))
      );
    }

    return [...result].sort((a, b) => {
      if (sort === "name_asc") return a.name.localeCompare(b.name);
      if (sort === "name_desc") return b.name.localeCompare(a.name);
      if (sort === "rarity") {
        const order = ["Showcase", "Epic", "Rare", "Uncommon", "Common"];
        return (
          order.indexOf(a.classification.rarity ?? "") -
          order.indexOf(b.classification.rarity ?? "")
        );
      }
      // collector number
      const na = parseInt(a.collector_number ?? "9999");
      const nb = parseInt(b.collector_number ?? "9999");
      return na - nb;
    });
  }, [cards, query, rarities, types, domains, sort]);

  const activeCount = rarities.length + types.length + domains.length;

  const FilterPanel = (
    <div className="space-y-5">
      {/* Sort */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Orden</p>
        <div className="flex flex-wrap gap-1.5">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSort(opt.value)}
              className={cn(
                "rounded-xl border px-2.5 py-1 text-xs transition-colors",
                sort === opt.value
                  ? "border-primary/60 bg-primary/10 text-primary font-medium"
                  : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rarity */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Rareza</p>
        <div className="flex flex-wrap gap-1.5">
          {RARITIES.map((r) => (
            <button
              key={r}
              onClick={() => toggleFilter(setRarities, rarities, r)}
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
      </div>

      {/* Type */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Tipo</p>
        <div className="flex flex-wrap gap-1.5">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => toggleFilter(setTypes, types, t)}
              className={cn(
                "rounded-xl border px-2.5 py-1 text-xs transition-colors",
                types.includes(t)
                  ? "border-primary/60 bg-primary/10 text-primary font-medium"
                  : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Domain */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Dominio (AND)</p>
        <div className="flex flex-wrap gap-1.5">
          {DOMAINS.map((d) => (
            <button
              key={d}
              onClick={() => toggleFilter(setDomains, domains, d)}
              className={cn(
                "rounded-xl border px-2.5 py-1 text-xs transition-all",
                domains.includes(d)
                  ? "border-primary/60 bg-primary/10 text-primary font-medium"
                  : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              <DomainBadge domain={d} size="xs" className="border-0 bg-transparent p-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      {activeCount > 0 && (
        <button
          onClick={() => { setRarities([]); setTypes([]); setDomains([]); }}
          className="flex items-center gap-1 text-xs text-destructive/70 hover:text-destructive"
        >
          <X className="h-3 w-3" />
          Limpiar filtros
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Topbar */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar en esta expansión…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Desktop filters (inline) */}
        <div className="hidden lg:flex items-center gap-2 flex-wrap">
          {/* Quick rarity chips */}
          {RARITIES.map((r) => (
            <button
              key={r}
              onClick={() => toggleFilter(setRarities, rarities, r)}
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

        {/* Mobile filter sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="lg:hidden gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filtros
              {activeCount > 0 && (
                <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                  {activeCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto rounded-t-3xl p-5">
            <SheetHeader className="mb-4">
              <SheetTitle className="text-sm">Filtros</SheetTitle>
            </SheetHeader>
            {FilterPanel}
          </SheetContent>
        </Sheet>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        {filtered.length} carta{filtered.length !== 1 ? "s" : ""}
        {activeCount > 0 || query ? " encontradas" : ""}
      </p>

      {/* Card grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {filtered.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Sin cartas con los filtros actuales.
        </div>
      )}
    </div>
  );
}

function CardItem({ card }: { card: RiftboundCard }) {
  return (
    <div className="group relative flex flex-col rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-200 hover:border-border hover:shadow-sm">
      <Link href={`/card/${card.id}`} className="block aspect-[2/3] relative overflow-hidden bg-muted/20">
        {card.media.image_url ? (
          <Image
            src={card.media.image_url}
            alt={card.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground/30 text-xs">
            Sin imagen
          </div>
        )}
        {/* Foil alt art badge */}
        {card.metadata?.alternate_art && (
          <span className="absolute left-1.5 top-1.5 rounded bg-amber-500/90 px-1 py-0.5 text-[9px] font-bold text-black">
            ALT
          </span>
        )}
      </Link>

      <div className="flex flex-col gap-1 p-2">
        <Link href={`/card/${card.id}`}>
          <p className="line-clamp-2 text-[11px] font-medium leading-tight hover:text-primary transition-colors">
            {card.name}
          </p>
        </Link>
        <div className="flex items-center justify-between gap-1">
          <RarityBadge rarity={card.classification.rarity} />
          <AddToListButton riftboundId={card.id} cardName={card.name} />
        </div>
      </div>
    </div>
  );
}
