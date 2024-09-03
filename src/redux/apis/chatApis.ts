import { axiosInstance } from "../axios";

export const getChatListApi = async (userId: number) => {
  try {
    let response = await axiosInstance.get(`chat/list/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getChatWithApi = async (userId: number) => {
  try {
    let response = await axiosInstance.get(`chat/start/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
