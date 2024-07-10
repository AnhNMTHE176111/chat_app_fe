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
  // ChatPage,
  // CallPage,
} from "../pages";
import { RegisterSuccess } from "../components";
import { AuthGuard, GuestGuard, RoleBasedGuard } from "../guards";
import { ROLES } from "../constants";
import { HomeLayout } from "../layouts";
// import { SocketContextProvider } from "../providers";

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

  // /** Authenticated Route */
  // {
  //   element: (
  //     <AuthGuard>
  //       <RoleBasedGuard accessibleRoles={[ROLES.NORMAL_ROLE]}>
  //         <SocketContextProvider>
  //           <HomeLayout>
  //             <Outlet />
  //           </HomeLayout>
  //         </SocketContextProvider>
  //       </RoleBasedGuard>
  //     </AuthGuard>
  //   ),
  //   errorElement: <NotFoundPage />,
  //   children: [
  //     {
  //       path: "/",
  //       element: <ChatPage />,
  //     },
  //     {
  //       path: "/chat/:id",
  //       element: <ChatPage />,
  //     },
  //     {
  //       path: "/video-call",
  //       element: <CallPage />,
  //     },
  //     {
  //       path: "/logout",
  //       element: <div>Logout...</div>,
  //     },
  //   ],
  // },

  /** Admin Route */
  {
    path: "/admin",
    element: (
      // <AuthGuard>
      // <RoleBasedGuard accessibleRoles={[ROLES.ADMIN_ROLE]}>
      <App>
        <Outlet />
      </App>
      // </RoleBasedGuard>
      // </AuthGuard>
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
