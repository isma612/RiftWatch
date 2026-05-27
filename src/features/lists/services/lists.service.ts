import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { ensureCardByRiftboundId } from "@/features/cards/services/card.service";
import type { UserList } from "@prisma/client";

export interface ListSummary {
  id: string;
  name: string;
  itemCount: number;
  includeInCollection: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListItemEntry {
  id: string;
  listId: string;
  quantity: number;
  purchasePriceUsd: number | null;
  isFoil: boolean;
  createdAt: Date;
  card: {
    id: string;
    riftboundId: string;
    name: string;
    setId: string;
    setLabel: string | null;
    rarity: string | null;
    cardType: string | null;
    domains: string[];
    energy: number | null;
    might: number | null;
    power: number | null;
    imageUrl: string | null;
    collectorNumber: string | null;
    tcgplayerId: string | null;
    alternateArt: boolean;
  };
}

export interface ListDetail {
  id: string;
  name: string;
  userId: string;
  includeInCollection: boolean;
  createdAt: Date;
  updatedAt: Date;
  items: ListItemEntry[];
  totalItems: number;
}

// =============================================================================
// Reads
// =============================================================================

async function ensureDefaultList(userId: string): Promise<void> {
  await prisma.userList.upsert({
    where: { userId_name: { userId, name: "Mi colección" } },
    create: { userId, name: "Mi colección", includeInCollection: true },
    update: {},
  });
}

export async function getUserLists(userId: string): Promise<ListSummary[]> {
  await ensureDefaultList(userId);

  const lists = await prisma.userList.findMany({
    where: { userId },
    include: {
      items: { select: { id: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return lists
    .map((list) => ({
      id: list.id,
      name: list.name,
      itemCount: list.items.length,
      includeInCollection: list.includeInCollection,
      createdAt: list.createdAt,
      updatedAt: list.updatedAt,
    }))
    .sort((a, b) => {
      if (a.name === "Mi colección") return -1;
      if (b.name === "Mi colección") return 1;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
}

export const getListWithItems = cache(async function getListWithItems(
  listId: string,
  userId: string
): Promise<ListDetail | null> {
  const list = await prisma.userList.findFirst({
    where: { id: listId, userId },
    include: {
      items: {
        include: {
          card: {
            select: {
              id: true,
              riftboundId: true,
              name: true,
              setId: true,
              setLabel: true,
              rarity: true,
              cardType: true,
              domains: true,
              energy: true,
              might: true,
              power: true,
              imageUrl: true,
              collectorNumber: true,
              tcgplayerId: true,
              alternateArt: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!list) return null;

  const items: ListItemEntry[] = list.items.map((item) => ({
    id: item.id,
    listId: item.listId,
    quantity: item.quantity,
    purchasePriceUsd: item.purchasePriceUsd,
    isFoil: item.isFoil,
    createdAt: item.createdAt,
    card: {
      id: item.card.id,
      riftboundId: item.card.riftboundId,
      name: item.card.name,
      setId: item.card.setId,
      setLabel: item.card.setLabel,
      rarity: item.card.rarity,
      cardType: item.card.cardType,
      domains: item.card.domains,
      energy: item.card.energy,
      might: item.card.might,
      power: item.card.power,
      imageUrl: item.card.imageUrl,
      collectorNumber: item.card.collectorNumber,
      tcgplayerId: item.card.tcgplayerId,
      alternateArt: item.card.alternateArt,
    },
  }));

  return {
    id: list.id,
    name: list.name,
    userId: list.userId,
    includeInCollection: list.includeInCollection,
    createdAt: list.createdAt,
    updatedAt: list.updatedAt,
    items,
    totalItems: items.length,
  };
});

// =============================================================================
// Writes
// =============================================================================

export async function createList(
  userId: string,
  name: string
): Promise<UserList> {
  return prisma.userList.create({
    data: { userId, name: name.trim().slice(0, 80) },
  });
}

export async function deleteList(
  listId: string,
  userId: string
): Promise<void> {
  await prisma.userList.deleteMany({ where: { id: listId, userId } });
}

export async function addToList(
  listId: string,
  riftboundId: string,
  quantity = 1,
  isFoil = false
): Promise<void> {
  const card = await ensureCardByRiftboundId(riftboundId);
  if (!card) throw new Error("Carta no encontrada");

  await prisma.userListItem.upsert({
    where: { listId_cardId: { listId, cardId: card.id } },
    create: { listId, cardId: card.id, quantity: Math.max(1, quantity), isFoil },
    update: { quantity: { increment: quantity } },
  });

  await prisma.userList.update({
    where: { id: listId },
    data: { updatedAt: new Date() },
  });
}

export async function removeFromList(
  listId: string,
  cardId: string
): Promise<void> {
  await prisma.userListItem.deleteMany({ where: { listId, cardId } });
  await prisma.userList.update({
    where: { id: listId },
    data: { updatedAt: new Date() },
  });
}

export async function updateListItem(
  listId: string,
  cardId: string,
  patch: { quantity?: number; purchasePriceUsd?: number | null; isFoil?: boolean }
): Promise<void> {
  const data: Record<string, unknown> = {};
  if (patch.quantity !== undefined) data.quantity = Math.max(1, patch.quantity);
  if ("purchasePriceUsd" in patch) data.purchasePriceUsd = patch.purchasePriceUsd;
  if (patch.isFoil !== undefined) data.isFoil = patch.isFoil;

  await prisma.userListItem.updateMany({ where: { listId, cardId }, data });
}

export async function toggleListCollection(
  listId: string,
  userId: string,
  include: boolean
): Promise<void> {
  await prisma.userList.updateMany({
    where: { id: listId, userId },
    data: { includeInCollection: include },
  });
}

export async function removeCardFromAllLists(
  userId: string,
  cardDbId: string
): Promise<void> {
  await prisma.userListItem.deleteMany({
    where: {
      cardId: cardDbId,
      list: { userId },
    },
  });
}
