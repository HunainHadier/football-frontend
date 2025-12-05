import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../../utils/auth";

const ProtectedRoute = ({ children }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" />;
  }

  // ✅ User ka data localStorage se lo
  // const user = JSON.parse(localStorage.getItem("user"));

  // // ✅ Role check karo
  // if (!user || user.role !== "admin") {
  //   return <Navigate to="/login" />; 
  // }

  return children;
};

export default ProtectedRoute;
