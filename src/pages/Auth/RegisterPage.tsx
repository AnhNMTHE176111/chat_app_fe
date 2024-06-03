import React from "react";
import { AuthLayout } from "../../layouts";
import { Container, Typography, Button, Divider } from "@mui/material";
import {
  PasswordInput,
  FullNameInput,
  EmailInput,
  GoogleSignButton,
  NotificationAction,
} from "../../components";
import { NavLink, useNavigate } from "react-router-dom";
import { RegisterParams, resgiter } from "../../services";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  hideNotificationAction,
  showNotificationAction,
} from "../../stores/notificationActionSlice";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm<RegisterParams>();
  const notificationAction = useAppSelector(
    (state) => state.notificationAction
  );
  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<RegisterParams> = async (data) => {
    resgiter(data)
      .then((respone) => {
        dispatch(
          showNotificationAction({
            message: "Register Successfully!",
            severity: "success",
          })
        );
        navigate("success", {
          state: {
            email: data.email,
            fullName: data.fullName,
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
          <NotificationAction
            message={notificationAction.message}
            open={!!notificationAction.open}
            severity={notificationAction.severity}
            onClose={() => dispatch(hideNotificationAction())}
          />

          <form onSubmit={handleSubmit(onSubmit)}>
            <EmailInput control={control} name="email" />
            <FullNameInput control={control} name="fullName" />
            <PasswordInput control={control} name="password" />
            <PasswordInput
              control={control}
              name="password_confirmation"
              label="Password Confirmation *"
            />

            <Button
              variant="contained"
              fullWidth
              sx={{ my: 1.5 }}
              type="submit"
            >
              Register
            </Button>
          </form>
          <Typography
            align="center"
            variant="subtitle1"
            color={"gray"}
            gutterBottom
          >
            Already have an account?{" "}
            <NavLink
              to="/login"
              replace={true}
              style={{ textDecoration: "none" }}
            >
              Login
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

export default RegisterPage;
