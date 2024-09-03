import { toast } from "react-toastify";
import {
  getPaymentIntentApi,
  getUserPackageByPlanIdApi,
  postCreateClientSecretApi,
  postCreateStripePlanApi,
  postCreateSubscriptionApi,
  postCreateUpfrontUserPackageApi,
  postUpdateSubscriptionUserPackageApi,
  postUpdateUpfrontUserPackageApi,
  putBuyPackageApi,
} from "../apis";
import {
  BuyPackageModal,
  CreateClientSecretMetadataModal,
  CreateStripePlanModal,
  CreateSubscriptionModal,
  PackageFactorModal,
  UpdateUpfrontUserPackageModal,
  UserModal,
} from "../modals";
import { AppDispatch } from "../store";
import { SET_COUPON } from "../types";
import { getCouponValidateApi, getPaymentLinkApi } from "../apis/checkoutApis";

const getUpfrontClientSecretAction = async (
  factor: PackageFactorModal,
  profile: UserModal
) => {
  try {
    let upfrontUserPackage = await postCreateUpfrontUserPackageApi(factor);
    if (upfrontUserPackage) {
      let clientSecretMetadata: CreateClientSecretMetadataModal = {
        package_id: upfrontUserPackage.package_id,
        user_package: upfrontUserPackage.id,
        customer_id: profile?.id,
        franchise_id: factor.data.franchise_id,
        coupon_id: factor.coupon_id,
        tax_id: factor.appliedTaxId,
        tax_percentage: factor.appliedTaxPercentage,
        platform: "webapp",
        provider: profile.provider,
      };
      let clientSecret = await postCreateClientSecretApi(
        factor,
        profile,
        clientSecretMetadata
      );
      return { clientSecret, upfrontUserPackage };
    }
  } catch (error) {
    throw error;
  }
};

const postUpdateUpfrontUserPackageAction = (
  data: UpdateUpfrontUserPackageModal,
  successCallback?: (response: any) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    postUpdateUpfrontUserPackageApi(
      data,
      (response) => {
        if (response) {
          const { result } = response.data;
          if (successCallback) {
            successCallback(result);
          }
        }
      },
      (error) => {
        if (errorCallback) {
          console.error(error);
          errorCallback(error);
        }
      }
    );
  };
};

const getPaymentIntentAction = async (
  paymentIntentId: string,
  customer_id: number,
  franchise_id: number
) => {
  try {
    let response = await getPaymentIntentApi(
      paymentIntentId,
      customer_id,
      franchise_id
    );
    return response?.payment_intent;
  } catch (error) {
    throw error;
  }
};

const subscriptionPurchaseAction = async (
  factor: PackageFactorModal,
  profile: UserModal
) => {
  try {
    let createStripePlanBody: CreateStripePlanModal = {
      description: factor.data.description,
      stripeMonthly: factor.stripeMonthly,
      franchiseID: factor.data.franchise_id,
      payment_periodicity: "monthly",
      price_currency_code: profile.Country.currency,
      customerId: profile.id,
      country: profile.Country,
    };
    let stripePlanResponse = await postCreateStripePlanApi(
      createStripePlanBody
    );
    let putButPackageBody: BuyPackageModal = {
      planId: stripePlanResponse.userPlan.id,
      upfront: false,
      coupon_id: factor?.coupon_id,
    };
    let buyPackageResponse = await putBuyPackageApi(
      profile.id,
      factor.data.id,
      putButPackageBody
    );
    let userPackage = await getUserPackageByPlanIdApi(putButPackageBody.planId);

    return {
      stripePlanResponse,
      buyPackageResponse,
      userPackage,
    };
  } catch (error) {
    throw error;
  }
};

const subscriptionCheckoutAction = async (
  factor: PackageFactorModal,
  profile: UserModal,
  paymentMethod: any,
  userPackage: any,
  stripePlanResponse: any
) => {
  try {
    let createSubscriptionBody: CreateSubscriptionModal = {
      customerId: profile.stripe_id,
      priceId: stripePlanResponse.userPlan.id,
      month: factor.data.month,
      paymentMethodId: paymentMethod.id,
      metadata: {
        plan_id: stripePlanResponse.userPlan.id,
        customer_id: profile.id,
        franchise_id: factor.data.franchise_id,
        package_id: userPackage.result[0].package_id,
        user_package: userPackage.result[0].id,
        platform: "webapp",
        provider: profile.provider,
      },
      franchise_id: factor.data.franchise_id,
      coupon_id: factor.coupon_id,
    };
    let subscription = await postCreateSubscriptionApi(createSubscriptionBody);
    await postUpdateSubscriptionUserPackageApi(
      subscription.id,
      userPackage.result[0].id
    );
    return subscription;
  } catch (error) {
    throw error;
  }
};

const applyCouponAction = (
  couponCode: string,
  franchise_id: number,
  successCallback?: (response: any) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    getCouponValidateApi(
      couponCode,
      franchise_id,
      (response) => {
        if (response) {
          let { result } = response.data;
          if (result && result.code) {
            dispatch({ type: SET_COUPON, payload: result });
            if (successCallback) {
              successCallback(result);
            }
          } else {
            dispatch({ type: SET_COUPON, payload: {} });
            toast.error("Invalid Coupon");
          }
        }
      },
      (error) => {
        toast.error("Invalid Coupon");
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );
  };
};

const makeCouponEmptyAction = () => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: SET_COUPON, payload: {} });
  };
};

const getPaymentLinkAction = (
  factor: PackageFactorModal,
  successCallback?: (response: any) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    getPaymentLinkApi(
      factor,
      (response: any) => {
        const { result } = response.data;
        if (successCallback) {
          successCallback(result);
        }
      },
      (error) => {
        console.error(error);
        toast.error(error.message);
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );
  };
};

export {
  getUpfrontClientSecretAction,
  postUpdateUpfrontUserPackageAction,
  getPaymentIntentAction,
  subscriptionPurchaseAction,
  subscriptionCheckoutAction,
  applyCouponAction,
  makeCouponEmptyAction,
  getPaymentLinkAction,
};
