"use client";

import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchStore } from "@/store/use-search-store";
import { cn } from "@/lib/utils";

interface TopbarProps {
  className?: string;
}

export function Topbar({ className }: TopbarProps) {
  const open = useSearchStore((s) => s.open);

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-sm",
        className
      )}
    >
      {/* Mobile menu button placeholder */}
      <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8">
        <Menu className="h-4 w-4" />
      </Button>

      {/* Search trigger */}
      <button
        type="button"
        onClick={open}
        className="flex h-8 flex-1 items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-3 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground lg:max-w-sm"
      >
        <Search className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">Busca cartas… (Ctrl+K)</span>
        <kbd className="ml-auto hidden rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground lg:inline">
          ⌘K
        </kbd>
      </button>
    </header>
  );
}
