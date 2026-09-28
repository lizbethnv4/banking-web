import {
  clearAccessToken,
  getAccessToken,
  notifyUnauthorized,
} from "@/lib/auth-session";
import type { ApiErrorBody } from "@/types";

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor({
    status,
    message,
    code,
    details,
  }: {
    status: number;
    message: string;
    code?: string;
    details?: unknown;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isForbiddenError(error: unknown): boolean {
  return isApiError(error) && (error.status === 403 || error.code === "FORBIDDEN");
}

export function getUserErrorMessage(error: unknown): string {
  if (isApiError(error) && error.message.trim().length > 0) {
    return error.message;
  }

  return "No se pudo conectar con el servidor. Intente de nuevo.";
}

function getApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("Falta la variable de entorno NEXT_PUBLIC_API_URL.");
  }

  return baseUrl.replace(/\/$/, "");
}

function buildUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}

function normalizePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

function isPublicApiPath(path: string): boolean {
  const normalizedPath = normalizePath(path);
  return normalizedPath === "/auth/login" || normalizedPath === "/auth/register";
}

function applyAuthHeader(path: string, headers: Headers): void {
  if (isPublicApiPath(path) || headers.has("Authorization")) {
    return;
  }

  const accessToken = getAccessToken();

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
}

function readApiErrorBody(value: unknown): ApiErrorBody | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const body = value as Record<string, unknown>;

  return {
    code: typeof body.code === "string" ? body.code : undefined,
    message: typeof body.message === "string" ? body.message : undefined,
    details: "details" in body ? body.details : undefined,
  };
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const raw = await response.text();

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return raw;
  }
}

async function toApiError(response: Response): Promise<ApiError> {
  const payload = await parseResponseBody(response);
  const errorBody = readApiErrorBody(payload);
  const fallbackMessage =
    typeof payload === "string" && payload.trim().length > 0
      ? payload
      : response.statusText || `Error HTTP ${response.status}`;

  return new ApiError({
    status: response.status,
    code: errorBody?.code,
    message: errorBody?.message ?? fallbackMessage,
    details: errorBody?.details,
  });
}

async function throwIfNotOk(path: string, response: Response): Promise<void> {
  if (response.ok) {
    return;
  }

  const error = await toApiError(response);

  if (error.status === 401 && !isPublicApiPath(path)) {
    clearAccessToken();
    notifyUnauthorized();
  }

  throw error;
}

export async function requestBlob(
  path: string,
  options: RequestInit = {},
): Promise<{
  blob: Blob;
  contentType: string;
  contentDisposition: string | null;
}> {
  const headers = new Headers(options.headers);
  applyAuthHeader(path, headers);

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
  });

  await throwIfNotOk(path, response);

  const blob = await response.blob();

  return {
    blob,
    contentType: response.headers.get("Content-Type") ?? blob.type,
    contentDisposition: response.headers.get("Content-Disposition"),
  };
}

export async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  applyAuthHeader(path, headers);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (
    options.body !== undefined &&
    !headers.has("Content-Type") &&
    !(typeof FormData !== "undefined" && options.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
  });

  await throwIfNotOk(path, response);

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await parseResponseBody(response);

  if (typeof payload === "string") {
    throw new ApiError({
      status: response.status,
      message: "La respuesta del servidor no es JSON válido.",
      details: payload,
    });
  }

  return payload as T;
}
