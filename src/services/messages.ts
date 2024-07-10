import { URI } from "../constants";
import { client } from "./client";

export const sendMessage = async (id: string, data: any) => {
  const endpoint = URI.SEND_MESSAGE.replace(":conversation_id", id);
  const res = await client.post(endpoint, data);
  return res.data;
};
