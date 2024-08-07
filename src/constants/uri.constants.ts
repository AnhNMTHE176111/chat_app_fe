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
  GET_CONVERSATION: "/conversation/:conversation_id",
  GET_MESSAGE_CONVERSATION: "/conversation/:conversation_id/messages",
  CREATE_SINGLE_CONVERSATION: "/conversation/create-single-conversation",
  CREATE_GROUP_CONVERSATION: "/conversation/create-group-conversation",
  ADD_FRIEND_TO_CONVERSATION: "/conversation/:conversation_id/add-friend",
  GET_MEMBER_IN_CONVERSATION: "/conversation/:conversation_id/members",
  UPDATE_ROLE_IN_GROUP:
    "/conversation/:conversation_id/:member_id/:newRole/update-role",
  LEAVE_GROUP: "/conversation/:conversation_id/leave",
  KICK_MEMBER_IN_GROUP: "/conversation/:conversation_id/:member_id/kick",
  // profile
  PROFILE_USER: "/user/profile/:id",
  PROFILE_PREVIEW: "/user/profile/preview/:id",

  // friend
  FRIEND_LIST: "/user/friends/:id",
  FRIEND_REQUEST_LIST: "/user/friend-requests/:id",
  CHANGE_FRIEND_STATUS: "/user/change-friend-status/:id",
  ADD_FRIEND_REQUEST: "/user/add-friend/:id",
  FIND_USER_BY_FULL_NAME: "/user/find-by-fullName/:fullName",
  FIND_FRIEND_BY_FULL_NAME: "/user/find-friend-by-fullName/:fullName",
  GET_FRIEND_BY_ID: "/user/friend/:id",
  FRIEND_LIST_NOT_IN_GROUP:
    "/user/friends-not-in-group/:conversation_id/:fullName",

  GET_MEDIA_CONVERSATION: "/conversation/:conversation_id/medias",
  GET_FILE_CONVERSATION: "/conversation/:conversation_id/files",
  LOAD_MORE_MESSAGE_CONVERSATION:
    "/conversation/:conversation_id/messages/loadmore",

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
