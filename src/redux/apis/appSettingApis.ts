import { axiosInstance } from "../axios";

export const getAppSettingByTypeApi = async (
  type: string,
  franchise_id: number,
  successCallback: (data: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.get(
      franchise_id
        ? `/app-settings/${type}/${franchise_id}`
        : `/app-settings/${type}`
    );
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};
