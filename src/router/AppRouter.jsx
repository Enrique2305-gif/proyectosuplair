import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AdmRoutes } from "../administradores";
import { AuthContext, LoginPage, SignupPage, TerminosPage, ExpirationPage } from "../auth";
import { getUserRole, ROLES } from "../auth/helpers";
import { CompRoutes } from "../compradores";
import { ProvRoutes } from "../proveedores";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";

export const AppRouter = () => {
  const { authState } = useContext(AuthContext);

  const getRoutesByTypeOfUser = (user) => {
    const role = getUserRole(user);

    switch (role) {
      case ROLES.COMPRADOR:
        return <CompRoutes />;
      case ROLES.PROVEEDOR:
        return <ProvRoutes />;
      case ROLES.ADMINISTRADOR:
        return <AdmRoutes />;
      default:
        return <Navigate to="/login" replace />;
    }
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />
      <Route
        path="/terminos_y_condiciones"
        element={
          <PublicRoute>
            <TerminosPage />
          </PublicRoute>
        }
      />
      <Route
        path="/sesion_expirada"
        element={
          <PublicRoute>
            <ExpirationPage />
          </PublicRoute>
        }
      />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            {getRoutesByTypeOfUser(authState?.user)}
          </PrivateRoute>
        }
      />
    </Routes>
  );
};
