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
  CallPage,
  Profile,
  ContactsPage,
  CallVoicePage,
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

import Dashboard from "../pages/Admin/Dashboard/Dashboard";
import EmojiManager from "../pages/Admin/EmojiManage/EmojiManage";
import UserManager from "../pages/Admin/UserManage/UserManage";
import AddEmojiPage from "../pages/Admin/EmojiManage/AddEmoji";
import AddEmoji from "../pages/Admin/EmojiManage/AddEmoji";
import { logout } from "../services";
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
        <RoleBasedGuard accessibleRoles={[ROLES.NORMAL_ROLE, ROLES.ADMIN_ROLE]}>
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
            path: "/",
            element: <ChatPage />,
          },
          {
            path: "/chat/:id",
            element: <ChatPage />,
          },
          {
            path: "/profile",
            element: <Profile />,
          },
          {
            path: "/contacts",
            element: <ContactsPage />,
          },
        ],
      },
      {
        path: "/call-video/:conversation_id/:initialize_call",
        element: <CallVideoPage />,
      },
      {
        path: "/call-voice/:conversation_id/:initialize_call",
        element: <CallVoicePage />,
      },
    ],
  },

  /** Admin Route */
  {
    path: "/admin",
    element: (
      <AuthGuard>
        <RoleBasedGuard accessibleRoles={[ROLES.ADMIN_ROLE]}>
          {/* <SocketContextProvider>
            <CallContextProvider>
              <MessageContextProvider> */}
          <App>
            <Outlet />
          </App>
          {/* </MessageContextProvider>
            </CallContextProvider>
          </SocketContextProvider> */}
        </RoleBasedGuard>
      </AuthGuard>
    ),
    children: [
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
    ],
  },
];
