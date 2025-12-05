import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../../utils/auth";

const FallbackRoute = () => {
  return isLoggedIn() ? <Navigate to="/" replace /> : <Navigate to="/login" replace />;
};

export default FallbackRoute;
