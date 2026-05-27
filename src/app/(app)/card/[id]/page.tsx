import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { getCardById } from "@/features/cards/services/riftcodex.service";
import { upsertCardFromApi, markCardViewed } from "@/features/cards/services/card.service";
import { DomainBadges } from "@/components/common/riftbound/domain-badge";
import { CardStats } from "@/components/common/riftbound/card-stats";
import { RarityBadge } from "@/components/common/badges/rarity-badge";
import { AddToListButton } from "@/features/lists/components/add-to-list-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const card = await getCardById(id);
  if (!card) return { title: "Carta no encontrada" };
  return { title: card.name };
}

export default async function CardDetailPage({ params }: Props) {
  const { id } = await params;

  const rc = await getCardById(id);
  if (!rc) notFound();

  // Upsert to DB and track view (fire-and-forget)
  upsertCardFromApi(rc).then((c) => markCardViewed(c.riftboundId)).catch(() => {});

  const domains = rc.classification.domain ?? [];
  const tcgUrl = rc.tcgplayer_id
    ? `https://www.tcgplayer.com/product/${rc.tcgplayer_id}`
    : null;

  return (
    <>
      <PageHeader
        eyebrow={rc.set.label ?? rc.set.set_id.toUpperCase()}
        title={rc.name}
        actions={<AddToListButton riftboundId={rc.id} cardName={rc.name} size="sm" />}
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Left: image */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-border/60 bg-muted/20">
            {rc.media.image_url ? (
              <Image
                src={rc.media.image_url}
                alt={rc.name}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                Sin imagen
              </div>
            )}
          </div>

          {/* Quick stats */}
          <CardStats
            energy={rc.attributes.energy}
            might={rc.attributes.might}
            power={rc.attributes.power}
            size="md"
          />

          {/* Domain badges */}
          {domains.length > 0 && (
            <DomainBadges domains={domains} size="sm" />
          )}

          {/* TCGPlayer link */}
          {tcgUrl && (
            <Link
              href={tcgUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-border/60 px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-border hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Ver en TCGPlayer
            </Link>
          )}
        </div>

        {/* Right: details */}
        <div className="space-y-4">
          {/* Type + rarity */}
          <div className="flex flex-wrap items-center gap-2">
            {rc.classification.type && (
              <span className="text-sm text-muted-foreground">
                {rc.classification.supertype && `${rc.classification.supertype} — `}
                {rc.classification.type}
              </span>
            )}
            <RarityBadge rarity={rc.classification.rarity} />
          </div>

          <Tabs defaultValue="details">
            <TabsList className="w-full">
              <TabsTrigger value="details" className="flex-1">
                Detalles
              </TabsTrigger>
              <TabsTrigger value="rules" className="flex-1">
                Reglas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4">
              <Card>
                <CardContent className="grid grid-cols-2 gap-x-4 gap-y-3 pt-6 text-sm">
                  <DetailField label="Expansión" value={rc.set.label ?? rc.set.set_id.toUpperCase()} />
                  <DetailField label="Nº colección" value={rc.collector_number} />
                  {rc.attributes.energy != null && (
                    <DetailField label="Energía ⚡" value={String(rc.attributes.energy)} />
                  )}
                  {rc.attributes.might != null && (
                    <DetailField label="Fuerza 💪" value={String(rc.attributes.might)} />
                  )}
                  {rc.attributes.power != null && (
                    <DetailField label="Poder ⚔️" value={String(rc.attributes.power)} />
                  )}
                  {rc.media.artist && (
                    <DetailField label="Artista" value={rc.media.artist} />
                  )}
                  {rc.tags && rc.tags.length > 0 && (
                    <div className="col-span-2">
                      <p className="mb-1 text-[11px] uppercase tracking-wider text-muted-foreground">Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {rc.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-lg bg-muted/50 px-2 py-0.5 text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rules" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  {rc.text.plain ? (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {rc.text.plain}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Sin texto de reglas disponible.
                    </p>
                  )}
                  {rc.text.flavour && (
                    <p className="mt-4 border-t border-border/60 pt-4 text-sm italic text-muted-foreground">
                      {rc.text.flavour}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

function DetailField({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="mb-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
