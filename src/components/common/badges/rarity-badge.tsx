import { cn } from "@/lib/utils";

const RARITY_STYLES: Record<string, string> = {
  Common: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  Uncommon: "bg-slate-400/15 text-slate-400 border-slate-400/20",
  Rare: "bg-yellow-500/15 text-yellow-500 border-yellow-500/20",
  Epic: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  Showcase: "bg-amber-500/15 text-amber-400 border-amber-500/20",
};

interface RarityBadgeProps {
  rarity?: string | null;
  className?: string;
}

export function RarityBadge({ rarity, className }: RarityBadgeProps) {
  if (!rarity) return null;
  const style = RARITY_STYLES[rarity] ?? "bg-muted/50 text-muted-foreground border-border/50";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-semibold",
        style,
        className
      )}
    >
      {rarity}
    </span>
  );
}
