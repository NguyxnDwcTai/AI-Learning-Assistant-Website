import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Applayout from "../layout/AppLayout";
import { useAuth } from "../../context/AuthContext";


const ProtectedRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }
  return isAuthenticated ? (
    <Applayout>
      <Outlet />
    </Applayout>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoutes;
