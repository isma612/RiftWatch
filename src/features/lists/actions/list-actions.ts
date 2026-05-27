"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import {
  addToList,
  createList,
  deleteList,
  getListWithItems,
  removeCardFromAllLists,
  removeFromList,
  toggleListCollection,
  updateListItem,
} from "@/features/lists/services/lists.service";

// ─── List CRUD ────────────────────────────────────────────────────────────────

export async function createListAction(name: string) {
  const session = await auth();
  if (!session?.user?.id) return;
  await createList(session.user.id, name);
  revalidatePath("/lists");
}

export async function deleteListAction(listId: string) {
  const session = await auth();
  if (!session?.user?.id) return;
  await deleteList(listId, session.user.id);
  revalidatePath("/lists");
}

export async function toggleCollectionAction(listId: string, include: boolean) {
  const session = await auth();
  if (!session?.user?.id) return;
  await toggleListCollection(listId, session.user.id, include);
  revalidatePath("/lists");
  revalidatePath("/collection");
}

// ─── List Items ───────────────────────────────────────────────────────────────

export async function addToListAction(
  listId: string,
  riftboundId: string,
  quantity = 1,
  isFoil = false
) {
  const session = await auth();
  if (!session?.user?.id) return;
  await addToList(listId, riftboundId, quantity, isFoil);
  revalidatePath(`/lists/${listId}`);
  revalidatePath("/collection");
}

export async function removeFromListAction(listId: string, cardId: string) {
  const session = await auth();
  if (!session?.user?.id) return;
  await removeFromList(listId, cardId);
  revalidatePath(`/lists/${listId}`);
  revalidatePath("/collection");
}

export async function updateListItemAction(
  listId: string,
  cardId: string,
  patch: { quantity?: number; isFoil?: boolean }
) {
  const session = await auth();
  if (!session?.user?.id) return;
  await updateListItem(listId, cardId, patch);
  revalidatePath(`/lists/${listId}`);
  revalidatePath("/collection");
}

export async function removeCardFromCollectionAction(cardDbId: string) {
  const session = await auth();
  if (!session?.user?.id) return;
  await removeCardFromAllLists(session.user.id, cardDbId);
  revalidatePath("/collection");
}

// ─── Export ───────────────────────────────────────────────────────────────────

export async function exportListAsTextAction(
  listId: string
): Promise<{ text: string; fileName: string } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autenticado" };

  const list = await getListWithItems(listId, session.user.id);
  if (!list) return { error: "Lista no encontrada" };

  const lines = list.items.map(
    (item) => `${item.quantity} ${item.card.name.toLowerCase()}`
  );
  const text = lines.join("\n");
  const fileName = `${list.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`;
  return { text, fileName };
}
