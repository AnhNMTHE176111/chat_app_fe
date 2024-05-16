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
import {
  PasswordInput,
  EmailInput,
  GoogleSignButton,
  NotificationAction,
} from "../../components";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoginParams, login } from "../../services";
import { useAppSelector, useAppDispatch } from "../../hooks";
import {
  hideNotificationAction,
  showNotificationAction,
} from "../../stores/notificationActionSlice";

export const LoginPage = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const { email, password } = location.state || {};

  const { control, handleSubmit } = useForm<LoginParams>({
    defaultValues: {
      email: email,
      password: password,
    },
  });
  // The `state` arg is correctly typed as `RootState` already
  const notificationAction = useAppSelector(
    (state) => state.notificationAction
  );
  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<LoginParams> = async (data) => {
    console.log(data);
    login(data)
      .then((data) => {
        console.log("success", data);

        dispatch(
          showNotificationAction({
            message: data.message || "Login Success",
            severity: "success",
          })
        );
        navigate("/", {
          replace: false,
          state: {},
        });
        return;
      })
      .catch((err) => {
        dispatch(
          showNotificationAction({
            message: err?.response?.data?.message || "Something wrong",
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
          <NotificationAction
            message={notificationAction.message}
            open={!!notificationAction.open}
            severity={notificationAction.severity}
            onClose={() => dispatch(hideNotificationAction())}
          />

          <form onSubmit={handleSubmit(onSubmit)}>
            <EmailInput control={control} name="email" value={email} />
            <PasswordInput control={control} name="password" value={password} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <FormControlLabel
                control={<Checkbox size="small" name="remember_me" />}
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

            <Button
              variant="contained"
              fullWidth
              sx={{ my: 1.5 }}
              type="submit"
            >
              Sign In
            </Button>
          </form>
          <Typography
            align="center"
            variant="subtitle1"
            color={"gray"}
            gutterBottom
          >
            Don't have an account ?{" "}
            <NavLink
              to="/register"
              replace={true}
              style={{ textDecoration: "none" }}
            >
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
