import { Suspense } from "react";
import Link from "next/link";
import { Plus, List } from "lucide-react";
import { auth } from "@/lib/auth";
import { getUserLists } from "@/features/lists/services/lists.service";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { CreateListForm } from "@/features/lists/components/create-list-form";
import { DeleteListButton } from "@/features/lists/components/delete-list-button";
import { ToggleCollectionButton } from "@/features/lists/components/toggle-collection-button";

export const metadata = { title: "Mis listas" };

async function ListsContent() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const lists = await getUserLists(session.user.id);

  return (
    <div className="space-y-6">
      <CreateListForm />

      {lists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <List className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">Sin listas todavía</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Crea tu primera lista para empezar a añadir cartas.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => (
            <Card
              key={list.id}
              className="group relative transition-all duration-200 hover:border-border hover:shadow-sm"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/lists/${list.id}`}
                    className="min-w-0 flex-1"
                  >
                    <p className="truncate font-semibold text-sm">{list.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {list.itemCount} carta{list.itemCount !== 1 ? "s" : ""}
                    </p>
                  </Link>
                  <DeleteListButton listId={list.id} listName={list.name} />
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <ToggleCollectionButton
                    listId={list.id}
                    included={list.includeInCollection}
                  />
                  <Link
                    href={`/lists/${list.id}`}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Ver →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ListsPage() {
  return (
    <>
      <PageHeader eyebrow="Personal" title="Mis listas" />
      <Suspense
        fallback={
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl border border-border/60 bg-card" />
            ))}
          </div>
        }
      >
        <ListsContent />
      </Suspense>
    </>
  );
}
