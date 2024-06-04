import React from "react";
import { AuthLayout } from "../../layouts";
import { Container, Typography, Button, Divider } from "@mui/material";
import {
  PasswordInput,
  EmailInput,
  GoogleSignButton,
  NotificationAction,
} from "../../components";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { ResetPasswordParams, resetPassword } from "../../services";
import { useAppSelector, useAppDispatch } from "../../hooks";
import {
  hideNotificationAction,
  showNotificationAction,
} from "../../stores/notificationActionSlice";

export const ResetPasswordPage = () => {
  const { passwordResetToken } = useParams();
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm<ResetPasswordParams>();
  const notificationAction = useAppSelector(
    (state) => state.notificationAction
  );
  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<ResetPasswordParams> = async (data) => {
    data.passwordResetToken = passwordResetToken;
    resetPassword(data)
      .then((response) => {
        dispatch(
          showNotificationAction({
            message: response.message || "Set New Password Success",
            severity: "success",
          })
        );
        navigate("/login", {
          state: {
            email: data.email,
            password: data.new_password,
          },
        });
        return;
      })
      .catch((err) => {
        dispatch(
          showNotificationAction({
            message: err?.response?.data?.message,
            severity: "error",
          })
        );
        return;
      });
  };

  return (
    <AuthLayout>
      <Container
        sx={{ backgroundColor: "#fff", padding: 2, boxShadow: 4 }}
        maxWidth="sm"
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

          <NotificationAction
            message={notificationAction.message}
            open={!!notificationAction.open}
            severity={notificationAction.severity}
            onClose={() => dispatch(hideNotificationAction())}
          />

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

            <Button
              variant="contained"
              fullWidth
              sx={{ my: 1.5 }}
              type="submit"
            >
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
