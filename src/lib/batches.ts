import { request } from "@/lib/api";
import { createOptionsStore } from "@/lib/options-store";
import type {
  BatchItemsResponse,
  BatchProcess,
  BatchProcessOption,
  CreateBatchResponse,
  GetBatchItemsQuery,
} from "@/types";

const batchOptionsStore = createOptionsStore(() =>
  request<BatchProcessOption[]>("/batch-transfers/options"),
);

export function subscribeBatchOptions(listener: () => void) {
  return batchOptionsStore.subscribe(listener);
}

export function getBatchOptionsSnapshot() {
  return batchOptionsStore.getSnapshot();
}

export function invalidateBatchOptions() {
  batchOptionsStore.invalidate();
}

export function getBatchOptions() {
  return batchOptionsStore.load();
}

export const BATCH_CSV_HEADER =
  "sourceAccountNumber,destinationAccountNumber,amount";
export const BATCH_MAX_ITEMS = 10_000;
export const BATCH_MULTIPART_FIELD = "file";

export async function createBatch(file: File) {
  const formData = new FormData();
  formData.append(BATCH_MULTIPART_FIELD, file);

  const created = await request<CreateBatchResponse>("/batch-transfers", {
    method: "POST",
    body: formData,
  });

  invalidateBatchOptions();
  return created;
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
