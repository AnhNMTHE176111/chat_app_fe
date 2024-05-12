import React from "react";
import { AuthLayout } from "../../layouts";
import {
  Container,
  Typography,
  Button,
  Divider,
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material";
import { PasswordInput, EmailInput, GoogleSignButton } from "../../components";
import { NavLink } from "react-router-dom";

export const LoginPage = () => {
  return (
    <AuthLayout>
      <Container>
        <Typography align="center" variant="h5">
          Sign In
        </Typography>
        <Typography
          align="center"
          variant="subtitle1"
          color={"gray"}
          gutterBottom
        >
          Sign in to continue to Chat App now.
        </Typography>
      </Container>
      <Container
        sx={{ backgroundColor: "#fff", padding: 3, boxShadow: 4 }}
        maxWidth="xs"
      >
        <Container>
          <EmailInput />
          <PasswordInput />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Remember me"
              sx={{ color: "gray" }}
            />
            <NavLink
              to="/forgot-password"
              style={{
                textDecoration: "none",
              }}
            >
              Forgot Password
            </NavLink>
          </Box>

          <Button variant="contained" fullWidth sx={{ my: 1.5 }}>
            Sign In
          </Button>
          <Typography
            align="center"
            variant="subtitle1"
            color={"gray"}
            gutterBottom
          >
            Don't have an account ?{" "}
            <NavLink to="/register" style={{ textDecoration: "none" }}>
              Signup now
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

export default LoginPage;
