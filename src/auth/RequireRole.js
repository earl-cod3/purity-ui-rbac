import React from "react";
import { Redirect } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireRole({ allow = [], children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Redirect to="/auth/signin" />;
  return allow.includes(user.role) ? children : <Redirect to="/" />;
}
