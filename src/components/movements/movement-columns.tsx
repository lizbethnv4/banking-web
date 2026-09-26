"use client";

import {
  createColumnHelper,
  rowPaginationFeature,
  tableFeatures,
} from "@tanstack/react-table";

import {
  getMovementTypeClassName,
  getMovementTypeLabel,
} from "@/components/movements/movement-type";
import { Badge } from "@/components/ui/badge";
import { CopyableId } from "@/components/ui/copyable-id";
import { formatMoney } from "@/lib/money";
import type { AccountMovement } from "@/types";

export const movementsTableFeatures = tableFeatures({
  rowPaginationFeature,
});

const columnHelper = createColumnHelper<
  typeof movementsTableFeatures,
  AccountMovement
>();

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("es-DO");
}

export const movementColumns = columnHelper.columns([
  columnHelper.accessor("createdAt", {
    header: "Fecha",
    cell: (info) => formatDateTime(info.getValue()),
  }),
  columnHelper.accessor("type", {
    header: "Tipo",
    cell: (info) => {
      const type = info.getValue();

      return (
        <span className="inline-flex items-center gap-2">
          <Badge variant="outline" className={getMovementTypeClassName(type)}>
            {getMovementTypeLabel(type)}
          </Badge>
        </span>
      );
    },
  }),
  columnHelper.accessor("amount", {
    header: "Monto",
    cell: (info) => formatMoney(info.getValue(), "DOP"),
  }),
  columnHelper.accessor("balanceBefore", {
    header: "Saldo anterior",
    cell: (info) => formatMoney(info.getValue(), "DOP"),
  }),
  columnHelper.accessor("balanceAfter", {
    header: "Saldo posterior",
    cell: (info) => formatMoney(info.getValue(), "DOP"),
  }),
  columnHelper.accessor("description", {
    header: "Descripción",
    cell: (info) => info.getValue() ?? "—",
  }),
  columnHelper.accessor("transferId", {
    header: "Transferencia",
    cell: (info) => (
      <CopyableId
        className="text-xs"
        value={info.getValue()}
        label="ID de la transferencia"
      />
    ),
  }),
]);
