import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { APP_ROUTE } from "@/constants";
import { AuthFadeLayout } from "@/motion";
import { AuthProvider } from "@/store/AuthContext";
import { FolderPage } from "@/pages/FolderPage";
import { LoginPage } from "@/pages/LoginPage";
import { SignUpPage } from "@/pages/SignUpPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AuthFadeLayout />}>
            <Route path={APP_ROUTE.LOGIN} element={<LoginPage />} />
            <Route path={APP_ROUTE.SIGN_UP} element={<SignUpPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path={APP_ROUTE.ROOT} element={<FolderPage />} />
            <Route path={APP_ROUTE.FOLDER_PATTERN} element={<FolderPage />} />
          </Route>
          <Route
            path="*"
            element={<Navigate to={APP_ROUTE.LOGIN} replace />}
          />
        </Routes>
        <Toaster richColors position="bottom-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}
