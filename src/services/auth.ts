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
  token: string;
  email: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface ForgotPasswordParams {
  token: string;
  email: string;
}

export const resgiter = async (
  params: RegisterParams
): Promise<BaseResponse> => {
  const res = await client.post<BaseResponse>(URI.REGISTER, params);
  return res.data;
};

export const login = async (params: LoginParams): Promise<BaseResponse> => {
  const res = await client.post<BaseResponse>(URI.LOGIN, params);
  console.log("data", res.data);
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

export {};
