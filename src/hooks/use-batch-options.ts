"use client";

import { useSyncExternalStore } from "react";

import {
  getBatchOptionsSnapshot,
  subscribeBatchOptions,
} from "@/lib/batches";

export function useBatchOptions() {
  const snapshot = useSyncExternalStore(
    subscribeBatchOptions,
    getBatchOptionsSnapshot,
    getBatchOptionsSnapshot,
  );

  return {
    batches: snapshot.items,
    isLoading: snapshot.isLoading,
    error: snapshot.error,
  };
}
