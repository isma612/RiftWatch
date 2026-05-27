import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserCollection } from "@/features/collection/services/collection.service";
import { PageHeader } from "@/components/layout/page-header";
import { CollectionFilters } from "@/features/collection/components/collection-filters";

export const metadata = { title: "Mi Colección" };

async function CollectionContent() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const cards = await getUserCollection(session.user.id);

  return (
    <div className="space-y-4">
      <div className="flex gap-6 text-sm text-muted-foreground">
        <span>
          <span className="font-semibold text-foreground">{cards.length}</span>{" "}
          carta{cards.length !== 1 ? "s" : ""} únicas
        </span>
        <span>
          <span className="font-semibold text-foreground">
            {cards.reduce((s, c) => s + c.totalQty, 0)}
          </span>{" "}
          copias totales
        </span>
      </div>
      <CollectionFilters cards={cards} />
    </div>
  );
}

export default function CollectionPage() {
  return (
    <>
      <PageHeader eyebrow="Personal" title="Mi Colección" />
      <Suspense
        fallback={
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl border border-border/60 bg-card" />
            ))}
          </div>
        }
      >
        <CollectionContent />
      </Suspense>
    </>
  );
}
