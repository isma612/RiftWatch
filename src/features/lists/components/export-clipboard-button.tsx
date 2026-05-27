"use client";

import { useTransition } from "react";
import { Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportListAsTextAction } from "@/features/lists/actions/list-actions";
import { toast } from "sonner";

export function ExportClipboardButton({ listId }: { listId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleExport() {
    startTransition(async () => {
      const result = await exportListAsTextAction(listId);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      try {
        await navigator.clipboard.writeText(result.text);
        toast.success("Lista copiada al portapapeles ✓");
      } catch {
        // Fallback download
        const blob = new Blob([result.text], { type: "text/plain;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = result.fileName;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Lista descargada ✓");
      }
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={isPending}
      className="gap-1.5"
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      Exportar
    </Button>
  );
}
