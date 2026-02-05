import React, { useContext } from "react";
import { GlobalInfo } from "../Context/GlobalInfo.jsx";
import { Navigate } from "react-router";

function PrivateRoute({ children }) {
  const { isAuth } = useContext(GlobalInfo);

  if (!isAuth) return <Navigate to="/login" replace={true} />;

  return children;
}

export default PrivateRoute;