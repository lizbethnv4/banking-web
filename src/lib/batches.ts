import { request } from "@/lib/api";
import type {
  BatchItemsResponse,
  BatchProcess,
  CreateBatchResponse,
  GetBatchItemsQuery,
} from "@/types";

export const BATCH_CSV_HEADER =
  "sourceAccountNumber,destinationAccountNumber,amount";
export const BATCH_MAX_ITEMS = 10_000;
export const BATCH_MULTIPART_FIELD = "file";

export function createBatch(file: File) {
  const formData = new FormData();
  formData.append(BATCH_MULTIPART_FIELD, file);

  return request<CreateBatchResponse>("/batch-transfers", {
    method: "POST",
    body: formData,
  });
}

export function getBatch(id: string) {
  return request<BatchProcess>(`/batch-transfers/${encodeURIComponent(id)}`);
}

export function getBatchItems(id: string, query: GetBatchItemsQuery) {
  const params = new URLSearchParams();
  params.set("page", String(query.page));
  params.set("pageSize", String(query.pageSize));

  if (query.status) {
    params.set("status", query.status);
  }

  return request<BatchItemsResponse>(
    `/batch-transfers/${encodeURIComponent(id)}/items?${params.toString()}`,
  );
}

export function toBatchProcess(created: CreateBatchResponse): BatchProcess {
  return {
    ...created,
    startedAt: null,
    completedAt: null,
    failureMessage: null,
  };
}
