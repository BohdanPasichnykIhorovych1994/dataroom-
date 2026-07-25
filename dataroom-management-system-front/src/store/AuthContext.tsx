import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  fetchMe,
  login as loginRequest,
  signUp as signUpRequest,
} from '@/storage/authRepository'
import { setUnauthorizedHandler } from '@/storage/http'
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from '@/storage/tokenStorage'
import type { AuthUser } from '@/types'

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  ready: boolean
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>
  signUp: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  const logout = useCallback(() => {
    clearStoredToken()
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setToken(null)
      setUser(null)
    })
    return () => setUnauthorizedHandler(null)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function hydrate() {
      const stored = getStoredToken()
      if (!stored) {
        if (!cancelled) setReady(true)
        return
      }

      setToken(stored)
      try {
        const me = await fetchMe()
        if (!cancelled) setUser(me)
      } catch {
        clearStoredToken()
        if (!cancelled) {
          setToken(null)
          setUser(null)
        }
      } finally {
        if (!cancelled) setReady(true)
      }
    }

    void hydrate()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email: string, password: string, rememberMe: boolean) => {
    const res = await loginRequest(email, password, rememberMe)
    setStoredToken(res.accessToken, rememberMe)
    setToken(res.accessToken)
    setUser(res.user)
  }, [])

  const signUp = useCallback(async (email: string, password: string, rememberMe = false) => {
    const res = await signUpRequest(email, password, rememberMe)
    setStoredToken(res.accessToken, rememberMe)
    setToken(res.accessToken)
    setUser(res.user)
  }, [])

  const value = useMemo(
    () => ({ user, token, ready, login, signUp, logout }),
    [user, token, ready, login, signUp, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
