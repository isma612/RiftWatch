"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Layers } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSearchStore } from "@/store/use-search-store";
import { useSearchCards } from "@/features/search/hooks/use-search-cards";
import Image from "next/image";

const QUICK_ACTIONS = [
  { label: "Expansiones", href: "/sets", icon: Layers },
];

export function CommandPalette() {
  const { isOpen, close } = useSearchStore();
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  const { data: results = [], isLoading } = useSearchCards(query);

  // Keyboard shortcut
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        useSearchStore.getState().toggle();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  function handleSelect(href: string) {
    close();
    setQuery("");
    router.push(href);
  }

  function handleSearchSubmit() {
    if (!query.trim()) return;
    handleSelect(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={(o) => !o && close()}>
      <CommandInput
        placeholder="Buscar cartas de Riftbound…"
        value={query}
        onValueChange={setQuery}
        onKeyDown={(e) => {
          if (e.key === "Enter" && query.trim()) {
            e.preventDefault();
            handleSearchSubmit();
          }
        }}
      />
      <CommandList>
        <CommandEmpty>
          {isLoading ? "Buscando…" : "Sin resultados"}
        </CommandEmpty>

        {!query && (
          <CommandGroup heading="Acciones rápidas">
            {QUICK_ACTIONS.map(({ label, href, icon: Icon }) => (
              <CommandItem
                key={href}
                onSelect={() => handleSelect(href)}
                className="gap-2"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                {label}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {results.length > 0 && (
          <CommandGroup heading="Cartas">
            {results.slice(0, 6).map((card) => (
              <CommandItem
                key={card.id}
                onSelect={() => handleSelect(`/card/${card.id}`)}
                className="gap-3"
              >
                {card.media.image_url ? (
                  <Image
                    src={card.media.image_url}
                    alt={card.name}
                    width={32}
                    height={44}
                    className="rounded object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="h-11 w-8 rounded bg-muted/50" />
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{card.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {card.set.label ?? card.set.set_id}
                    {card.classification.rarity && ` · ${card.classification.rarity}`}
                    {card.classification.type && ` · ${card.classification.type}`}
                  </p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {query.trim() && (
          <CommandGroup>
            <CommandItem
              onSelect={handleSearchSubmit}
              className="gap-2 text-muted-foreground"
            >
              <Search className="h-3.5 w-3.5" />
              Buscar &quot;{query}&quot; en todas las cartas
            </CommandItem>
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
