import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function GuestRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <p className="text-muted">Chargement...</p>;
  }
  if (isAuthenticated) {
    return <Navigate to="/knowledge" replace />;
  }

  return <Outlet />;
}

export default GuestRoute;
