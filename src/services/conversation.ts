import { URI } from "../constants";
import { client } from "./client";

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
