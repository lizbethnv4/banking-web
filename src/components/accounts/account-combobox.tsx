"use client";

import { useMemo } from "react";

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
import { useAccountOptions } from "@/hooks/use-account-options";
import type { AccountOption } from "@/types";

export function formatAccountOptionLabel(account: AccountOption) {
  return `${account.accountNumber} - ${account.holderName}`;
}

function matchesAccountQuery(account: AccountOption, query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  return (
    account.accountNumber.toLowerCase().includes(normalized) ||
    account.holderName.toLowerCase().includes(normalized)
  );
}

type AccountComboboxProps = {
  id?: string;
  name?: string;
  value: string;
  onValueChange: (accountId: string) => void;
  excludeAccountId?: string;
  disabled?: boolean;
  placeholder?: string;
  invalid?: boolean;
};

export function AccountCombobox({
  id,
  name,
  value,
  onValueChange,
  excludeAccountId,
  disabled = false,
  placeholder = "Seleccionar cuenta",
  invalid = false,
}: AccountComboboxProps) {
  const { accounts, isLoading, error } = useAccountOptions();

  const visibleAccounts = useMemo(
    () =>
      excludeAccountId
        ? accounts.filter((account) => account.id !== excludeAccountId)
        : accounts,
    [accounts, excludeAccountId],
  );

  const selectedAccount =
    visibleAccounts.find((account) => account.id === value) ??
    accounts.find((account) => account.id === value) ??
    null;

  const emptyMessage = isLoading
    ? "Cargando cuentas..."
    : error
      ? error
      : "No se encontraron cuentas.";

  return (
    <Combobox
      items={visibleAccounts}
      value={selectedAccount}
      onValueChange={(account) => onValueChange(account?.id ?? "")}
      itemToStringLabel={formatAccountOptionLabel}
      itemToStringValue={(account) => account.id}
      isItemEqualToValue={(left, right) => left.id === right.id}
      filter={matchesAccountQuery}
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
            {(account: AccountOption | null) =>
              account
                ? formatAccountOptionLabel(account)
                : isLoading
                  ? "Cargando cuentas..."
                  : placeholder
            }
          </ComboboxValue>
        </span>
      </ComboboxTrigger>
      <ComboboxContent>
        <div className="p-1 pb-0">
          <ComboboxInput placeholder="Buscar por número o titular" />
        </div>
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        <ComboboxList>
          {(account: AccountOption) => (
            <ComboboxItem
              key={account.id}
              value={account}
              disabled={account.id === excludeAccountId}
            >
              {formatAccountOptionLabel(account)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
