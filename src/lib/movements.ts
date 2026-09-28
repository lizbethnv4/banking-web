import { request } from "@/lib/api";
import type {
  AccountMovementsResponse,
  GetAccountMovementsQuery,
} from "@/types";

export function getAccountMovements(
  idOrNumber: string,
  query: GetAccountMovementsQuery,
) {
  const params = new URLSearchParams();
  params.set("page", String(query.page));
  params.set("pageSize", String(query.pageSize));

  if (query.from) {
    params.set("from", query.from);
  }

  if (query.to) {
    params.set("to", query.to);
  }

  if (query.type) {
    params.set("type", query.type);
  }

  if (query.minAmount) {
    params.set("minAmount", query.minAmount);
  }

  if (query.maxAmount) {
    params.set("maxAmount", query.maxAmount);
  }

  return request<AccountMovementsResponse>(
    `/accounts/${encodeURIComponent(idOrNumber)}/movements?${params.toString()}`,
  );
}
