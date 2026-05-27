import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getListWithItems } from "@/features/lists/services/lists.service";
import { PageHeader } from "@/components/layout/page-header";
import { ExportClipboardButton } from "@/features/lists/components/export-clipboard-button";
import { DeleteListButton } from "@/features/lists/components/delete-list-button";
import { ToggleCollectionButton } from "@/features/lists/components/toggle-collection-button";
import { ListItemsView } from "@/features/lists/components/list-items-view";

interface Props {
  params: Promise<{ listId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) return { title: "Lista" };
  const { listId } = await params;
  const list = await getListWithItems(listId, session.user.id);
  return { title: list?.name ?? "Lista" };
}

export default async function ListDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { listId } = await params;
  const list = await getListWithItems(listId, session.user.id);
  if (!list) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Lista"
        title={list.name}
        actions={
          <div className="flex items-center gap-2">
            <ToggleCollectionButton listId={list.id} included={list.includeInCollection} />
            <ExportClipboardButton listId={list.id} />
            <DeleteListButton listId={list.id} listName={list.name} redirectAfter />
          </div>
        }
      />

      <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
        <span>{list.totalItems} carta{list.totalItems !== 1 ? "s" : ""}</span>
      </div>

      {list.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium">Lista vacía</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Añade cartas desde las expansiones o la búsqueda.
          </p>
        </div>
      ) : (
        <ListItemsView items={list.items} listId={list.id} />
      )}
    </>
  );
}
