import { request } from "@/lib/api";
import { createOptionsStore } from "@/lib/options-store";
import type { Account, AccountOption, CreateAccountRequest } from "@/types";

const accountOptionsStore = createOptionsStore(() =>
  request<AccountOption[]>("/accounts/options"),
);

export function subscribeAccountOptions(listener: () => void) {
  return accountOptionsStore.subscribe(listener);
}

export function getAccountOptionsSnapshot() {
  return accountOptionsStore.getSnapshot();
}

export function invalidateAccountOptions() {
  accountOptionsStore.invalidate();
}

export function getAccountOptions() {
  return accountOptionsStore.load();
}

export async function createAccount(payload: CreateAccountRequest) {
  const account = await request<Account>("/accounts", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  invalidateAccountOptions();
  return account;
}

export function getAccountByIdOrNumber(idOrNumber: string) {
  return request<Account>(`/accounts/${encodeURIComponent(idOrNumber)}`);
}
