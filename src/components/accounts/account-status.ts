import type { AccountStatus } from "@/types";

export const ACCOUNT_STATUS_LABELS: Record<AccountStatus, string> = {
  ACTIVE: "Activa",
  BLOCKED: "Bloqueada",
  CLOSED: "Cerrada",
};

export function getAccountStatusLabel(status: AccountStatus): string {
  return ACCOUNT_STATUS_LABELS[status];
}

export function getAccountStatusClassName(status: AccountStatus): string {
  switch (status) {
    case "ACTIVE":
      return "border-transparent bg-success/10 text-success";
    case "BLOCKED":
      return "border-transparent bg-warning/10 text-warning";
    case "CLOSED":
      return "border-transparent bg-destructive/10 text-destructive";
  }
}
