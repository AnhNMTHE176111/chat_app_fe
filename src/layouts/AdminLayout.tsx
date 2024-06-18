import React, { useEffect } from "react";
import { Box, Paper } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "../hooks";
import { hideNotificationAction } from "../stores/notificationActionSlice";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Hide notification when location changes
    dispatch(hideNotificationAction());
  }, [location.pathname]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f7f7ff",
        height: "100%", // Set height to 100% to occupy full height of the viewport
        clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", // Clip path to create a square background
      }}
    >
      <Box
        sx={{
          maxWidth: "1140px", // Set maximum width as per your design requirements
          height: "100vh", // Set height to 100vh to occupy full viewport height
          p: 4,
          backgroundColor: "#fff",
          borderRadius: "8px",
          mt: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        component={Paper}
        elevation={3}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AuthLayout;
