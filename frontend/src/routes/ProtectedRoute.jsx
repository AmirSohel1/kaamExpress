import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }) {
  const { token, user } = useContext(AuthContext);

  if (!token) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user?.role)) return <Navigate to="/not-allowed" />;

  return <Outlet />;
}
