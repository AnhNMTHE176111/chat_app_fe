const DOMAIN = "http://localhost:8000/api/v1";

export const URI = {
  DOMAIN,

  // Authentication
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  CURRENT_USER: "/auth/current-user",
  REFRESH_TOKEN: "/auth/refresh",
  RESET_PASSWORD: "/auth/reset-password",
  FORGOT_PASSWORD: "/auth/forgot-password",
  SEND_ACTIVATION: "/auth/send-activation",
  VERIFY_EMAIL: "/auth/verify-email",

  // User
  FETCH_USER: "/users/:id",
};
const ADMIN_ROLE = "admin";
const NORMAL_ROLE = "normal";
export const ROLES = { ADMIN_ROLE, NORMAL_ROLE };

export const NON_AUTHORIZATION_API = [URI.FORGOT_PASSWORD, URI.LOGIN];

export default {
  URI,
  NON_AUTHORIZATION_API,
};
