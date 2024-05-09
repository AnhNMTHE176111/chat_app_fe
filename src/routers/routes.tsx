import { RouteObject } from "react-router-dom";
import { App, LoginPage } from "../pages";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
];
