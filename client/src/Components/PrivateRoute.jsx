import React, { useContext } from "react";
import { GlobalInfo } from "../Context/GlobalInfo.jsx";
import { Navigate } from "react-router";

function PrivateRoute({ children }) {
  const { isAuth, token } = useContext(GlobalInfo);

  // Check both isAuth state and token from localStorage for secure verification
  const isAuthenticated = isAuth || !!localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace={true} />;
  }

  return children;
}

export default PrivateRoute;
