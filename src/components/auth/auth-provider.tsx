"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  clearAccessToken,
  getAccessTokenServerSnapshot,
  getAccessTokenSnapshot,
  getSessionUserFromToken,
  setAccessToken,
  subscribeAuthStore,
  subscribeUnauthorized,
} from "@/lib/auth-session";
import type { AuthUser } from "@/types";

type AuthContextValue = {
  accessToken: string | null;
  user: AuthUser | null;
  isReady: boolean;
  isAuthenticated: boolean;
  setSession: (accessToken: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const PUBLIC_PATHS = new Set(["/login", "/register"]);

function subscribeHydration() {
  return () => {};
}

function getHydrationSnapshot() {
  return true;
}

function getHydrationServerSnapshot() {
  return false;
}

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isReady = useSyncExternalStore(
    subscribeHydration,
    getHydrationSnapshot,
    getHydrationServerSnapshot,
  );
  const accessToken = useSyncExternalStore(
    subscribeAuthStore,
    getAccessTokenSnapshot,
    getAccessTokenServerSnapshot,
  );
  const user = accessToken ? getSessionUserFromToken(accessToken) : null;

  const logout = useCallback(() => {
    clearAccessToken();

    if (!PUBLIC_PATHS.has(pathname)) {
      router.replace("/login");
    }
  }, [pathname, router]);

  const setSession = useCallback((token: string) => {
    const nextUser = getSessionUserFromToken(token);

    if (!nextUser) {
      clearAccessToken();
      throw new Error("INVALID_ACCESS_TOKEN");
    }

    setAccessToken(token);
  }, []);

  useEffect(() => {
    return subscribeUnauthorized(() => {
      logout();
    });
  }, [logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      user,
      isReady,
      isAuthenticated: isReady && Boolean(accessToken && user),
      setSession,
      logout,
    }),
    [accessToken, isReady, logout, setSession, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider.");
  }

  return context;
}
