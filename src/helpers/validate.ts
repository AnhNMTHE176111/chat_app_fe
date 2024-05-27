import { EMAIL_REGEX, PASSWORD_REGEX, USERNAME_REGEX } from "../constants";

export const isSame = (
  firstValue: any,
  secondValue: any,
  errorMessage?: ""
) => {
  if (firstValue !== secondValue) {
    throw new Error(errorMessage || `First Value must be same as Second Value`);
  }
  return true;
};

export const emailRule = (email: string) => {
  const regex = EMAIL_REGEX;
  if (!email || !regex.test(email)) {
    throw new Error(`Email is invalid`);
  }
  return true;
};

/**
 * At least one lowercase alphabet i.e. [a-z]
 * At least one uppercase alphabet i.e. [A-Z]
 * At least one Numeric digit i.e. [0-9]
 * At least one special character i.e. [‘@’, ‘$’, ‘.’, ‘#’, ‘!’, ‘%’, ‘*’, ‘?’, ‘&’, ‘^’]
 * Also, the total length must be in the range [8-15]
 */
export const passwordRule = (password: string) => {
  const regex = PASSWORD_REGEX;
  if (!password || !regex.test(password)) {
    throw new Error("Password is invalid.");
  }
  return true;
};

/**
 * Username consists of alphanumeric characters (a-zA-Z0-9), lowercase, or uppercase.
 * Username allowed of the dot (.), underscore (_), and hyphen (-).
 * The dot (.), underscore (_), or hyphen (-) must not be the first or last character.
 * The dot (.), underscore (_), or hyphen (-) does not appear consecutively, e.g., java..regex
 * The number of characters must be between 5 to 20.
 */
export const usernameRule = (username: string) => {
  const regex = USERNAME_REGEX;
  if (!username || !regex.test(username)) {
    throw new Error(`Username is invalid.`);
  }
  return true;
};

export const requiredRule = (value: any, fieldName: string) => {
  if (value === null || value === undefined || value.trim() === "") {
    throw new Error(`${fieldName} is required`);
  }
  return true;
};

export const minLengthString = (
  value: any,
  minLength: number,
  fieldName: string
) => {
  if (value.length <= minLength) {
    throw new Error(`${fieldName} must longer than or equal ${minLength}`);
  }
  return true;
};

export const maxLengthString = (
  value: any,
  maxLength: number,
  fieldName: string
) => {
  if (value.length >= maxLength) {
    throw new Error(`${fieldName} must shorter than or equal ${maxLength}`);
  }
  return true;
};

export const minNumber = (value: any, min: number, fieldName: string) => {
  if (value <= min) {
    throw new Error(`${fieldName} must larger than or equal ${min}`);
  }
  return true;
};

export const maxNumber = (value: any, max: number, fieldName: string) => {
  if (value >= max) {
    throw new Error(`${fieldName} must less than or equal ${max}`);
  }
  return true;
};
