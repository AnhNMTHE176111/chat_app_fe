import { RouteObject } from "react-router-dom";
import {
  App,
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
  SendActivationPage,
} from "../pages";
import { RegisterSuccess } from "../components";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/",
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
        path: "/reset-password",
        element: <ResetPasswordPage />,
      },
      {
        path: "/send-activation",
        element: <SendActivationPage />,
      },
    ],
  },
];
