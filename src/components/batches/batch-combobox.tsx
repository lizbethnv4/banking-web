"use client";

import { getBatchStatusLabel } from "@/components/batches/batch-status";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox";
import { useBatchOptions } from "@/hooks/use-batch-options";
import type { BatchProcessOption } from "@/types";

export function formatBatchOptionLabel(batch: BatchProcessOption) {
  return `${batch.originalFileName} - ${getBatchStatusLabel(batch.status)}`;
}

function matchesBatchQuery(batch: BatchProcessOption, query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  return (
    batch.originalFileName.toLowerCase().includes(normalized) ||
    batch.status.toLowerCase().includes(normalized) ||
    getBatchStatusLabel(batch.status).toLowerCase().includes(normalized)
  );
}

type BatchComboboxProps = {
  id?: string;
  name?: string;
  value: string;
  onValueChange: (batchId: string) => void;
  disabled?: boolean;
  placeholder?: string;
  invalid?: boolean;
};

export function BatchCombobox({
  id,
  name,
  value,
  onValueChange,
  disabled = false,
  placeholder = "Seleccionar lote",
  invalid = false,
}: BatchComboboxProps) {
  const { batches, isLoading, error } = useBatchOptions();

  const selectedBatch =
    batches.find((batch) => batch.id === value) ?? null;

  const emptyMessage = isLoading
    ? "Cargando lotes..."
    : error
      ? error
      : "No se encontraron lotes.";

  return (
    <Combobox
      items={batches}
      value={selectedBatch}
      onValueChange={(batch) => onValueChange(batch?.id ?? "")}
      itemToStringLabel={formatBatchOptionLabel}
      itemToStringValue={(batch) => batch.id}
      isItemEqualToValue={(left, right) => left.id === right.id}
      filter={matchesBatchQuery}
      disabled={disabled || isLoading}
      autoHighlight
      name={name}
    >
      <ComboboxTrigger
        id={id}
        aria-invalid={invalid || undefined}
        aria-busy={isLoading || undefined}
      >
        <span className="min-w-0 flex-1 truncate text-left">
          <ComboboxValue>
            {(batch: BatchProcessOption | null) =>
              batch
                ? formatBatchOptionLabel(batch)
                : isLoading
                  ? "Cargando lotes..."
                  : placeholder
            }
          </ComboboxValue>
        </span>
      </ComboboxTrigger>
      <ComboboxContent>
        <div className="p-1 pb-0">
          <ComboboxInput placeholder="Buscar por archivo o estado" />
        </div>
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        <ComboboxList>
          {(batch: BatchProcessOption) => (
            <ComboboxItem key={batch.id} value={batch}>
              {formatBatchOptionLabel(batch)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
