import { URI } from "../constants";
import { client } from "./client";

export const getAllConversation = async () => {
  const res = await client.get(URI.GET_ALL_CONVERSATIONS);
  return res.data;
};
export const getMessagesConversation = async (id: string) => {
  const endpoint = URI.GET_MESSAGE_CONVERSATION.replace(":conversation_id", id);
  const res = await client.get(endpoint);
  return res.data;
};
