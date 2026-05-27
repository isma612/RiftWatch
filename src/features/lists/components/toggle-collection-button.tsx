"use client";

import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { toggleCollectionAction } from "@/features/lists/actions/list-actions";

interface ToggleCollectionButtonProps {
  listId: string;
  included: boolean;
}

export function ToggleCollectionButton({ listId, included }: ToggleCollectionButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleCollectionAction(listId, !included);
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors",
        included
          ? "bg-emerald-500/15 text-emerald-400"
          : "bg-muted/50 text-muted-foreground hover:bg-muted"
      )}
    >
      {included ? "● En colección" : "○ Excluida"}
    </button>
  );
}
