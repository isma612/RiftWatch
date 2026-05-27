"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, List, Archive, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/sets", label: "Expansiones", icon: Layers },
  { href: "/lists", label: "Listas", icon: List },
  { href: "/collection", label: "Colección", icon: Archive },
  { href: "/settings", label: "Config", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 flex h-16 items-center border-t border-border/60 bg-background/95 backdrop-blur-sm lg:hidden">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-medium transition-colors",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
