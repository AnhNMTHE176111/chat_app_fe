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


  // profile
  PROFILE_USER: "/user/profile/:id",
  PROFILE_PREVIEW: "/user/profile/preview/:id",

  // Admin
  GET_ALL_EMOJIS: "/emojis",
  CREATE_EMOJI: "/add/emojis",
  GET_EMOJIS_BY_ID: "/emojis/:id",
  UPDATE_EMOJI: "/emojis/:id",
  DELETE_EMOJI: "/emojis/:id",

};

export const NON_AUTHORIZATION_API = [URI.FORGOT_PASSWORD, URI.LOGIN];

export default {
  URI,
  NON_AUTHORIZATION_API,
};
