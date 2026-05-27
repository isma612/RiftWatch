import "server-only";

import { prisma } from "@/lib/prisma";

export interface CollectionCard {
  cardDbId: string;
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
  alternateArt: boolean;
  totalQty: number;
  lists: Array<{
    listId: string;
    listName: string;
    qty: number;
    isFoil: boolean;
  }>;
}

export async function getUserCollection(userId: string): Promise<CollectionCard[]> {
  const items = await prisma.userListItem.findMany({
    where: {
      list: {
        userId,
        includeInCollection: true,
      },
    },
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
          alternateArt: true,
        },
      },
      list: { select: { id: true, name: true } },
    },
  });

  // Group by card
  const map = new Map<string, CollectionCard>();

  for (const item of items) {
    const existing = map.get(item.cardId);
    if (existing) {
      existing.totalQty += item.quantity;
      existing.lists.push({
        listId: item.listId,
        listName: item.list.name,
        qty: item.quantity,
        isFoil: item.isFoil,
      });
    } else {
      map.set(item.cardId, {
        cardDbId: item.cardId,
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
        alternateArt: item.card.alternateArt,
        totalQty: item.quantity,
        lists: [
          {
            listId: item.listId,
            listName: item.list.name,
            qty: item.quantity,
            isFoil: item.isFoil,
          },
        ],
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}
