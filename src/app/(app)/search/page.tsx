import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { searchCards } from "@/features/cards/services/riftcodex.service";
import Image from "next/image";
import Link from "next/link";
import { RarityBadge } from "@/components/common/badges/rarity-badge";
import { AddToListButton } from "@/features/lists/components/add-to-list-button";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props) {
  const { q } = await searchParams;
  return { title: q ? `"${q}" — Búsqueda` : "Búsqueda" };
}

async function SearchResults({ query }: { query: string }) {
  if (!query || query.length < 2) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        Escribe al menos 2 caracteres para buscar.
      </p>
    );
  }

  const cards = await searchCards(query, 60);

  if (cards.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        Sin resultados para &quot;{query}&quot;.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {cards.map((card) => (
        <div
          key={card.id}
          className="group relative flex flex-col rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-200 hover:border-border hover:shadow-sm"
        >
          <Link href={`/card/${card.id}`} className="block aspect-[2/3] relative overflow-hidden bg-muted/20">
            {card.media.image_url ? (
              <Image
                src={card.media.image_url}
                alt={card.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 25vw"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground/30 text-xs">
                Sin imagen
              </div>
            )}
          </Link>
          <div className="flex flex-col gap-1 p-2">
            <Link href={`/card/${card.id}`}>
              <p className="line-clamp-2 text-[11px] font-medium leading-tight hover:text-primary transition-colors">
                {card.name}
              </p>
            </Link>
            <p className="text-[10px] text-muted-foreground">
              {card.set.label ?? card.set.set_id}
            </p>
            <div className="flex items-center justify-between gap-1">
              <RarityBadge rarity={card.classification.rarity} />
              <AddToListButton riftboundId={card.id} cardName={card.name} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;

  return (
    <>
      <PageHeader
        eyebrow="Búsqueda"
        title={q ? `Resultados para "${q}"` : "Buscar cartas"}
      />
      <Suspense
        fallback={
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl border border-border/60 bg-card" />
            ))}
          </div>
        }
      >
        <SearchResults query={q} />
      </Suspense>
    </>
  );
}
