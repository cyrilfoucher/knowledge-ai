import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <p className="text-muted">Chargement</p>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
