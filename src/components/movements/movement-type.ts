import type { MovementType } from "@/types";

export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  CREDIT: "Crédito",
  DEBIT: "Débito",
};

export function getMovementTypeLabel(type: MovementType): string {
  return MOVEMENT_TYPE_LABELS[type];
}

export function getMovementTypeClassName(type: MovementType): string {
  switch (type) {
    case "CREDIT":
      return "border-transparent bg-success/10 text-success";
    case "DEBIT":
      return "border-transparent bg-destructive/10 text-destructive";
  }
}
