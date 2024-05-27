import { FC, ReactNode } from "react";
import { useAuth } from "../hooks";
import { Container } from "@mui/material";

interface RoleBasedGuardProps {
  accessibleRoles: Array<String>;
  children: ReactNode;
}

export const RoleBasedGuard: FC<RoleBasedGuardProps> = ({
  accessibleRoles,
  children,
}) => {
  const { user } = useAuth();
  if (user && !accessibleRoles.includes(user?.role)) {
    return <Container>Permission Denied</Container>;
  }

  return <>{children}</>;
};
