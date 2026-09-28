"use client";

import { AccountCombobox } from "@/components/accounts/account-combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  STATEMENT_MONTHS,
  type StatementMonth,
} from "@/components/statements/statement-month";

export type StatementFormValue = {
  account: string;
  year: string;
  month: StatementMonth;
};

const MONTH_ITEMS = STATEMENT_MONTHS.map((month) => ({
  label: month.label,
  value: month.value,
}));

type StatementFormProps = {
  values: StatementFormValue;
  isLoading: boolean;
  onChange: (values: StatementFormValue) => void;
  onSubmit: () => void;
};

export function StatementForm({
  values,
  isLoading,
  onChange,
  onSubmit,
}: StatementFormProps) {
  return (
    <form
      className="space-y-4"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="space-y-2 md:col-span-2 xl:col-span-1">
          <Label htmlFor="statement-account">Cuenta</Label>
          <AccountCombobox
            id="statement-account"
            value={values.account}
            placeholder="Seleccionar cuenta"
            disabled={isLoading}
            onValueChange={(accountId) =>
              onChange({ ...values, account: accountId })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="statement-year">Año</Label>
          <Input
            id="statement-year"
            type="number"
            inputMode="numeric"
            min={2000}
            max={2100}
            step={1}
            value={values.year}
            placeholder="2026"
            autoComplete="off"
            disabled={isLoading}
            onChange={(event) =>
              onChange({ ...values, year: event.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="statement-month">Mes</Label>
          <Select
            items={MONTH_ITEMS}
            value={values.month}
            onValueChange={(value) => {
              if (value == null) {
                return;
              }

              onChange({ ...values, month: value as StatementMonth });
            }}
            disabled={isLoading}
          >
            <SelectTrigger id="statement-month" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {STATEMENT_MONTHS.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Consultando..." : "Consultar"}
      </Button>
    </form>
  );
}
