"use client";

import * as React from "react";
import { Plus, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { addToListAction } from "@/features/lists/actions/list-actions";
import { useListsForUser } from "@/features/lists/hooks/use-lists";
import { toast } from "sonner";

interface AddToListButtonProps {
  riftboundId: string;
  cardName: string;
  className?: string;
  size?: "icon" | "sm";
}

export function AddToListButton({
  riftboundId,
  cardName,
  className,
  size = "icon",
}: AddToListButtonProps) {
  const { data: lists = [], isLoading } = useListsForUser();
  const [isFoil, setIsFoil] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const [adding, setAdding] = React.useState<string | null>(null);

  async function handleAdd(listId: string, listName: string) {
    setAdding(listId);
    try {
      await addToListAction(listId, riftboundId, quantity, isFoil);
      toast.success(`"${cardName}" añadida a ${listName}`);
    } catch {
      toast.error("Error al añadir carta");
    } finally {
      setAdding(null);
      setQuantity(1);
      setIsFoil(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={size === "icon" ? "icon" : "sm"}
          className={cn("h-7 w-7 rounded-lg", className)}
          title="Añadir a lista"
          onClick={(e) => e.stopPropagation()}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="text-xs">Añadir a lista</DropdownMenuLabel>

        {/* Foil toggle */}
        <div className="mx-1 mb-1 flex rounded-lg overflow-hidden border border-border/60">
          <button
            onClick={() => setIsFoil(false)}
            className={cn(
              "flex-1 py-1 text-xs transition-colors",
              !isFoil ? "bg-secondary text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Normal
          </button>
          <button
            onClick={() => setIsFoil(true)}
            className={cn(
              "flex-1 py-1 text-xs transition-colors",
              isFoil ? "bg-amber-500/20 text-amber-400 font-medium" : "text-muted-foreground hover:text-foreground"
            )}
          >
            ✨ Foil
          </button>
        </div>

        {/* Quantity stepper */}
        <div className="mx-1 mb-1 flex items-center justify-between gap-2 rounded-lg border border-border/60 px-2 py-1">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-5 w-5 rounded text-muted-foreground hover:text-foreground"
          >
            −
          </button>
          <span className="min-w-[20px] text-center text-xs font-medium tabular-nums">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="h-5 w-5 rounded text-muted-foreground hover:text-foreground"
          >
            +
          </button>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {isLoading && (
            <DropdownMenuItem disabled>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Cargando…
            </DropdownMenuItem>
          )}
          {lists.map((list) => (
            <DropdownMenuItem
              key={list.id}
              onClick={() => handleAdd(list.id, list.name)}
              disabled={adding === list.id}
              className="gap-2"
            >
              {adding === list.id ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5 opacity-0" />
              )}
              <span className="truncate">{list.name}</span>
            </DropdownMenuItem>
          ))}
          {!isLoading && lists.length === 0 && (
            <DropdownMenuItem disabled className="text-xs text-muted-foreground">
              Sin listas creadas
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
