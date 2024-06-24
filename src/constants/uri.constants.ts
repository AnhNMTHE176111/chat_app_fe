const BASE_API = process.env.REACT_APP_BASE_API;
const API_VERSION = "/api/v1";
const DOMAIN = process.env.REACT_APP_BASE_API + API_VERSION;

export const URI = {
  BASE_API,
  API_VERSION,
  DOMAIN,

  // Authentication
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  CURRENT_USER: "/auth/current-user",
  REFRESH_TOKEN: "/auth/token",
  RESET_PASSWORD: "/auth/reset-password",
  FORGOT_PASSWORD: "/auth/forgot-password",
  SEND_ACTIVATION: "/auth/send-activation",
  VERIFY_EMAIL: "/auth/verify-email",

  // User
  FETCH_USER: "/users/:id",

  // Message
  SEND_MESSAGE: "/message/send/:conversation_id",

  // Conversation
  GET_ALL_CONVERSATIONS: "/conversation/list",
  GET_MESSAGE_CONVERSATION: "/conversation/:conversation_id/messages",
  GET_MEDIA_CONVERSATION: "/conversation/:conversation_id/medias",
  GET_FILE_CONVERSATION: "/conversation/:conversation_id/files",
  LOAD_MORE_MESSAGE_CONVERSATION: "/conversation/:conversation_id/messages/loadmore",
};

export const NON_AUTHORIZATION_API = [URI.FORGOT_PASSWORD, URI.LOGIN];

export default {
  URI,
  NON_AUTHORIZATION_API,
};
