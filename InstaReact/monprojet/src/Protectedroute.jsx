import { Navigate, Outlet } from "react-router";
import { useAuth } from "./AuthContext";
 
// Sans prop : il faut être connecté.   <ProtectedRoute />
// Avec role : il faut ce rôle précis.  <ProtectedRoute role="admin" />
export default function ProtectedRoute({ role }) {
  const { user } = useAuth();
 
  if (!user) {
    return <Navigate to="/connexion" replace />;
  }
 
  if (role && user.role !== role) {
    return <Navigate to="/produits" replace />;
  }
 
  return <Outlet />;
}