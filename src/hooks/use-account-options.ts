"use client";

import { useSyncExternalStore } from "react";

import {
  getAccountOptionsSnapshot,
  subscribeAccountOptions,
} from "@/lib/accounts";

export function useAccountOptions() {
  const snapshot = useSyncExternalStore(
    subscribeAccountOptions,
    getAccountOptionsSnapshot,
    getAccountOptionsSnapshot,
  );

  return {
    accounts: snapshot.items,
    isLoading: snapshot.isLoading,
    error: snapshot.error,
  };
}
