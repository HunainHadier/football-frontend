import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../../utils/auth";

const LoginRoute = ({ children }) => {
  // Agar user already login hai → redirect to Home
  if (isLoggedIn()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default LoginRoute;
