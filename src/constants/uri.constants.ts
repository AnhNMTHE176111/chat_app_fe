const DOMAIN = 'http://localhost:8000/api/v1';

export const URI = {
  DOMAIN,

  // Authentication
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  LOG_OUT: "/auth/logout",
  CHECK_OTP: "/auth/checkotp",
  CURRENT_USER: "/auth/current-user",
  REFRESH_TOKEN: "/auth/refresh",
  RESET_PASSWORD: "/auth/reset-password",
  FORGOT_PASSWORD: "/auth/forgot-password",
  CONFIRM_RESET_PASSWORD: "/auth/forgot-password",

  // User
  FETCH_USER: "/users/:id",
};

export const NON_AUTHORIZATION_API = [
  URI.FORGOT_PASSWORD,
  URI.LOGIN,
  URI.CHECK_OTP,
  URI.CONFIRM_RESET_PASSWORD,
];

export default {
  URI,
  NON_AUTHORIZATION_API,
};
