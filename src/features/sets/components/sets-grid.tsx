import Link from "next/link";
import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RiftboundSet } from "@/features/cards/services/riftcodex.service";

const SET_ORDER = ["OGN", "SFD", "UNL", "OGS", "OPP", "JDG", "PR"];

function getSetOrdinal(setId: string) {
  const idx = SET_ORDER.indexOf(setId.toUpperCase());
  return idx === -1 ? 999 : idx;
}

interface SetsGridProps {
  sets: RiftboundSet[];
}

export function SetsGrid({ sets }: SetsGridProps) {
  const sorted = [...sets].sort(
    (a, b) => getSetOrdinal(a.id) - getSetOrdinal(b.id)
  );

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {sorted.map((set) => (
        <SetCard key={set.id} set={set} />
      ))}
    </div>
  );
}

function SetCard({ set }: { set: RiftboundSet }) {
  return (
    <Link
      href={`/sets/${set.id}`}
      title={set.label}
      className={cn(
        "group flex h-24 flex-col overflow-hidden rounded-2xl border border-border/60 bg-card p-3",
        "transition-all duration-200 hover:border-border hover:bg-card/80 hover:shadow-sm"
      )}
    >
      <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
        <Layers className="h-4 w-4 text-primary" />
      </div>
      <p className="line-clamp-2 text-xs font-semibold leading-tight">
        {set.label}
      </p>
      <p className="mt-auto text-[10px] text-muted-foreground">
        {set.id.toUpperCase()}
        {set.card_count ? ` · ${set.card_count} cartas` : ""}
      </p>
    </Link>
  );
}
