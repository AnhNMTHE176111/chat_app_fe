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
} from "../pages";
import { RegisterSuccess } from "../components";
import { AuthGuard, GuestGuard, RoleBasedGuard } from "../guards";
import { ROLES } from "../constants";
import Dashboard from "../pages/Admin/Dashboard/Dashboard";
import EmojiManager from "../pages/Admin/EmojiManage/EmojiManage";
import UserManager from "../pages/Admin/UserManage/UserManage";
import AddUser from "../pages/Admin/UserManage/AddUser";
import AddEmojiPage from "../pages/Admin/EmojiManage/AddEmoji";
import AddEmoji from "../pages/Admin/EmojiManage/AddEmoji";
import EditEmoji from "../pages/Admin/EmojiManage/EditEmoji";
import EditUser from "../pages/Admin/UserManage/EditUser";
// import UserManager from "../pages/Admin/UserManage";
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
          <Outlet />
        </RoleBasedGuard>
      </AuthGuard>
    ),
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/home",
        element: <App />,
      },
      {
        path: "/about",
        element: <App />,
      },
    ],
  },

  /** Admin Route */
  {
    path: "/admin",
    element: (
      // <AuthGuard>
      // <RoleBasedGuard accessibleRoles={[ROLES.ADMIN_ROLE]}>
      <Outlet />
      // </RoleBasedGuard>
      // </AuthGuard>
    ),
    children: [
      {
        path: "",
        element: <App />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "manage-user",
        element: <UserManager />,
      },
      {
        path: "manage-emoji",
        element: <EmojiManager />,
      },
      {
        path: "add-user",
        element: <AddUser />,
      },
      {
        path: "edit-user/:id",
        element: <EditUser />,
      },
      {
        path: "add-emoji",
        element: <AddEmoji />,
      },
      {
        path: "edit-emoji/:id",
        element: <EditEmoji />,
      },
    ],
  },
];
