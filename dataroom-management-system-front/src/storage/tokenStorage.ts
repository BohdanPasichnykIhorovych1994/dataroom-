import {
  AUTH_REMEMBER_STORAGE_KEY,
  AUTH_TOKEN_STORAGE_KEY,
  REMEMBER_FLAG,
} from "@/constants";

export function getStoredToken(): string | null {
  return (
    localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ??
    sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
  );
}

export function setStoredToken(token: string, rememberMe: boolean): void {
  clearStoredToken();
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  localStorage.setItem(
    AUTH_REMEMBER_STORAGE_KEY,
    rememberMe ? REMEMBER_FLAG.ON : REMEMBER_FLAG.OFF,
  );
}

export function clearStoredToken(): void {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

export function wasRemembered(): boolean {
  return localStorage.getItem(AUTH_REMEMBER_STORAGE_KEY) === REMEMBER_FLAG.ON;
}
