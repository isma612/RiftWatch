"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createListAction } from "@/features/lists/actions/list-actions";
import { toast } from "sonner";

export function CreateListForm() {
  const [name, setName] = React.useState("");
  const [isPending, startTransition] = React.useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    startTransition(async () => {
      await createListAction(name.trim());
      setName("");
      toast.success("Lista creada");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        placeholder="Nombre de la nueva lista…"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={80}
        className="flex-1"
      />
      <Button type="submit" size="sm" disabled={isPending || !name.trim()} className="gap-1">
        <Plus className="h-3.5 w-3.5" />
        Crear
      </Button>
    </form>
  );
}
