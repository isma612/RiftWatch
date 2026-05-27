import type { RiftboundCard } from "@/features/cards/services/riftcodex.service";

export interface CardDomain {
  riftboundId: string;
  name: string;
  cleanName?: string | null;
  collectorNumber?: string | null;
  setId: string;
  setLabel?: string | null;
  rarity?: string | null;
  cardType?: string | null;
  supertype?: string | null;
  domains: string[];
  energy?: number | null;
  might?: number | null;
  power?: number | null;
  textRich?: string | null;
  textPlain?: string | null;
  flavourText?: string | null;
  imageUrl?: string | null;
  artist?: string | null;
  alternateArt: boolean;
  tcgplayerId?: string | null;
  tags: string[];
}

export function mapRiftboundCard(rc: RiftboundCard): CardDomain {
  return {
    riftboundId: rc.id,
    name: rc.name,
    cleanName: rc.metadata?.clean_name ?? null,
    collectorNumber: rc.collector_number ?? null,
    setId: rc.set.set_id,
    setLabel: rc.set.label ?? null,
    rarity: rc.classification.rarity ?? null,
    cardType: rc.classification.type ?? null,
    supertype: rc.classification.supertype ?? null,
    domains: rc.classification.domain ?? [],
    energy: rc.attributes.energy ?? null,
    might: rc.attributes.might ?? null,
    power: rc.attributes.power ?? null,
    textRich: rc.text.rich ?? null,
    textPlain: rc.text.plain ?? null,
    flavourText: rc.text.flavour ?? null,
    imageUrl: rc.media.image_url ?? null,
    artist: rc.media.artist ?? null,
    alternateArt: rc.metadata?.alternate_art ?? false,
    tcgplayerId: rc.tcgplayer_id ?? null,
    tags: rc.tags ?? [],
  };
}
