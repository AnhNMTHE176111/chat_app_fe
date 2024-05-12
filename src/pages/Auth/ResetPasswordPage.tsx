import React from "react";
import { AuthLayout } from "../../layouts";
import { Container, Typography, Button, Divider } from "@mui/material";
import { PasswordInput, EmailInput, GoogleSignButton } from "../../components";
import { NavLink } from "react-router-dom";

export const ResetPasswordPage = () => {
  return (
    <AuthLayout>
      <Container
        sx={{ backgroundColor: "#fff", padding: 2, boxShadow: 4 }}
        maxWidth="lg"
      >
        <Container>
          <Typography align="left" variant="h6">
            Reset Password
          </Typography>
          <Typography
            align="left"
            variant="subtitle2"
            color={"gray"}
            gutterBottom
          >
            Almost done, change your password to complete. You should keep a
            strong password to prevent unauthorized access to your account.
          </Typography>

          <EmailInput />
          <PasswordInput label="New Password *" />
          <PasswordInput label="Confirmation New Password *" />

          <Button variant="contained" fullWidth sx={{ my: 1.5 }}>
            Change Password
          </Button>
          <Typography
            align="center"
            variant="subtitle1"
            color={"gray"}
            gutterBottom
          >
            OMG You've remembered your password ?{" "}
            <NavLink to="/login" style={{ textDecoration: "none" }}>
              Login now
            </NavLink>
          </Typography>
        </Container>
        <Divider sx={{ mx: 4 }}>
          <Typography
            align="center"
            variant="subtitle1"
            color={"gray"}
            gutterBottom
          >
            Or
          </Typography>
        </Divider>
        <Container>
          <GoogleSignButton />
        </Container>
      </Container>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
