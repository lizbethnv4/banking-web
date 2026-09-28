"use client";

import {
  createColumnHelper,
  rowPaginationFeature,
  tableFeatures,
} from "@tanstack/react-table";

import {
  getBatchItemStatusClassName,
  getBatchItemStatusLabel,
} from "@/components/batches/batch-status";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/money";
import type { BatchItem } from "@/types";

export const batchItemsTableFeatures = tableFeatures({
  rowPaginationFeature,
});

const columnHelper = createColumnHelper<
  typeof batchItemsTableFeatures,
  BatchItem
>();

export const batchItemColumns = columnHelper.columns([
  columnHelper.accessor("rowNumber", {
    header: "Fila",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("sourceAccountNumber", {
    header: "Origen",
    cell: (info) => (
      <span className="font-mono text-xs">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("destinationAccountNumber", {
    header: "Destino",
    cell: (info) => (
      <span className="font-mono text-xs">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("amount", {
    header: "Monto",
    cell: (info) => formatMoney(info.getValue(), "DOP"),
  }),
  columnHelper.accessor("status", {
    header: "Estado",
    cell: (info) => {
      const status = info.getValue();

      return (
        <Badge variant="outline" className={getBatchItemStatusClassName(status)}>
          {getBatchItemStatusLabel(status)}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("attemptCount", {
    header: "Intentos",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("errorMessage", {
    header: "Error",
    cell: (info) => {
      const message = info.getValue();
      const code = info.row.original.errorCode;

      if (!message && !code) {
        return "—";
      }

      return (
        <div className="max-w-xs whitespace-normal">
          {message ? <p>{message}</p> : null}
          {code ? (
            <p className="text-xs text-muted-foreground">{code}</p>
          ) : null}
        </div>
      );
    },
  }),
]);
