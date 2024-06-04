import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { FC, ReactNode } from "react";
import { ROLES } from "../constants";

export const AuthGuard: FC<{ children: ReactNode }> = ({ children }) => {
  const { isInitialized, isAuthenticated } = useAuth();

  if (!isInitialized) {
    return <>loading...</>;
  }

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return <>{children}</>;
};

export default AuthGuard;
