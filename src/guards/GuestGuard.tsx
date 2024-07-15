import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { FC, ReactNode } from "react";
import { ROLES } from "../constants";

export const GuestGuard: FC<{ children: ReactNode }> = ({ children }) => {
  const { isInitialized, isAuthenticated, user } = useAuth();

  if (!isInitialized) {
    return <>loading...</>;
  }
  console.log('user', user);

  if (isAuthenticated) {
    console.log('user', user);
    
    if (user?.role == ROLES.ADMIN_ROLE) {
      return <Navigate to={"/admin/dashboard"} replace />;
    }
    return <Navigate to={"/"} replace />;
  }

  return <>{children}</>;
};

export default GuestGuard;
