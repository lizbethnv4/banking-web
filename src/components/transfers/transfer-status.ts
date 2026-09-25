import type { TransferStatus } from "@/types";

export const TRANSFER_STATUS_LABELS: Record<TransferStatus, string> = {
  PENDING: "Pendiente",
  COMPLETED: "Completada",
  FAILED: "Fallida",
};

export function getTransferStatusLabel(status: TransferStatus): string {
  return TRANSFER_STATUS_LABELS[status];
}

export function getTransferStatusClassName(status: TransferStatus): string {
  switch (status) {
    case "COMPLETED":
      return "border-transparent bg-success/10 text-success";
    case "PENDING":
      return "border-transparent bg-warning/10 text-warning";
    case "FAILED":
      return "border-transparent bg-destructive/10 text-destructive";
  }
}

export function getTransferErrorTitle(code?: string): string {
  switch (code) {
    case "INSUFFICIENT_BALANCE":
      return "Fondos insuficientes";
    case "SOURCE_ACCOUNT_NOT_FOUND":
      return "Cuenta de origen no encontrada";
    case "DESTINATION_ACCOUNT_NOT_FOUND":
      return "Cuenta de destino no encontrada";
    case "SOURCE_ACCOUNT_NOT_ACTIVE":
      return "Cuenta de origen inactiva";
    case "DESTINATION_ACCOUNT_NOT_ACTIVE":
      return "Cuenta de destino inactiva";
    case "SAME_ACCOUNT_TRANSFER":
      return "Cuentas iguales";
    case "IDEMPOTENCY_KEY_CONFLICT":
      return "Clave de idempotencia en conflicto";
    case "INVALID_AMOUNT":
      return "Monto inválido";
    case "VALIDATION_ERROR":
      return "Datos inválidos";
    case "DEADLOCK_RETRY_EXHAUSTED":
      return "No se pudo completar por concurrencia";
    default:
      return "No se pudo completar la transferencia";
  }
}
