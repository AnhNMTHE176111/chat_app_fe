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
import { NavLink, useLocation } from "react-router-dom";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { LoginParams, LoginResponse, login } from "../../services";
import { useAppSelector, useAppDispatch, useAuth, signin } from "../../hooks";
import {
  hideNotificationAction,
  showNotificationAction,
} from "../../stores/notificationActionSlice";

export const LoginPage = () => {
  const { dispatch } = useAuth();

  const location = useLocation();
  const { email, password, isActiveEmail } = location.state || {};

  const { control, handleSubmit } = useForm<LoginParams>({
    defaultValues: {
      email: email,
      password: password,
      remember_me: false,
    },
  });
  // The `state` arg is correctly typed as `RootState` already
  const notificationAction = useAppSelector(
    (state) => state.notificationAction
  );
  const dispatchNoti = useAppDispatch();

  if (isActiveEmail) {
    dispatchNoti(
      showNotificationAction({
        message: "Email is Actived",
        severity: "success",
      })
    );
  }

  const onSubmit: SubmitHandler<LoginParams> = async (data) => {
    login(data)
      .then((response: LoginResponse) => {
        dispatch(
          signin({
            user: {
              email: response.data.email,
              fullName: response.data.fullName,
              role: response.data.role,
            },
          })
        );
        dispatchNoti(
          showNotificationAction({
            message: response.message || "Login Success",
            severity: "success",
          })
        );

        // navigate(from, { replace: true });
        return;
      })
      .catch((err) => {
        dispatchNoti(
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
            onClose={() => dispatchNoti(hideNotificationAction())}
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
              <Controller
                control={control}
                name="remember_me"
                render={({ field }) => (
                  <FormControlLabel
                    {...field}
                    control={<Checkbox size="small" name="remember_me" />}
                    label="Remember me"
                    sx={{ color: "gray" }}
                  />
                )}
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
