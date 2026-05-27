"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteListAction } from "@/features/lists/actions/list-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface DeleteListButtonProps {
  listId: string;
  listName: string;
  redirectAfter?: boolean;
}

export function DeleteListButton({ listId, listName, redirectAfter }: DeleteListButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm(`¿Eliminar la lista "${listName}"? Esta acción no se puede deshacer.`)) return;
    startTransition(async () => {
      await deleteListAction(listId);
      toast.success(`Lista "${listName}" eliminada`);
      if (redirectAfter) router.push("/lists");
    });
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 text-muted-foreground hover:text-destructive"
      onClick={handleDelete}
      disabled={isPending}
      title="Eliminar lista"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  );
}
