import { URI } from "../constants";
import { BaseResponse } from "./auth";
import { client } from "./client";

export interface ChangeProfileInformationParams {
  fullName: string;
  avatar: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  gender: string;
  description: string;
  background: string;
}

export interface ProfilePreviewParams {
  fullName: string;
  avatar: string;
  background: string;
  description: string;
  dateOfBirth: string;
  address: string;
  gender: string;
}

export interface ChangeProfileInformationParams extends BaseResponse {

}

export interface GetProfilePreivewResponse extends BaseResponse {
  data: ProfilePreviewParams
}

export interface GetProfileResponse extends BaseResponse {
  data: ChangeProfileInformationParams
}

export const getProfileByPreview = async (
  id: string
): Promise<GetProfilePreivewResponse> => {
  const res = await client.get<GetProfilePreivewResponse>(URI.PROFILE_PREVIEW.replace(":id", id));
  return res.data;
};

export const getProfile = async (
  id: string
): Promise<GetProfileResponse> => {
  const res = await client.get<GetProfileResponse>(URI.PROFILE_USER.replace(":id", id));
  return res.data;
};

export const changeInformation = async (
  id: string,
  data: ChangeProfileInformationParams
): Promise<ChangeProfileInformationParams> => {
  const res = await client.put<ChangeProfileInformationParams>(
    URI.PROFILE_USER.replace(":id", id),
    data
  );
  return res.data;
};

export {};
