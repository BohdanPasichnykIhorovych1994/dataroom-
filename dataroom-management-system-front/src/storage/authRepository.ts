import { apiJson } from '@/storage/http'
import type { AuthResponse, AuthUser } from '@/types'

export function signUp(email: string, password: string, rememberMe = false) {
  return apiJson<AuthResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, rememberMe }),
  })
}

export function login(email: string, password: string, rememberMe: boolean) {
  return apiJson<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, rememberMe }),
  })
}

export function fetchMe() {
  return apiJson<AuthUser>('/api/auth/me')
}
