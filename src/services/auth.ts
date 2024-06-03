import { URI } from "../constants";
import { UserData } from "../hooks";
import { client } from "./client";

export interface BaseResponse {
  data: {};
  success?: boolean;
  message?: string;
}

export interface RegisterParams {
  email: string;
  fullName: string;
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

export interface LoginResponse extends BaseResponse {
  data: {
    email: string;
    fullName: string;
    accessToken: string;
    tokenExpireAt: string;
    role: string;
  };
}

export interface GetCurrentUserResponse extends BaseResponse {
  data: {
    user: UserData;
  };
}

export interface VerifyEmailResponse extends BaseResponse {
  data: {
    email: string;
    verificationStatus: boolean;
  };
}

export const resgiter = async (
  params: RegisterParams
): Promise<BaseResponse> => {
  const res = await client.post<BaseResponse>(URI.REGISTER, params);
  return res.data;
};

export const login = async (params: LoginParams): Promise<LoginResponse> => {
  const res = await client.post<LoginResponse>(URI.LOGIN, params);
  return res.data;
};

export const logout = async (): Promise<BaseResponse> => {
  const res = await client.post<BaseResponse>(URI.LOGOUT);
  return res.data;
};

export const token = async (): Promise<BaseResponse> => {
  const res = await client.post<BaseResponse>(URI.REFRESH_TOKEN);
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
): Promise<VerifyEmailResponse> => {
  const res = await client.post<VerifyEmailResponse>(URI.VERIFY_EMAIL, params);
  return res.data;
};

export const getCurrentUser = async (): Promise<GetCurrentUserResponse> => {
  const res = await client.get<GetCurrentUserResponse>(URI.CURRENT_USER);
  return res.data;
};

export {};
