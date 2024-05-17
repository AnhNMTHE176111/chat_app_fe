import React from "react";
import { AuthLayout } from "../../layouts";
import { Container, Typography, Button, Divider } from "@mui/material";
import {
  EmailInput,
  GoogleSignButton,
  NotificationAction,
} from "../../components";
import { NavLink } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { ForgotPasswordParams, forgotPassword } from "../../services";
import { useAppSelector, useAppDispatch } from "../../hooks";
import {
  hideNotificationAction,
  showNotificationAction,
} from "../../stores/notificationActionSlice";

export const ForgotPasswordPage = () => {
  const { control, handleSubmit } = useForm<ForgotPasswordParams>();
  const notificationAction = useAppSelector(
    (state) => state.notificationAction
  );
  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<ForgotPasswordParams> = async (data) => {
    forgotPassword(data)
      .then((response) => {
        dispatch(
          showNotificationAction({
            message: `We've sent you an email with a link to reset your password. It may take 1 to 2 minutes to complete. Please check your inbox ${data.email}`,
            severity: "success",
          })
        );
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

          <NotificationAction
            message={notificationAction.message}
            open={!!notificationAction.open}
            severity={notificationAction.severity}
            onClose={() => dispatch(hideNotificationAction())}
          />

          <form onSubmit={handleSubmit(onSubmit)}>
            <EmailInput control={control} name="email" />

            <Button
              variant="contained"
              fullWidth
              sx={{ my: 1.5 }}
              type="submit"
            >
              Send Email to Me
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

export default ForgotPasswordPage;
