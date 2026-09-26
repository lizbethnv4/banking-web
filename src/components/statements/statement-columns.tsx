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
import { formatMoney } from "@/lib/money";
import type { AccountMovement } from "@/types";

export const statementTableFeatures = tableFeatures({
  rowPaginationFeature,
});

const columnHelper = createColumnHelper<
  typeof statementTableFeatures,
  AccountMovement
>();

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("es-DO");
}

export function createStatementColumns(currency: string) {
  return columnHelper.columns([
    columnHelper.accessor("createdAt", {
      header: "Fecha",
      cell: (info) => formatDateTime(info.getValue()),
    }),
    columnHelper.accessor("type", {
      header: "Tipo",
      cell: (info) => {
        const type = info.getValue();

        return (
          <Badge variant="outline" className={getMovementTypeClassName(type)}>
            {getMovementTypeLabel(type)}
          </Badge>
        );
      },
    }),
    columnHelper.accessor("description", {
      header: "Descripción",
      cell: (info) => info.getValue() ?? "—",
    }),
    columnHelper.accessor("amount", {
      header: "Monto",
      cell: (info) => formatMoney(info.getValue(), currency),
    }),
    columnHelper.accessor("balanceBefore", {
      header: "Saldo anterior",
      cell: (info) => formatMoney(info.getValue(), currency),
    }),
    columnHelper.accessor("balanceAfter", {
      header: "Saldo posterior",
      cell: (info) => formatMoney(info.getValue(), currency),
    }),
  ]);
}
