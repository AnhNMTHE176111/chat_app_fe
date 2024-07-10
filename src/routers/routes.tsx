import { Outlet, RouteObject } from "react-router-dom";
import {
  App,
  ForgotPasswordPage,
  LoginPage,
  NotFoundPage,
  RegisterPage,
  ResetPasswordPage,
  SendActivationPage,
  VerifyAccountPage,
  verifyAccountLoader,
  ChatPage,
  CallVideoPage,
} from "../pages";
import { RegisterSuccess } from "../components";
import { AuthGuard, GuestGuard, RoleBasedGuard } from "../guards";
import { ROLES } from "../constants";
import { HomeLayout } from "../layouts";
import {
  CallContextProvider,
  MessageContextProvider,
  SocketContextProvider,
} from "../providers";

export const routes: RouteObject[] = [
  /** Unauthenticated Route */
  {
    errorElement: <NotFoundPage />,
    children: [
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
        element: <VerifyAccountPage />,
        errorElement: <NotFoundPage />,
      },
    ],
  },

  /** Authentication Route */
  {
    element: (
      <GuestGuard>
        <Outlet />
      </GuestGuard>
    ),
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
    ],
  },

  /** Authenticated Route */
  {
    element: (
      <AuthGuard>
        <RoleBasedGuard accessibleRoles={[ROLES.NORMAL_ROLE]}>
          <SocketContextProvider>
            <CallContextProvider>
              <MessageContextProvider>
                <Outlet />
              </MessageContextProvider>
            </CallContextProvider>
          </SocketContextProvider>
        </RoleBasedGuard>
      </AuthGuard>
    ),
    errorElement: <NotFoundPage />,
    children: [
      {
        element: (
          <HomeLayout>
            <Outlet />
          </HomeLayout>
        ),
        children: [
          {
            path: "/home",
            element: <App />,
          },
          {
            path: "/",
            element: <ChatPage />,
          },
          {
            path: "/chat/:id",
            element: <ChatPage />,
          },

          {
            path: "/about",
            element: <App />,
          },
        ],
      },
      {
        path: "/call/:conversation_id/:initialize_call",
        element: <CallVideoPage />,
      },
    ],
  },

  /** Admin Route */
  {
    path: "/admin",
    element: (
      <AuthGuard>
        <RoleBasedGuard accessibleRoles={[ROLES.ADMIN_ROLE]}>
          <Outlet />
        </RoleBasedGuard>
      </AuthGuard>
    ),
    children: [
      {
        path: "",
        element: <App />,
      },
    ],
  },
];
