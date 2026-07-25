import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/store/AuthContext'
import { DataroomProvider } from '@/store/DataroomContext'
import { getStoredToken } from '@/storage/tokenStorage'

export function ProtectedRoute() {
  const { user, ready } = useAuth()
  const hasToken = Boolean(getStoredToken())

  if (!ready) {
    return (
      <div className="flex min-h-full items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    )
  }

  if (!user || !hasToken) {
    return <Navigate to="/login" replace />
  }

  return (
    <DataroomProvider>
      <Outlet />
    </DataroomProvider>
  )
}
