import { Navigate, Outlet } from "react-router-dom";
import { Fade } from "@/motion";
import { APP_ROUTE } from "@/constants";
import { useAuth } from "@/store/AuthContext";
import { DataroomProvider } from "@/store/DataroomContext";
import { getStoredToken } from "@/storage/tokenStorage";

export function ProtectedRoute() {
  const { user, ready } = useAuth();
  const hasToken = Boolean(getStoredToken());

  if (!ready) {
    return (
      <Fade className="flex min-h-full items-center justify-center text-sm text-muted-foreground">
        Loading…
      </Fade>
    );
  }

  if (!user || !hasToken) {
    return <Navigate to={APP_ROUTE.LOGIN} replace />;
  }

  return (
    <DataroomProvider>
      <Outlet />
    </DataroomProvider>
  );
}
