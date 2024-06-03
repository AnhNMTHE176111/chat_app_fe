import React from "react";
import { AuthLayout } from "../../layouts";
import { Container, Typography, Alert } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";

interface RegisterSuccessParams {
  fullName?: string;
  email?: string;
}

export const RegisterSuccess: React.FC<RegisterSuccessParams> = () => {
  const location = useLocation();
  const { fullName, email } = location.state || {};

  return (
    <AuthLayout>
      <Container
        sx={{ backgroundColor: "#fff", padding: 2, boxShadow: 4 }}
        maxWidth="sm"
      >
        <Container>
          <Typography align="left" variant="h6">
            Congratulation!!!
          </Typography>
          <Typography
            align="left"
            variant="subtitle2"
            color={"gray"}
            gutterBottom
          >
            Welcome to the Chat Platform! Join us for easier online
            communication with your friends.
          </Typography>

          <Alert severity="success" sx={{ mb: 1 }}>
            Welcome <b>{fullName}</b>, your account has been successfully
            registered. We have sent you an activation email at <b>{email}</b>.
            Please check your inbox for completion. If you do not receive an
            activation email from us, please click{" "}
            <NavLink
              to="/send-activation"
              replace={true}
              style={{ textDecoration: "none" }}
            >
              resend the activation email
            </NavLink>
          </Alert>
        </Container>
      </Container>
    </AuthLayout>
  );
};

export default RegisterSuccess;
