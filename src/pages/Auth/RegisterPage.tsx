import React from "react";
import { AuthLayout } from "../../layouts";
import { Container, Typography, Button, Divider } from "@mui/material";
import {
  PasswordInput,
  UsernameInput,
  EmailInput,
  GoogleSignButton,
} from "../../components";
import { NavLink } from "react-router-dom";

export const RegisterPage: React.FC = () => {
  return (
    <AuthLayout>
      <Container>
        <Typography align="center" variant="h5">
          Register
        </Typography>
        <Typography
          align="center"
          variant="subtitle1"
          color={"gray"}
          gutterBottom
        >
          Get your Chat App account now.
        </Typography>
      </Container>
      <Container
        sx={{ backgroundColor: "#fff", padding: 3, boxShadow: 4 }}
        maxWidth="xs"
      >
        <Container>
          <EmailInput />
          <UsernameInput />
          <PasswordInput />
          <PasswordInput label="Confirmation Password *" />

          <Button variant="contained" fullWidth sx={{ my: 1.5 }}>
            Register
          </Button>
          <Typography
            align="center"
            variant="subtitle1"
            color={"gray"}
            gutterBottom
          >
            Already have an account? <NavLink to="/login">Login</NavLink>
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

export default RegisterPage;
