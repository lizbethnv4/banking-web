export type ApiErrorBody = {
  code?: string;
  message?: string;
  details?: unknown;
};

export const ACCOUNT_STATUSES = ["ACTIVE", "BLOCKED", "CLOSED"] as const;

export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

export type Account = {
  id: string;
  accountNumber: string;
  holderName: string;
  balance: string;
  currency: string;
  status: AccountStatus;
};

export type CreateAccountRequest = {
  holderName: string;
};

export const TRANSFER_STATUSES = ["PENDING", "COMPLETED", "FAILED"] as const;

export type TransferStatus = (typeof TRANSFER_STATUSES)[number];

export type CreateTransferRequest = {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: string;
  idempotencyKey: string;
};

export type Transfer = {
  id: string;
  reference: string;
  sourceAccountId: string;
  destinationAccountId: string;
  amount: string;
  status: TransferStatus;
  idempotencyKey: string;
  failureCode: string | null;
  failureMessage: string | null;
  createdAt: string;
  completedAt: string | null;
};

export const MOVEMENT_TYPES = ["DEBIT", "CREDIT"] as const;

export type MovementType = (typeof MOVEMENT_TYPES)[number];

export type AccountMovement = {
  id: string;
  transferId: string;
  type: MovementType;
  amount: string;
  balanceBefore: string;
  balanceAfter: string;
  description: string | null;
  createdAt: string;
};

export type MovementsPagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type AccountMovementsResponse = {
  data: AccountMovement[];
  pagination: MovementsPagination;
};

export type GetAccountMovementsQuery = {
  page: number;
  pageSize: number;
  from?: string;
  to?: string;
  type?: MovementType;
  minAmount?: string;
  maxAmount?: string;
};

export type AccountStatementAccount = {
  id: string;
  accountNumber: string;
  holderName: string;
  currency: string;
  status: AccountStatus;
};

export type AccountStatementPeriod = {
  year: number;
  month: number;
  from: string;
  to: string;
};

export type AccountStatementSummary = {
  totalCredits: string;
  totalDebits: string;
};

export type AccountStatement = {
  account: AccountStatementAccount;
  period: AccountStatementPeriod;
  summary: AccountStatementSummary;
  movements: AccountMovementsResponse;
};

export type GetAccountStatementQuery = {
  year: number;
  month: number;
  page: number;
  pageSize: number;
};

export const BATCH_STATUSES = [
  "PENDING",
  "VALIDATING",
  "PROCESSING",
  "COMPLETED",
  "COMPLETED_WITH_ERRORS",
  "FAILED",
] as const;

export type BatchStatus = (typeof BATCH_STATUSES)[number];

export const TERMINAL_BATCH_STATUSES = [
  "COMPLETED",
  "COMPLETED_WITH_ERRORS",
  "FAILED",
] as const;

export type TerminalBatchStatus = (typeof TERMINAL_BATCH_STATUSES)[number];

export const BATCH_ITEM_STATUSES = [
  "PENDING",
  "PROCESSING",
  "SUCCEEDED",
  "FAILED",
  "RETRYING",
] as const;

export type BatchItemStatus = (typeof BATCH_ITEM_STATUSES)[number];

export type BatchProcess = {
  id: string;
  originalFileName: string;
  status: BatchStatus;
  totalItems: number;
  processedItems: number;
  successfulItems: number;
  failedItems: number;
  progressPercentage: string;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  failureMessage: string | null;
};

export type CreateBatchResponse = {
  id: string;
  originalFileName: string;
  status: BatchStatus;
  totalItems: number;
  processedItems: number;
  successfulItems: number;
  failedItems: number;
  progressPercentage: string;
  createdAt: string;
};

export type BatchItem = {
  rowNumber: number;
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  amount: string;
  status: BatchItemStatus;
  attemptCount: number;
  transferId: string | null;
  errorCode: string | null;
  errorMessage: string | null;
  processedAt: string | null;
};

export type BatchItemsPagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type BatchItemsResponse = {
  data: BatchItem[];
  pagination: BatchItemsPagination;
};

export type GetBatchItemsQuery = {
  page: number;
  pageSize: number;
  status?: BatchItemStatus;
};
