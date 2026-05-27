import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import {
  getAllCardsInSet,
  getSetById,
} from "@/features/cards/services/riftcodex.service";
import { SetFilters } from "@/features/sets/components/set-filters";

interface Props {
  params: Promise<{ setId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { setId } = await params;
  const set = await getSetById(setId);
  return { title: set?.label ?? setId.toUpperCase() };
}

async function SetContent({ setId }: { setId: string }) {
  const [set, cards] = await Promise.all([
    getSetById(setId),
    getAllCardsInSet(setId),
  ]);

  if (!set && cards.length === 0) notFound();

  const label = set?.label ?? setId.toUpperCase();

  return <SetFilters cards={cards} setLabel={label} />;
}

export default async function SetDetailPage({ params }: Props) {
  const { setId } = await params;
  const set = await getSetById(setId);
  const label = set?.label ?? setId.toUpperCase();

  return (
    <>
      <PageHeader eyebrow="Expansión" title={label} />
      <Suspense
        fallback={
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-2xl border border-border/60 bg-card"
              />
            ))}
          </div>
        }
      >
        <SetContent setId={setId} />
      </Suspense>
    </>
  );
}
