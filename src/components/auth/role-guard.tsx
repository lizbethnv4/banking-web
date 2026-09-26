"use client";

import type { ReactNode } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { hasRole } from "@/lib/roles";
import type { UserRole } from "@/types";

type RoleGuardProps = {
  roles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
};

export function RoleGuard({
  roles,
  children,
  fallback = null,
}: RoleGuardProps) {
  const { user } = useAuth();

  if (!hasRole(user, ...roles)) {
    return fallback;
  }

  return children;
}
