import { axiosInstance } from "../axios";
import {
  BuyPackageModal,
  CreateClientSecretMetadataModal,
  CreateStripePlanModal,
  CreateSubscriptionModal,
  PackageFactorModal,
  UpdateUpfrontUserPackageModal,
  UserModal,
} from "../modals";

export const postCreateUpfrontUserPackageApi = async (
  factor: PackageFactorModal
) => {
  try {
    let response = await axiosInstance.post(`/sca/userpackage/create-upfront`, {
      packageInfo: factor,
    });
    let { result } = response?.data;
    return result;
  } catch (error) {
    throw error;
  }
};

export const postCreateClientSecretApi = async (
  factor: PackageFactorModal,
  profile: UserModal,
  metadata: CreateClientSecretMetadataModal
) => {
  try {
    let response = await axiosInstance.post(
      `/sca/client_secret?amount=${factor.totalPriceWithDiscount}&currency=USD&custId=${profile?.stripe_id}`,
      {
        metadata,
      }
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const getPaymentIntentApi = async (
  paymentIntentId: string,
  customer_id: number,
  franchise_id: number
) => {
  try {
    let response = await axiosInstance.post(`/sca/payment_intent`, {
      paymentIntentId,
      customer_id,
      franchise_id,
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const postUpdateUpfrontUserPackageApi = async (
  data: UpdateUpfrontUserPackageModal,
  successCallback: (data: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.post(
      `/sca/userpackage/update/upfront`,
      data
    );
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};

export const postCreateStripePlanApi = async (body: CreateStripePlanModal) => {
  try {
    let response = await axiosInstance.post("/sca/create_stripe_plan", body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const putBuyPackageApi = async (
  userId: number,
  packageId: number,
  body: BuyPackageModal
) => {
  try {
    let response = await axiosInstance.put(
      `/package/buy/${userId}/${packageId}`,
      body
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserPackageByPlanIdApi = async (planId: string) => {
  try {
    let response = await axiosInstance.get(
      `sca/userpackage/getByPlanId/${planId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postCreateSubscriptionApi = async (
  body: CreateSubscriptionModal
) => {
  try {
    let response = await axiosInstance.post("/sca/create_subscription", body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postUpdateSubscriptionUserPackageApi = async (
  subscription_id: string,
  user_package_id: number
) => {
  try {
    let response = await axiosInstance.post("/sca/userpackage/update", {
      subscription_id,
      user_package_id,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCouponValidateApi = async (
  couponCode: string,
  franchise_id: number,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.get(
      `coupon/valid/${couponCode}/${franchise_id}`
    );
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};

export const getPaymentLinkApi = async (
  factor: PackageFactorModal,
  successCallback: (response: any) => void,
  errorCallback: (error: any) => void
) => {
  try {
    let response = await axiosInstance.post("/webapp/get-payment-link", {
      factor,
    });
    successCallback(response);
  } catch (error) {
    errorCallback(error);
  }
};
