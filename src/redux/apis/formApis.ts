import { axiosInstance } from "../axios";

export const getFormsApi = async (category_id: number) => {
  try {
    let response = await axiosInstance.get(`/forms/get-all/${category_id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
