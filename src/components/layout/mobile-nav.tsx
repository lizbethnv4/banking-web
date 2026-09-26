"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { SessionUser } from "@/components/auth/session-user";
import { AppBrand } from "@/components/layout/app-brand";
import { AppNav } from "@/components/layout/app-nav";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Abrir menú de navegación"
          />
        }
      >
        <Menu className="size-4" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex h-dvh max-h-dvh w-[min(18rem,100%)] flex-col gap-0 p-0"
      >
        <SheetHeader className="border-b pt-[max(1rem,env(safe-area-inset-top))]">
          <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
          <AppBrand compact />
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <AppNav variant="sheet" onNavigate={() => setOpen(false)} />
        </div>
        <div className="border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <SessionUser variant="sheet" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
