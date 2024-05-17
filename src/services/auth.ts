import { URI } from "../constants";
import { client } from "./client";

export interface BaseResponse {
  data: {};
  success?: boolean;
  message?: string;
}

export interface RegisterParams {
  email: string;
  username: string;
  password: string;
  password_confirmation: string;
}

export interface LoginParams {
  email: string;
  password: string;
  remember_me: boolean;
}

export interface ResetPasswordParams {
  email: string;
  new_password: string;
  new_password_confirmation: string;
  passwordResetToken?: string;
}

export interface ForgotPasswordParams {
  token: string;
  email: string;
}

export interface SendActivationParams {
  email: string;
}

export interface VerifyEmailParams {
  emailToken: string;
}

export const resgiter = async (
  params: RegisterParams
): Promise<BaseResponse> => {
  const res = await client.post<BaseResponse>(URI.REGISTER, params);
  return res.data;
};

export const login = async (params: LoginParams): Promise<BaseResponse> => {
  const res = await client.post<BaseResponse>(URI.LOGIN, params);
  return res.data;
};

export const resetPassword = async (
  params: ResetPasswordParams
): Promise<BaseResponse> => {
  const res = await client.post<BaseResponse>(URI.RESET_PASSWORD, params);
  return res.data;
};

export const forgotPassword = async (
  params: ForgotPasswordParams
): Promise<BaseResponse> => {
  const res = await client.post<BaseResponse>(URI.FORGOT_PASSWORD, params);
  return res.data;
};

export const sendActivation = async (
  params: SendActivationParams
): Promise<BaseResponse> => {
  const res = await client.post<BaseResponse>(URI.SEND_ACTIVATION, params);
  return res.data;
};

export const verifyAccount = async (
  params: VerifyEmailParams
): Promise<BaseResponse> => {
  const res = await client.post<BaseResponse>(URI.VERIFY_EMAIL, params);
  return res.data;
};

export {};
