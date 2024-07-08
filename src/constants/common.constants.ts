export const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;
export const USERNAME_REGEX =
  /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/;
export const ACCESS_TOKEN_KEY_COOKIE = "access_token";
export const SINGLE_CONVERSATION = "single";
export const GROUP_CONVERSATION = "group";
const ADMIN_ROLE = "admin";
const NORMAL_ROLE = "normal";
export const ROLES = { ADMIN_ROLE, NORMAL_ROLE };

export const FRIEND_STATUS = {
  PENDING: "pending",
  ACCEPT: "accept",
  REJECT: "reject",
}