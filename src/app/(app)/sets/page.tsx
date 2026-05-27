import { Suspense } from "react";
import { Layers } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { getAllSets } from "@/features/cards/services/riftcodex.service";
import { SetsGrid } from "@/features/sets/components/sets-grid";

export const metadata = { title: "Expansiones" };

async function SetsContent() {
  const sets = await getAllSets();

  if (sets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Layers className="mb-3 h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium">No se encontraron expansiones</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Comprueba la conexión con la API de RiftCodex.
        </p>
      </div>
    );
  }

  return <SetsGrid sets={sets} />;
}

export default function SetsPage() {
  return (
    <>
      <PageHeader eyebrow="Riftbound" title="Expansiones" />
      <Suspense
        fallback={
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl border border-border/60 bg-card"
              />
            ))}
          </div>
        }
      >
        <SetsContent />
      </Suspense>
    </>
  );
}
