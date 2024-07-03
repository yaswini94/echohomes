import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Or any loading spinner

  return user ? <Navigate to="/dashboard" /> : children;
};

export default PublicRoute;
