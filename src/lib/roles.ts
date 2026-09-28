import type { AuthUser, UserRole } from "@/types";

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Administrador",
  USER: "Usuario",
};

export function hasRole(
  user: AuthUser | null | undefined,
  ...roles: UserRole[]
): boolean {
  return Boolean(user && roles.includes(user.role));
}

export function isAdmin(user: AuthUser | null | undefined): boolean {
  return hasRole(user, "ADMIN");
}

export function getRoleLabel(role: UserRole): string {
  return ROLE_LABELS[role];
}
