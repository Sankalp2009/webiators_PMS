import React, { useContext } from "react";
import { GlobalInfo } from "../Context/GlobalInfo.jsx";
import { Navigate } from "react-router";

function PrivateRoute({ children }) {
  const { isAuth, token } = useContext(GlobalInfo);
  console.log("PrivateRoute - isAuth:", isAuth, "token:", token);

  if (!isAuth) {
    return <Navigate to="/login" replace={true} />;
  }

  return children;
}

export default PrivateRoute;
