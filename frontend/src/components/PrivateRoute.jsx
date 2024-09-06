import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Or any loading spinner

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
