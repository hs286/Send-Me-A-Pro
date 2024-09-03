import { axiosInstance } from "../axios";

export const getPackagesByServiceApi = async (
  franchise_id: number,
  service_id: number,
  successCallback: (data: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.get(
      "/webapp/packages-by-service-category/" + franchise_id + "/" + service_id
    );
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};

export const getCustomPackageApi = async (
  promo: string,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.post("/showCustomPackage", { promo });
    successCallback(response);
  } catch (error) {
    errorCallback(errorCallback);
  }
};

export const postPackageFactorApi = async (
  packageId: number,
  data: any,
  successCallback: (data: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.post(
      `/webapp/get-package-factor/${packageId}?factor=true`,
      data
    );
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};

export const getUserPackageApi = async (
  userId: number,
  status: string,
  successCallback?: (response: any) => void,
  errorCallback?: (error: any) => void
) => {
  try {
    let url = `/package/list/${userId}`;
    if (status) {
      url = `/package/list/${userId}?status=${status}`;
    }
    let response = await axiosInstance.get(url);
    successCallback && successCallback(response);
    return response;
  } catch (error) {
    errorCallback && errorCallback(error);
    return [];
  }
};

export const getEligiblePackageListApi = async (
  userId: number,
  packageTypeId: number,
  categoryId: number,
  successCallback?: (response: any) => void,
  errorCallback?: (error: any) => void
) => {
  try {
    let url = `/eligible/package/list/${userId}/${packageTypeId}/${categoryId}`;
    let response = await axiosInstance.get(url);
    successCallback && successCallback(response);
    return response;
  } catch (error) {
    errorCallback && errorCallback(error);
    return [];
  }
};

export const getPackageStatsApi = async (
  userId: number,
  packageId: number,
  successCallback?: (response: any) => void,
  errorCallback?: (error: any) => void
) => {
  try {
    let url = `/package/stats/${userId}/${packageId}`;
    let response = await axiosInstance.get(url);
    successCallback && successCallback(response);
    return response;
  } catch (error) {
    errorCallback && errorCallback(error);
    return [];
  }
};

export const getAllPackageStatsApi = async (
  userId: number,
  successCallback?: (response: any) => void,
  errorCallback?: (error: any) => void
) => {
  try {
    let url = `all/packages/stats/${userId}`;
    let response = await axiosInstance.get(url);
    successCallback && successCallback(response);
    return response;
  } catch (error) {
    errorCallback && errorCallback(error);
    return [];
  }
};

export const getUserPaymentHistoryApi = async (
  userId: number,
  successCallback?: (response: any) => void,
  errorCallback?: (error: any) => void
) => {
  try {
    let url = `/payment/getPaymentHistory/${userId}`;
    let response = await axiosInstance.get(url);
    successCallback && successCallback(response);
    return response;
  } catch (error) {
    errorCallback && errorCallback(error);
    return [];
  }
};
