import { URI } from "../constants";
import { BaseResponse } from "./auth";
import { client } from "./client";

export interface Emojis {
    
    emoji: string;
    name: string;
    description: string;
    imageURL: string;
}
export const getEmojisById = async (
    id: string 
): Promise<BaseResponse> => {
    const res = await client.get<BaseResponse>(URI.GET_EMOJIS_BY_ID);
    return res.data;
}

export const createEmojis = async (
    params: Emojis
): Promise<BaseResponse> => {
    const res = await client.post<BaseResponse>(URI.CREATE_EMOJI, params);
    return res.data;
}

export const updateEmojis = async ( id: string,
    params: Emojis
): Promise<BaseResponse> => {
    const res = await client.put<BaseResponse>(URI.UPDATE_EMOJI, params);
    return res.data;
}

export const deleteEmojis = async ( id: string
): Promise<BaseResponse> => {
    const res = await client.delete<BaseResponse>(URI.DELETE_EMOJI);
    return res.data;
}