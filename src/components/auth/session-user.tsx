"use client";

import { LogOut } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getRoleLabel } from "@/lib/roles";

type SessionUserProps = {
  variant?: "sidebar" | "sheet" | "header";
};

export function SessionUser({ variant = "sidebar" }: SessionUserProps) {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  if (variant === "header") {
    return (
      <div className="flex min-w-0 max-w-[40vw] shrink-0 items-center gap-1 sm:max-w-48">
        <div className="hidden min-w-0 text-right min-[380px]:block">
          <p className="truncate text-xs font-medium">{user.email}</p>
          <p className="truncate text-[11px] text-muted-foreground">
            {getRoleLabel(user.role)}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={logout}
          aria-label="Cerrar sesión"
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{user.email}</p>
        <Badge
          variant={user.role === "ADMIN" ? "default" : "secondary"}
          className="mt-1"
        >
          {getRoleLabel(user.role)}
        </Badge>
      </div>
      <Button
        type="button"
        variant={variant === "sidebar" ? "secondary" : "outline"}
        size="sm"
        onClick={logout}
        className="w-full"
      >
        Cerrar sesión
      </Button>
    </div>
  );
}
