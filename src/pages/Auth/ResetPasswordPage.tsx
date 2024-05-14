import React from "react";
import { AuthLayout } from "../../layouts";
import { Container, Typography, Button, Divider } from "@mui/material";
import { PasswordInput, EmailInput, GoogleSignButton } from "../../components";
import { NavLink } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { ResetPasswordParams, resetPassword } from "../../services";

export const ResetPasswordPage = () => {
  const { control, handleSubmit } = useForm<ResetPasswordParams>();

  const onSubmit: SubmitHandler<ResetPasswordParams> = async (data) => {
    console.log(data);
    await resetPassword(data);
  };

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

          <form onSubmit={handleSubmit(onSubmit)}>
            <EmailInput control={control} name="email" />
            <PasswordInput
              control={control}
              name="new_password"
              label="New Password *"
            />
            <PasswordInput
              control={control}
              name="new_password_confirmation"
              label="New Password Confirmation *"
            />

            <Button variant="contained" fullWidth sx={{ my: 1.5 }}>
              Change Password
            </Button>
          </form>
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
