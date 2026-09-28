"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_ITEMS } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils";

type AppNavProps = {
  variant?: "sidebar" | "sheet";
  onNavigate?: () => void;
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppNav({ variant = "sidebar", onNavigate }: AppNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegación principal" className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-sidebar-ring/50",
              variant === "sidebar" &&
                (active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"),
              variant === "sheet" &&
                (active
                  ? "bg-muted font-medium text-foreground"
                  : "text-foreground hover:bg-muted"),
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
