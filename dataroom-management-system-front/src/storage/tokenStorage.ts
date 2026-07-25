const TOKEN_KEY = 'dataroom_token'
const REMEMBER_KEY = 'dataroom_remember'

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token: string, rememberMe: boolean): void {
  clearStoredToken()
  const storage = rememberMe ? localStorage : sessionStorage
  storage.setItem(TOKEN_KEY, token)
  localStorage.setItem(REMEMBER_KEY, rememberMe ? '1' : '0')
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
}

export function wasRemembered(): boolean {
  return localStorage.getItem(REMEMBER_KEY) === '1'
}
