import React from "react";
import { AuthLayout } from "../../layouts";
import { Container, Typography, Button, Divider } from "@mui/material";
import { EmailInput, GoogleSignButton } from "../../components";
import { NavLink } from "react-router-dom";

export const ForgotPasswordPage = () => {
  return (
    <AuthLayout>
      <Container
        sx={{ backgroundColor: "#fff", padding: 2, boxShadow: 4 }}
        maxWidth="lg"
      >
        <Container>
          <Typography align="left" variant="h6">
            Forgot Password
          </Typography>
          <Typography
            align="left"
            variant="subtitle2"
            color={"gray"}
            gutterBottom
          >
            Forgot your password? Do not worry! Please provide us with the email
            you used to register for a Chat App account. We will send you a link
            to reset your password via that email.
          </Typography>

          <EmailInput />

          <Button variant="contained" fullWidth sx={{ my: 1.5 }}>
            Send Email to Me
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

export default ForgotPasswordPage;
