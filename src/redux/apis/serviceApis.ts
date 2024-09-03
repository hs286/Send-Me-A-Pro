import { axiosInstance } from "../axios";

export const getServicesListApi = async (
  franchise_id: number,
  successCallback: (data: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.get(
      "/webapp/categories-for-prices/" + franchise_id
    );
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};
