import { axiosInstance } from "../axios";

const postCreateRequestOpportunityApi = async (
  body: any,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.post(
      "/request-opportunities/create",
      body
    );
    successCallback(response);
    return response;
  } catch (error) {
    errorCallback(error);
    return error;
  }
};

export { postCreateRequestOpportunityApi };
