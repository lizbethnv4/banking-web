import { request } from "@/lib/api";
import type { CreateTransferRequest, Transfer } from "@/types";

export function createTransfer(payload: CreateTransferRequest) {
  return request<Transfer>("/transfer", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
