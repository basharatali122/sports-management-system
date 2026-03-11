// src/routes/NonPrivateRoutes.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useUser from "../context/UserContext";

export default function NonPrivateRoutes({ isAuthenticated }) {
  const { user } = useUser();

  if (isAuthenticated && user?.role) {
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "coach") return <Navigate to="/coach-dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
