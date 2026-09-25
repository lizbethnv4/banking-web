"use client";

import {
  useTable,
  type PaginationState,
  type Updater,
} from "@tanstack/react-table";

import {
  batchItemColumns,
  batchItemsTableFeatures,
} from "@/components/batches/batch-item-columns";
import { BATCH_ITEM_STATUS_LABELS } from "@/components/batches/batch-status";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BATCH_ITEM_STATUSES, type BatchItem, type BatchItemStatus } from "@/types";

const EMPTY_DATA: BatchItem[] = [];
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

const PAGE_SIZE_ITEMS = PAGE_SIZE_OPTIONS.map((size) => ({
  label: String(size),
  value: String(size),
}));

const STATUS_ITEMS = [
  { label: "Todos", value: null },
  ...BATCH_ITEM_STATUSES.map((status) => ({
    label: BATCH_ITEM_STATUS_LABELS[status],
    value: status,
  })),
];

type BatchItemsDataTableProps = {
  data: BatchItem[];
  page: number;
  pageSize: number;
  pageCount: number;
  rowCount: number;
  status: BatchItemStatus | "";
  isLoading: boolean;
  onStatusChange: (status: BatchItemStatus | "") => void;
  onPaginationChange: (pagination: PaginationState) => void;
};

export function BatchItemsDataTable({
  data,
  page,
  pageSize,
  pageCount,
  rowCount,
  status,
  isLoading,
  onStatusChange,
  onPaginationChange,
}: BatchItemsDataTableProps) {
  const table = useTable({
    features: batchItemsTableFeatures,
    columns: batchItemColumns,
    data: data.length > 0 ? data : EMPTY_DATA,
    manualPagination: true,
    pageCount,
    rowCount,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
    },
    onPaginationChange: (updater: Updater<PaginationState>) => {
      const current = { pageIndex: page - 1, pageSize };
      const next = typeof updater === "function" ? updater(current) : updater;
      onPaginationChange(next);
    },
    getRowId: (row) => String(row.rowNumber),
  });

  const columnCount = table.getAllColumns().length;

  return (
    <div className="space-y-4">
      <div className="max-w-xs space-y-2">
        <Select
          items={STATUS_ITEMS}
          value={status || null}
          onValueChange={(value) =>
            onStatusChange((value as BatchItemStatus | null) ?? "")
          }
          disabled={isLoading}
        >
          <SelectTrigger className="w-full" aria-label="Estado de la operación">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {STATUS_ITEMS.map((item) => (
                <SelectItem key={String(item.value)} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : (
                    <table.FlexRender header={header} />
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: Math.min(pageSize, 10) }).map((_, index) => (
              <TableRow key={`loading-${String(index)}`}>
                <TableCell colSpan={columnCount}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              </TableRow>
            ))
          ) : table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columnCount}
                className="h-24 text-center text-muted-foreground"
              >
                No se encontraron operaciones para el filtro seleccionado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {isLoading
            ? "Cargando..."
            : rowCount > 0
              ? `${String(rowCount)} ${rowCount === 1 ? "operación" : "operaciones"}`
              : "Sin resultados"}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            items={PAGE_SIZE_ITEMS}
            value={String(pageSize)}
            onValueChange={(value) => {
              if (!value) {
                return;
              }
              onPaginationChange({ pageIndex: 0, pageSize: Number(value) });
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="w-24" aria-label="Tamaño de página">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {PAGE_SIZE_ITEMS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Página {String(page)} de {String(Math.max(pageCount, 1))}
          </p>
          <Button
            type="button"
            variant="outline"
            disabled={isLoading || !table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            Anterior
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isLoading || !table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
