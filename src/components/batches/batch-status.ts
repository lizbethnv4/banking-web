import type { BatchItemStatus, BatchStatus, TerminalBatchStatus } from "@/types";
import { TERMINAL_BATCH_STATUSES } from "@/types";

export const BATCH_STATUS_LABELS: Record<BatchStatus, string> = {
  PENDING: "Pendiente",
  VALIDATING: "Validando",
  PROCESSING: "Procesando",
  COMPLETED: "Completado",
  COMPLETED_WITH_ERRORS: "Completado con errores",
  FAILED: "Fallido",
};

export function getBatchStatusLabel(status: BatchStatus): string {
  return BATCH_STATUS_LABELS[status];
}

export function getBatchStatusClassName(status: BatchStatus): string {
  switch (status) {
    case "COMPLETED":
      return "border-transparent bg-success/10 text-success";
    case "COMPLETED_WITH_ERRORS":
      return "border-transparent bg-warning/10 text-warning";
    case "FAILED":
      return "border-transparent bg-destructive/10 text-destructive";
    case "PROCESSING":
    case "VALIDATING":
      return "border-transparent bg-info/10 text-info";
    case "PENDING":
      return "border-transparent bg-muted text-muted-foreground";
  }
}

export function isTerminalBatchStatus(
  status: BatchStatus,
): status is TerminalBatchStatus {
  return (TERMINAL_BATCH_STATUSES as readonly string[]).includes(status);
}

export const BATCH_ITEM_STATUS_LABELS: Record<BatchItemStatus, string> = {
  PENDING: "Pendiente",
  PROCESSING: "Procesando",
  SUCCEEDED: "Exitosa",
  FAILED: "Fallida",
  RETRYING: "Reintentando",
};

export function getBatchItemStatusLabel(status: BatchItemStatus): string {
  return BATCH_ITEM_STATUS_LABELS[status];
}

export function getBatchItemStatusClassName(status: BatchItemStatus): string {
  switch (status) {
    case "SUCCEEDED":
      return "border-transparent bg-success/10 text-success";
    case "FAILED":
      return "border-transparent bg-destructive/10 text-destructive";
    case "PROCESSING":
    case "RETRYING":
      return "border-transparent bg-info/10 text-info";
    case "PENDING":
      return "border-transparent bg-muted text-muted-foreground";
  }
}

export function toProgressBarValue(percentage: string): number {
  const value = Number(percentage);

  if (!Number.isFinite(value)) {
    return 0;
  }

  if (value < 0) {
    return 0;
  }

  if (value > 100) {
    return 100;
  }

  return value;
}
