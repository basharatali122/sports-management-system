import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // 🌀 1. Still loading user data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-medium text-gray-700">
        Checking access...
      </div>
    );
  }

  // 🚫 2. User not logged in → redirect to login
  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location, message: "Please log in to continue." }}
      />
    );
  }

  // 🔒 3. User logged in but not authorized for this route
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return (
      <Navigate to="/unauthorized" state={{ from: location }} replace />

    );
  }

  // ✅ 4. Authorized → render the child route
  return <Outlet />;
};

export default ProtectedRoute;
