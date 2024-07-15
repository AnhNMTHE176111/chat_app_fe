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
  publicInformation: boolean;
}

export interface ProfilePreviewParams {
  fullName: string;
  avatar: string;
  background: string;
  description: string;
  dateOfBirth: string;
  address: string;
  gender: string;
  publicInformation: boolean;
}

export interface FriendListParams {
  id: string;
  fullName: string;
  avatar: string;
  senderId: string;
}

export interface GetFriendListResponse extends BaseResponse {
  data: FriendListParams[];
}

export interface ChangeProfileInformationResponse extends BaseResponse {}

export interface GetProfilePreivewResponse extends BaseResponse {
  data: ProfilePreviewParams;
}

export interface GetProfileResponse extends BaseResponse {
  data: ChangeProfileInformationParams;
}

export const getProfileByPreview = async (
  id: string
): Promise<GetProfilePreivewResponse> => {
  const res = await client.get<GetProfilePreivewResponse>(
    URI.PROFILE_PREVIEW.replace(":id", id)
  );
  return res.data;
};

export const getProfile = async (id: string): Promise<GetProfileResponse> => {
  const res = await client.get<GetProfileResponse>(
    URI.PROFILE_USER.replace(":id", id)
  );
  return res.data;
};

export const changeInformation = async (
  id: string,
  data: ChangeProfileInformationParams
): Promise<ChangeProfileInformationResponse> => {
  const res = await client.put<ChangeProfileInformationResponse>(
    URI.PROFILE_USER.replace(":id", id),
    data
  );
  return res.data;
};

export const getFriendList = async (
  id: string
): Promise<GetFriendListResponse> => {
  const res = await client.get<GetFriendListResponse>(
    URI.FRIEND_LIST.replace(":id", id)
  );
  return res.data;
};

export const getFriendRequestList = async (
  id: string
): Promise<GetFriendListResponse> => {
  const res = await client.get<GetFriendListResponse>(
    URI.FRIEND_REQUEST_LIST.replace(":id", id)
  );
  return res.data;
};

export const changeFriendStatus = async (
  id: string,
  data: { friendId: string; status: string }
): Promise<BaseResponse> => {
  const res = await client.put<BaseResponse>(
    URI.CHANGE_FRIEND_STATUS.replace(":id", id),
    data
  );
  return res.data;
};

export const addFriendRequest = async (
  id: string,
  data: { friendId: string }
): Promise<BaseResponse> => {
  const res = await client.put<BaseResponse>(
    URI.ADD_FRIEND_REQUEST.replace(":id", id),
    data
  );
  return res.data;
};

export const findUserByFullName = async (
  fullName: string
): Promise<GetFriendListResponse> => {
  const res = await client.get<GetFriendListResponse>(
    URI.FIND_USER_BY_FULL_NAME.replace(":fullName", fullName)
  );
  return res.data;
};

export const findFriendByFullName = async (
  fullName: string
): Promise<GetFriendListResponse> => {
  const res = await client.get<GetFriendListResponse>(
    URI.FIND_FRIEND_BY_FULL_NAME.replace(":fullName", fullName)
  );
  return res.data;
};

export const getFriendById = async (id: string): Promise<BaseResponse> => {
  const res = await client.get<BaseResponse>(
    URI.GET_FRIEND_BY_ID.replace(":id", id)
  );
  return res.data;
};

export const getFriendListNotInGroup = async (
  id: string,
  fullName: string
): Promise<GetFriendListResponse> => {
  const res = await client.get<GetFriendListResponse>(
    URI.FRIEND_LIST_NOT_IN_GROUP.replace(":conversation_id", id).replace(
      ":fullName",
      fullName
    )
  );
  return res.data;
};

export {};
