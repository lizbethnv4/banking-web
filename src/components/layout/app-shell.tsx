import type { ReactNode } from "react";

import { AppBrand } from "@/components/layout/app-brand";
import { AppNav } from "@/components/layout/app-nav";
import { MobileNav } from "@/components/layout/mobile-nav";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-full bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex md:flex-col">
        <div className="border-b border-sidebar-border px-4 py-4">
          <AppBrand />
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <AppNav />
        </div>
      </aside>

      <div className="flex min-h-full flex-col md:pl-64">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-card px-4 text-foreground md:hidden">
          <MobileNav />
          <AppBrand compact />
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
