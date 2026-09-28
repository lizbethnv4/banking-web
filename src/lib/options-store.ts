import { getUserErrorMessage } from "@/lib/api";

type OptionsListener = () => void;

export type OptionsSnapshot<T> = {
  items: T[];
  isLoading: boolean;
  error: string | null;
};

export function createOptionsStore<T>(loader: () => Promise<T[]>) {
  let request: Promise<T[]> | null = null;
  let snapshot: OptionsSnapshot<T> = {
    items: [],
    isLoading: true,
    error: null,
  };
  const listeners = new Set<OptionsListener>();

  function emit() {
    for (const listener of listeners) {
      listener();
    }
  }

  function load() {
    if (!request) {
      request = loader()
        .then((items) => {
          snapshot = {
            items,
            isLoading: false,
            error: null,
          };
          emit();
          return items;
        })
        .catch((error: unknown) => {
          request = null;
          snapshot = {
            items: [],
            isLoading: false,
            error: getUserErrorMessage(error),
          };
          emit();
          throw error;
        });
    }

    return request;
  }

  function subscribe(listener: OptionsListener) {
    listeners.add(listener);
    void load();

    return () => {
      listeners.delete(listener);
    };
  }

  function getSnapshot() {
    return snapshot;
  }

  function invalidate() {
    request = null;
    snapshot = {
      items: [],
      isLoading: true,
      error: null,
    };
    emit();

    if (listeners.size > 0) {
      void load();
    }
  }

  return {
    load,
    subscribe,
    getSnapshot,
    invalidate,
  };
}
