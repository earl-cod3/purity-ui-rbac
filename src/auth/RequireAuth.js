import React from "react";
import { Redirect } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;            // or a spinner
  return user ? children : <Redirect to="/auth/signin" />;
}
