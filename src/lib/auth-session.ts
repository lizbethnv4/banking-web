import type { AuthUser, JwtPayload, UserRole } from "@/types";
import { USER_ROLES } from "@/types";

const ACCESS_TOKEN_KEY = "banking.accessToken";

type StoreListener = () => void;
type UnauthorizedListener = () => void;

const storeListeners = new Set<StoreListener>();
let memoryToken: string | null | undefined;
let unauthorizedListener: UnauthorizedListener | null = null;

function isUserRole(value: unknown): value is UserRole {
  return USER_ROLES.includes(value as UserRole);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function isJwtPayload(value: unknown): value is JwtPayload {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.sub === "string" &&
    value.sub.length > 0 &&
    typeof value.email === "string" &&
    value.email.length > 0 &&
    isUserRole(value.role) &&
    typeof value.exp === "number" &&
    (value.iat === undefined || typeof value.iat === "number")
  );
}

function readStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

function writeStoredToken(token: string | null): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (token) {
      window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  } catch {
    // Persistencia no disponible; la sesión se mantiene en memoria.
  }
}

function notifyAuthStore(): void {
  storeListeners.forEach((listener) => {
    listener();
  });
}

export function subscribeAuthStore(listener: StoreListener): () => void {
  storeListeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key === ACCESS_TOKEN_KEY || event.key === null) {
      memoryToken = undefined;
      listener();
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }

  return () => {
    storeListeners.delete(listener);

    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

export function getAccessToken(): string | null {
  if (memoryToken !== undefined) {
    return memoryToken;
  }

  return readStoredToken();
}

export function getAccessTokenSnapshot(): string | null {
  const token = getAccessToken();

  if (!token) {
    return null;
  }

  if (!getSessionUserFromToken(token)) {
    memoryToken = null;
    writeStoredToken(null);
    return null;
  }

  return token;
}

export function getAccessTokenServerSnapshot(): string | null {
  return null;
}

export function setAccessToken(token: string): void {
  memoryToken = token;
  writeStoredToken(token);
  notifyAuthStore();
}

export function clearAccessToken(): void {
  memoryToken = null;
  writeStoredToken(null);
  notifyAuthStore();
}

export function decodeAccessToken(token: string): JwtPayload | null {
  const parts = token.split(".");

  if (parts.length !== 3 || !parts[1]) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(parts[1])) as unknown;
    return isJwtPayload(payload) ? payload : null;
  } catch {
    return null;
  }
}

export function isAccessTokenExpired(payload: JwtPayload): boolean {
  return payload.exp * 1000 <= Date.now();
}

export function getSessionUserFromToken(token: string): AuthUser | null {
  const payload = decodeAccessToken(token);

  if (!payload || isAccessTokenExpired(payload)) {
    return null;
  }

  return {
    id: payload.sub,
    email: payload.email,
    role: payload.role,
  };
}

export function subscribeUnauthorized(listener: UnauthorizedListener): () => void {
  unauthorizedListener = listener;

  return () => {
    if (unauthorizedListener === listener) {
      unauthorizedListener = null;
    }
  };
}

export function notifyUnauthorized(): void {
  unauthorizedListener?.();
}
