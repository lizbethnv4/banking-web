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
