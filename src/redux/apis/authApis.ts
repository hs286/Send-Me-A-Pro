import { axiosInstance } from "../axios";
import {
  ForgotPasswordState,
  GuestUpModal,
  OAuthModal,
  ResetPasswordState,
  SigninModal,
  SignupModal,
  UpdateBankDetailModal,
  UpdatePasswordModal,
  UpdateProfileModal,
  UsetInfoUpdateModal,
} from "../modals";

const getCountriesApi = async (
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.get("/country");
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};

const checkUserProfileApi = async (
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.get("/users/profile");
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};

const getFranchiseByCountryIdApi = async (
  country_id: number,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.get(
      `/franchise/by/country/${country_id}`
    );
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};

const getAllFranchisesApi = async (
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.get(`webapp/get-all-franchises`);
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};

const postManualSignupApi = async (
  body: SignupModal,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.post("/users/signup", body);
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};

const postManualSigninApi = async (
  body: SigninModal,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.post("/users/signin", body);
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};

const postOauthApi = async (
  provider: string,
  body: OAuthModal,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.post(`/oauth/${provider}`, body);
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};

const postUpdateProfileApi = async (
  id: number,
  body: UsetInfoUpdateModal,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void,
  headers?: any
) => {
  try {
    let response = await axiosInstance.post(`/users/profile/${id}`, body, {
      headers,
    });
    successCallback(response);
    return response;
  } catch (error) {
    errorCallback(error);
  }
};

const guestUpApi = async (
  body: GuestUpModal,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.post(`/users/guestup`, body);
    successCallback(response);
    return response;
  } catch (error) {
    errorCallback(error);
  }
};

const postAppleSignupApi = async (
  body: any,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.post("/sign-in-with-apple", body);
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};

const userForgotPassApi = async (
  body: ForgotPasswordState,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.post("/users/forgotPassword", body);
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};

const userResetPassApi = async (
  body: ResetPasswordState,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.post("/users/changePassword", body);
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};

const changeUserAvatarApi = async (
  id: number,
  data: FormData,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.post(
      `/users/profile/avatar/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};

const getStateListApi = async (
  countryId: number,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.get("/geo", {
      params: {
        all: true,
        country: countryId,
      },
    });
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};

const getCityListApi = async (
  countryId: number,
  stateId: number,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.get("/geo", {
      params: {
        all: true,
        country: countryId,
        state: stateId,
      },
    });
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};

const updateUserProfileApi = async (
  id: number,
  data: UpdateProfileModal,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.post(`/users/profile/${id}`, data);
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};

const changeOldPasswordApi = async (
  data: UpdatePasswordModal,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.post(`/users/changeOldPassword`, data);
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};

const getUserProfileApi = async (
  id: number,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.get(`/users/profile/${id}`);
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};

const getProfileApi = async (
  id: number,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void,
  headers?: any
) => {
  try {
    let response = await axiosInstance.get(`/users/profile/${id}`, {
      headers,
    });

    successCallback(response);
    return response;
  } catch (error) {
    errorCallback(error);
  }
};

const updateUserBankDetailApi = async (
  id: number,
  data: UpdateBankDetailModal,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.post(`/users/profile/${id}`, data);
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};

export {
  getCountriesApi,
  getFranchiseByCountryIdApi,
  postManualSignupApi,
  postManualSigninApi,
  postOauthApi,
  checkUserProfileApi,
  postUpdateProfileApi,
  guestUpApi,
  getAllFranchisesApi,
  postAppleSignupApi,
  userForgotPassApi,
  userResetPassApi,
  changeUserAvatarApi,
  getStateListApi,
  getCityListApi,
  updateUserProfileApi,
  changeOldPasswordApi,
  getUserProfileApi,
  getProfileApi,
  updateUserBankDetailApi,
};
