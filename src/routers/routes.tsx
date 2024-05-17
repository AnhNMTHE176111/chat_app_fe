import { RouteObject } from "react-router-dom";
import {
  App,
  ForgotPasswordPage,
  LoginPage,
  NotFoundPage,
  RegisterPage,
  ResetPasswordPage,
  SendActivationPage,
  verifyAccountLoader,
} from "../pages";
import { RegisterSuccess } from "../components";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/",
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        children: [
          {
            path: "",
            element: <RegisterPage />,
          },
          {
            path: "success",
            element: <RegisterSuccess />,
          },
        ],
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/reset-password/:passwordResetToken",
        element: <ResetPasswordPage />,
      },
      {
        path: "/send-activation",
        element: <SendActivationPage />,
      },
      {
        path: "/verify-email/:emailToken",
        loader: verifyAccountLoader,
        errorElement: <NotFoundPage />,
      },
    ],
  },
];
