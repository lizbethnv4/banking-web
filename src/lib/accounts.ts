import { request } from "@/lib/api";
import type { Account, CreateAccountRequest } from "@/types";

export function createAccount(payload: CreateAccountRequest) {
  return request<Account>("/accounts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getAccountByIdOrNumber(idOrNumber: string) {
  return request<Account>(`/accounts/${encodeURIComponent(idOrNumber)}`);
}
