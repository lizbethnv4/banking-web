"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOVEMENT_TYPES, type MovementType } from "@/types";
import { getMovementTypeLabel } from "@/components/movements/movement-type";

export type MovementFiltersValue = {
  account: string;
  from: string;
  to: string;
  type: MovementType | "";
  minAmount: string;
  maxAmount: string;
};

const TYPE_ITEMS = [
  { label: "Todos", value: null },
  ...MOVEMENT_TYPES.map((type) => ({
    label: getMovementTypeLabel(type),
    value: type,
  })),
];

type MovementsFiltersProps = {
  values: MovementFiltersValue;
  isLoading: boolean;
  onChange: (values: MovementFiltersValue) => void;
  onSearch: () => void;
  onClear: () => void;
};

export function MovementsFilters({
  values,
  isLoading,
  onChange,
  onSearch,
  onClear,
}: MovementsFiltersProps) {
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch();
      }}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="space-y-2 md:col-span-2 xl:col-span-1">
          <Label htmlFor="movement-account">ID o número de cuenta</Label>
          <Input
            id="movement-account"
            value={values.account}
            placeholder="UUID o número de cuenta"
            autoComplete="off"
            disabled={isLoading}
            onChange={(event) =>
              onChange({ ...values, account: event.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="movement-from">Desde</Label>
          <Input
            id="movement-from"
            type="date"
            value={values.from}
            disabled={isLoading}
            onChange={(event) =>
              onChange({ ...values, from: event.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="movement-to">Hasta</Label>
          <Input
            id="movement-to"
            type="date"
            value={values.to}
            disabled={isLoading}
            onChange={(event) => onChange({ ...values, to: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="movement-type">Tipo</Label>
          <Select
            items={TYPE_ITEMS}
            value={values.type || null}
            onValueChange={(value) =>
              onChange({
                ...values,
                type: (value as MovementType | null) ?? "",
              })
            }
            disabled={isLoading}
          >
            <SelectTrigger id="movement-type" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {TYPE_ITEMS.map((item) => (
                  <SelectItem key={String(item.value)} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="movement-min-amount">Monto mínimo</Label>
          <Input
            id="movement-min-amount"
            inputMode="decimal"
            value={values.minAmount}
            placeholder="Ej. 100.00"
            autoComplete="off"
            disabled={isLoading}
            onChange={(event) =>
              onChange({ ...values, minAmount: event.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="movement-max-amount">Monto máximo</Label>
          <Input
            id="movement-max-amount"
            inputMode="decimal"
            value={values.maxAmount}
            placeholder="Ej. 5000.00"
            autoComplete="off"
            disabled={isLoading}
            onChange={(event) =>
              onChange({ ...values, maxAmount: event.target.value })
            }
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Buscando..." : "Buscar"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={onClear}
        >
          Limpiar filtros
        </Button>
      </div>
    </form>
  );
}
