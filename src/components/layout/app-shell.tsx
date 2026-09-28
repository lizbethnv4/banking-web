import type { ReactNode } from "react";

import { SessionUser } from "@/components/auth/session-user";
import { AppBrand } from "@/components/layout/app-brand";
import { AppNav } from "@/components/layout/app-nav";
import { MobileNav } from "@/components/layout/mobile-nav";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-dvh bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex md:flex-col">
        <div className="border-b border-sidebar-border px-4 py-4">
          <AppBrand />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <AppNav />
        </div>
        <div className="border-t border-sidebar-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <SessionUser variant="sidebar" />
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-40 flex min-h-14 items-center gap-2 border-b bg-card px-3 pt-[env(safe-area-inset-top)] text-foreground md:hidden">
          <MobileNav />
          <div className="min-w-0 flex-1">
            <AppBrand compact />
          </div>
          <SessionUser variant="header" />
        </header>
        <main className="px-4 pt-6 pb-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
          <div
            aria-hidden="true"
            className="h-[max(10rem,calc(env(safe-area-inset-bottom,0px)+8rem))] md:hidden"
          />
        </main>
      </div>
    </div>
  );
}
