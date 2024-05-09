import { client } from "./client";

const getModel = (model: string | undefined, params: any = {}) => {
  return client.request({
    url: `${model}`,
    method: "GET",
    params,
    headers: {},
  });
};

const postModel = (model: string, data: any, headers?: any) => {
  return client.request({
    url: `${model}`,
    method: "POST",
    data,
    headers,
  });
};

const putModel = (model: string, data: any, id: any) => {
  return client.request({
    url: `${model}/${id}`,
    method: "PUT",
    data,
  });
};

const patchModel = (model: string, data: any, id: any) => {
  return client.request({
    url: `${model}/${id}`,
    method: "PATCH",
    data,
  });
};

const deleteModel = (model: string, id: any) => {
  return client.request({
    url: `${model}/${id}`,
    method: "DELETE",
  });
};

export default {
  getModel,
  postModel,
  patchModel,
  putModel,
  deleteModel,
};
