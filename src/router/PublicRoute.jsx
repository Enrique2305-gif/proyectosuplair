import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../auth";
import { getHomeByUser } from "../auth/helpers";
import { obtainUserPermission } from "../firebase/obtainPermission";

export const PublicRoute = ({ children }) => {
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    obtainUserPermission();
  }, []);

  return !authState.logged ? children : <Navigate to={getHomeByUser(authState?.user)} replace />;
};
