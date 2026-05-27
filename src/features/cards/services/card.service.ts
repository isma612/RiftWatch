import { prisma } from "@/lib/prisma";
import type { Card } from "@prisma/client";
import {
  getCardById as fetchCardById,
  searchCards as fetchSearchCards,
  type RiftboundCard,
} from "./riftcodex.service";
import { mapRiftboundCard } from "../utils/mappers";

export type { Card };

/**
 * Upsert a RiftboundCard into the local DB.
 */
export async function upsertCardFromApi(rc: RiftboundCard): Promise<Card> {
  const data = mapRiftboundCard(rc);
  return prisma.card.upsert({
    where: { riftboundId: data.riftboundId },
    create: data,
    update: {
      name: data.name,
      cleanName: data.cleanName,
      setLabel: data.setLabel,
      rarity: data.rarity,
      cardType: data.cardType,
      supertype: data.supertype,
      domains: data.domains,
      energy: data.energy,
      might: data.might,
      power: data.power,
      textRich: data.textRich,
      textPlain: data.textPlain,
      flavourText: data.flavourText,
      imageUrl: data.imageUrl,
      artist: data.artist,
      alternateArt: data.alternateArt,
      tcgplayerId: data.tcgplayerId,
      tags: data.tags,
    },
  });
}

/**
 * Get a card by riftboundId, fetching from API and upserting if missing.
 */
export async function ensureCardByRiftboundId(
  riftboundId: string
): Promise<Card | null> {
  // Check DB first
  let card = await prisma.card.findUnique({ where: { riftboundId } });
  if (card) return card;

  // Fetch from API
  const rc = await fetchCardById(riftboundId);
  if (!rc) return null;

  return upsertCardFromApi(rc);
}

/**
 * Search cards via API.
 */
export async function searchCards(q: string, limit = 20): Promise<RiftboundCard[]> {
  return fetchSearchCards(q, limit);
}

/**
 * Track that a user viewed this card.
 */
export async function markCardViewed(riftboundId: string): Promise<void> {
  await prisma.card.updateMany({
    where: { riftboundId },
    data: { lastViewedAt: new Date() },
  });
}
