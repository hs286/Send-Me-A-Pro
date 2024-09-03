import { axiosInstance } from "../axios";
import { GetTrainerFilterModal } from "../modals";
var qs = require("qs");

const getTrainersApis = async (
  params: GetTrainerFilterModal,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.get("/webapp/get-trainers", { params });
    successCallback(response);
    return response;
  } catch (error) {
    errorCallback(error);
  }
};

const getFilterOptionsApi = async (
  franchise_id: number,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.get("/webapp/get-filter-options", {
      params: { franchise_id },
    });
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};

const createRequestAndHireTrainerApi = async (
  requestData: any,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.post(
      "/create-and-hire-trainer",
      requestData
    );
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};

const getTrainersWithStatusApi = async (
  userId: number,
  status: string[],
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.get(
      `/webapp/get-hired-and-archived-trainers/${userId}`,
      {
        params: {
          status: status,
        },
        paramsSerializer: (params) => {
          return qs.stringify(params);
        },
      }
    );
    successCallback(response);
    return response;
  } catch (error) {
    errorCallback(error);
  }
};

const updateOpportunityStatusApi = async (
  oppId: number,
  status: string,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.put(
      `/requestOpportunities/status/${oppId}`,
      { status }
    );
    successCallback(response);
    return response;
  } catch (error) {
    errorCallback(error);
  }
};

const addSpecialityApi = async (
  requestData: any,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.post("/speciality", requestData);
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};
const getSpecialityApi = async (
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void,
  headers?: any
) => {
  try {
    let response = await axiosInstance.get("/speciality", { headers });
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};
const getLanguageApi = async (
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void,
  headers?: any
) => {
  try {
    let response = await axiosInstance.get("/language", { headers });
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};
const addCertificateApi = async (
  requestData: any,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.post("/certification", requestData);
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};
const getCertificateApi = async (
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.get("/certification-for-admin");
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};

const getCategoryApi = async (
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.get("/categories/by/admin");
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};

const postTrainerAddDetailsApi = async (
  id: number,
  body: any,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void,
  headers?: any
) => {
  try {
    let response = await axiosInstance.post(`/trainer/details/${id}`, body, {
      headers,
    });
    successCallback(response);
    return response;
  } catch (error) {
    errorCallback(error);
    return error;
  }
};

export {
  getTrainersApis,
  getFilterOptionsApi,
  createRequestAndHireTrainerApi,
  getTrainersWithStatusApi,
  updateOpportunityStatusApi,
  addSpecialityApi,
  addCertificateApi,
  getCertificateApi,
  getSpecialityApi,
  getLanguageApi,
  getCategoryApi,
  postTrainerAddDetailsApi,
};
