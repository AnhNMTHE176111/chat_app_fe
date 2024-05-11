import React from "react";
import { AuthLayout } from "../../layouts";
import { Container, Typography, Button, Divider } from "@mui/material";
import { PasswordInput, UsernameInput, EmailInput } from "../../components";
import { NavLink } from "react-router-dom";
import { Google } from "@mui/icons-material";

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
      <Container style={{ backgroundColor: "#fff", padding: 14 }} maxWidth="xs">
        <Container>
          <EmailInput />
          <UsernameInput />
          <PasswordInput />
          <PasswordInput label="Confirmation Password" />

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
          <Button
            variant="outlined"
            fullWidth
            color="primary"
            sx={{ my: 1.5 }}
            startIcon={<Google color="primary" />}
          >
            Sign with Google
          </Button>
        </Container>
      </Container>
    </AuthLayout>
  );
};

export default RegisterPage;
