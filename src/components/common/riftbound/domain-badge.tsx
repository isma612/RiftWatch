import { cn } from "@/lib/utils";

const DOMAIN_STYLES: Record<string, string> = {
  Calm: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Chaos: "bg-red-500/15 text-red-400 border-red-500/20",
  Order: "bg-yellow-500/15 text-yellow-500 border-yellow-500/20",
  Body: "bg-green-500/15 text-green-400 border-green-500/20",
  Mind: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  Fury: "bg-orange-500/15 text-orange-400 border-orange-500/20",
};

const DOMAIN_ICONS: Record<string, string> = {
  Calm: "💧",
  Chaos: "🔥",
  Order: "⚡",
  Body: "🌿",
  Mind: "🔮",
  Fury: "⚔️",
};

interface DomainBadgeProps {
  domain: string;
  size?: "xs" | "sm" | "md";
  className?: string;
}

export function DomainBadge({ domain, size = "sm", className }: DomainBadgeProps) {
  const style = DOMAIN_STYLES[domain] ?? "bg-muted/50 text-muted-foreground border-border/50";
  const icon = DOMAIN_ICONS[domain] ?? "◆";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        size === "xs" && "px-1.5 py-0.5 text-[10px]",
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-2.5 py-1 text-sm",
        style,
        className
      )}
    >
      <span>{icon}</span>
      {domain}
    </span>
  );
}

interface DomainBadgesProps {
  domains: string[];
  size?: "xs" | "sm" | "md";
  className?: string;
}

export function DomainBadges({ domains, size = "sm", className }: DomainBadgesProps) {
  if (!domains || domains.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {domains.map((d) => (
        <DomainBadge key={d} domain={d} size={size} />
      ))}
    </div>
  );
}
