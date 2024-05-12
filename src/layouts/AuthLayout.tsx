// AuthLayout.tsx
import React from "react";
import { Box, Container } from "@mui/material";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Box
      style={{ backgroundColor: "#f7f7ff" }}
      height={"100vh"}
      width={"100vw"}
      alignItems={"center"}
      alignContent={"center"}
      flexDirection={"column"}
      display={"flex"}
    >
      <img
        src="/logo_main.png"
        alt="Logo app"
        loading="lazy"
        width={150}
        style={{ marginTop: "50px" }}
      />

      <Container maxWidth="sm">{children}</Container>
    </Box>
  );
};

export default AuthLayout;
