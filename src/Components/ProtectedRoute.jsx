import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useUser } from "../Context/UserContext";

const ProtectedRoute = () => {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#F3F0ED]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C2F2F]"></div>
      </div>
    );
  }

  if (!user || !user.auth_token) {
    // Redirect unauthenticated users to /login with original location state
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
