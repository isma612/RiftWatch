import { cn } from "@/lib/utils";

interface CardStatsProps {
  energy?: number | null;
  might?: number | null;
  power?: number | null;
  size?: "sm" | "md";
  className?: string;
}

export function CardStats({ energy, might, power, size = "md", className }: CardStatsProps) {
  const hasAny = energy != null || might != null || power != null;
  if (!hasAny) return null;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {energy != null && (
        <Stat label="Energía" icon="⚡" value={energy} size={size} />
      )}
      {might != null && (
        <Stat label="Fuerza" icon="💪" value={might} size={size} />
      )}
      {power != null && (
        <Stat label="Poder" icon="⚔️" value={power} size={size} />
      )}
    </div>
  );
}

function Stat({
  label,
  icon,
  value,
  size,
}: {
  label: string;
  icon: string;
  value: number;
  size: "sm" | "md";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-lg bg-muted/40 font-medium tabular-nums",
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-2.5 py-1 text-sm"
      )}
      title={label}
    >
      <span>{icon}</span>
      <span>{value}</span>
    </div>
  );
}
