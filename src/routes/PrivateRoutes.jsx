// src/routes/PrivateRoutes.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useUser from "../context/UserContext";
import Forbidden from "../Pages/Forbidden";
import InternalServerError from "../Pages/InternalServerError";

export default function PrivateRoutes({ isAuthenticated, allowedRoles = [] }) {
  const { user, token } = useUser();
  const location = useLocation();

  // Not logged in → redirect to login
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!user) {
    return <InternalServerError />;
  }

  // Logged in but not allowed role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Forbidden />;
  }

  return <Outlet />;
}
