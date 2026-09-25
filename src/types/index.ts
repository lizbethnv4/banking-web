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
