import { axiosInstance } from "../axios";
import { ReviewsStateModel, sessionParams } from "../modals";

const getAllSessionsApi = async (
  pageNumber: number,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.get("/session", {
      params: {
        sortOrder: "desc",
        page: pageNumber,
      },
    });
    successCallback(response);
    return response;
  } catch (error) {
    errorCallback(error);
  }
};

const updateSessionApi = async (
  body: sessionParams,
  id: number,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.put(`/session/${id}`, body);
    successCallback(response);
    return response;
  } catch (error) {
    errorCallback(error);
    return error;
  }
};

const setReviewApi = async (
  body: ReviewsStateModel,
  sessionData: any,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.post(`/review`, {
      ...body,
      sessionData,
    });
    successCallback(response);
    return response;
  } catch (error) {
    errorCallback(error);
    return error;
  }
};

export { getAllSessionsApi, updateSessionApi, setReviewApi };
