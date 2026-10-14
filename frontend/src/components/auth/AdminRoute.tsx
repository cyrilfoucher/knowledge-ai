import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="text-muted">Chargement...</p>;
  }
  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
