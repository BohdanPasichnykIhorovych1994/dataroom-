import {
  API_BASE_URL,
  APP_ROUTE,
  AUTH_HEADER_SCHEME,
  AUTH_PATH,
  HTTP_HEADER,
  HTTP_STATUS,
  JSON_MIME,
} from "@/constants";
import { clearStoredToken, getStoredToken } from "@/storage/tokenStorage";

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type UnauthorizedHandler = () => void;

let onUnauthorized: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  onUnauthorized = handler;
}

function resolveUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

async function readErrorMessage(res: Response): Promise<string> {
  try {
    const data: unknown = await res.json();
    if (data && typeof data === "object" && "message" in data) {
      const message = (data as { message: unknown }).message;
      if (typeof message === "string" && message.trim()) return message;
      if (Array.isArray(message)) return message.map(String).join(", ");
    }
  } catch {
    /* ignore non-JSON bodies */
  }
  return res.statusText || `Request failed (${res.status})`;
}

function withAuthHeaders(init?: RequestInit): Headers {
  const headers = new Headers(init?.headers);
  if (
    init?.body != null &&
    !(init.body instanceof FormData) &&
    !headers.has(HTTP_HEADER.CONTENT_TYPE)
  ) {
    headers.set(HTTP_HEADER.CONTENT_TYPE, JSON_MIME);
  }
  const token = getStoredToken();
  if (token && !headers.has(HTTP_HEADER.AUTHORIZATION)) {
    headers.set(
      HTTP_HEADER.AUTHORIZATION,
      `${AUTH_HEADER_SCHEME.BEARER} ${token}`,
    );
  }
  return headers;
}

function handleUnauthorized(status: number) {
  if (status === HTTP_STATUS.UNAUTHORIZED) {
    clearStoredToken();
    onUnauthorized?.();
    const path = window.location.pathname;
    if (path !== AUTH_PATH.LOGIN && path !== AUTH_PATH.SIGN_UP) {
      window.location.assign(APP_ROUTE.LOGIN);
    }
  }
}

export async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = withAuthHeaders(init);
  const res = await fetch(resolveUrl(path), { ...init, headers });
  if (!res.ok) {
    handleUnauthorized(res.status);
    throw new ApiError(await readErrorMessage(res), res.status);
  }
  if (res.status === HTTP_STATUS.NO_CONTENT) {
    return undefined as T;
  }
  return (await res.json()) as T;
}

export async function apiBlob(path: string, init?: RequestInit): Promise<Blob> {
  const headers = withAuthHeaders(init);
  const res = await fetch(resolveUrl(path), { ...init, headers });
  if (!res.ok) {
    handleUnauthorized(res.status);
    throw new ApiError(await readErrorMessage(res), res.status);
  }
  return res.blob();
}
