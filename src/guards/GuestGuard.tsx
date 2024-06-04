import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { FC, ReactNode } from "react";
import { ROLES } from "../constants";

export const GuestGuard: FC<{ children: ReactNode }> = ({ children }) => {
  const { isInitialized, isAuthenticated, user } = useAuth();

  if (!isInitialized) {
    return <>loading...</>;
  }

  if (isAuthenticated) {
    if (user?.role == ROLES.ADMIN_ROLE) {
      return <Navigate to={"/admin"} replace />;
    }
    return <Navigate to={"/"} replace />;
  }

  return <>{children}</>;
};

export default GuestGuard;
