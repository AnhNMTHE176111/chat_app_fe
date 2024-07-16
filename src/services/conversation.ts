import { URI } from "../constants";
import { client } from "./client";

export interface CreateSingleConversationParams {
  participants: string[];
  type: string;
}

export interface MemberParams {
  _id: string;
  fullName: string;
  avatar: string;
}

export interface MemberListParams {
  memberList: MemberParams[];
  admin: string[];
  conversationId: string;
}

export const getAllConversation = async () => {
  const res = await client.get(URI.GET_ALL_CONVERSATIONS);
  return res.data;
};

export const getConversationByID = async (id: string) => {
  const endpoint = URI.GET_CONVERSATION.replace(":conversation_id", id);
  const res = await client.get(endpoint);
  return res.data;
};

export const getMessagesConversation = async (id: string) => {
  const endpoint = URI.GET_MESSAGE_CONVERSATION.replace(":conversation_id", id);
  const res = await client.get(endpoint);
  return res.data;
};
export const createSingleConversation = async (
  data: CreateSingleConversationParams
) => {
  const res = await client.post(URI.CREATE_SINGLE_CONVERSATION, data);
  return res.data;
};

export const createGroupConversation = async (data: any) => {
  const res = await client.post(URI.CREATE_GROUP_CONVERSATION, data);
  return res.data;
};

export const getAllMediasConversation = async (id: string) => {
  const endpoint = URI.GET_MEDIA_CONVERSATION.replace(":conversation_id", id);
  const res = await client.get(endpoint);
  return res.data;
};

export const getAllFilesConversation = async (id: string) => {
  const endpoint = URI.GET_FILE_CONVERSATION.replace(":conversation_id", id);
  const res = await client.get(endpoint);
  return res.data;
};

export const loadMoreMessageConversation = async (
  id: string,
  before: string
) => {
  const endpoint = URI.LOAD_MORE_MESSAGE_CONVERSATION.replace(
    ":conversation_id",
    id
  );
  const res = await client.get(endpoint, {
    params: {
      before: before,
    },
  });
  return res.data;
};

export const addFriendToConversation = async (
  id: string,
  friendList: string[]
) => {
  const endpoint = URI.ADD_FRIEND_TO_CONVERSATION.replace(
    ":conversation_id",
    id
  );
  const res = await client.post(endpoint, { friendList });
  return res.data;
};

export const getMemberInConversation = async (id: string) => {
  const endpoint = URI.GET_MEMBER_IN_CONVERSATION.replace(
    ":conversation_id",
    id
  );
  const res = await client.get(endpoint);
  return res.data;
};

export const updateRoleInGroup = async (
  conversation_id: string,
  member_id: string,
  newRole: string
) => {
  const endpoint = URI.UPDATE_ROLE_IN_GROUP.replace(
    ":conversation_id",
    conversation_id
  )
    .replace(":member_id", member_id)
    .replace(":newRole", newRole);
  const res = await client.post(endpoint, { newRole });
  return res.data;
};

export const kickMember = async (
  conversation_id: string,
  member_id: string
) => {
  const endpoint = URI.KICK_MEMBER_IN_GROUP.replace(
    ":conversation_id",
    conversation_id
  ).replace(":member_id", member_id);
  const res = await client.post(endpoint);
  return res.data;
};

export const leaveGroup = async (conversation_id: string) => {
  const endpoint = URI.LEAVE_GROUP.replace(":conversation_id", conversation_id);
  const res = await client.post(endpoint);
  return res.data;
};
