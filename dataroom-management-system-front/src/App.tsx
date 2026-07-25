import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AuthProvider } from '@/store/AuthContext'
import { FolderPage } from '@/pages/FolderPage'
import { LoginPage } from '@/pages/LoginPage'
import { SignUpPage } from '@/pages/SignUpPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<FolderPage />} />
            <Route path="/folder/:folderId" element={<FolderPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster richColors position="bottom-right" />
      </AuthProvider>
    </BrowserRouter>
  )
}
