"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

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
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b">
          <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
          <AppBrand compact />
        </SheetHeader>
        <div className="p-3">
          <AppNav variant="sheet" onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
