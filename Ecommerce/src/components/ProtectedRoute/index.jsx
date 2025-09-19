import React from "react";
import { Navigate } from "react-router-dom";
import Cookie from "js-cookie";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = Cookie.get("jwt_token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const userInfoRaw = localStorage.getItem("user_info");
    let role = undefined;
    try {
      role = JSON.parse(userInfoRaw || "null")?.role;
    } catch {}
    const normalizedRole = (role ?? "").toString().trim().toUpperCase();
    const normalizedAllowed = allowedRoles.map(r => (r ?? "").toString().trim().toUpperCase());
    if (!normalizedRole || !normalizedAllowed.includes(normalizedRole)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
