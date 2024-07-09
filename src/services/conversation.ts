import { URI } from "../constants";
import { client } from "./client";

export interface CreateSingleConversationParams{
  participants: string[];
  type: string;
};

export const getAllConversation = async () => {
  const res = await client.get(URI.GET_ALL_CONVERSATIONS);
  return res.data;
};
export const getMessagesConversation = async (id: string) => {
  const endpoint = URI.GET_MESSAGE_CONVERSATION.replace(":conversation_id", id);
  const res = await client.get(endpoint);
  return res.data;
};
export const createSingleConversation = async (data: CreateSingleConversationParams) => {
  const res = await client.post(URI.CREATE_SINGLE_CONVERSATION, data);
  return res.data;
}

export const createGroupConversation = async (data: any) => {
  const res = await client.post(URI.CREATE_GROUP_CONVERSATION, data);
  return res.data;
}