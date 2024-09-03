import moment from "moment";
import { toast } from "react-toastify";
import {
  getAllPackageStatsApi,
  getCustomPackageApi,
  getEligiblePackageListApi,
  getPackagesByServiceApi,
  getPackageStatsApi,
  getUserPackageApi,
  getUserPaymentHistoryApi,
  postPackageFactorApi,
} from "../apis";
import {
  PackageCategoryModal,
  PackageFactorModal,
  PackageModal,
  PackageStatsModal,
} from "../modals";
import { AppDispatch } from "../store";
import {
  SET_ALL_PACKAGES_STATS,
  SET_PACKAGE_CATEGORIED,
  SET_PACKAGE_FACTOR,
  SET_USER_PACKAGE,
  SET_USER_PAYMENTS,
} from "../types";
import { setLoaderStateAction } from "./loaderActions";

const getPackagesByServiceAction = (
  franchise_id: number,
  service_id: number,
  successCallback?: (response: Array<PackageCategoryModal>) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    getPackagesByServiceApi(
      franchise_id,
      service_id,
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            dispatch({ type: SET_PACKAGE_CATEGORIED, payload: result });
            if (successCallback) {
              successCallback(result);
            }
          } else {
            toast.error("Something went wrong");
            console.error(response);
          }
        }
      },
      (error: any) => {
        console.error(error);
        toast.error(error.message);
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );
  };
};

const updatePackageFactorAction = (factor: PackageFactorModal) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: SET_PACKAGE_FACTOR, payload: factor });
  };
};

const getCustomPackageAction = (
  promo: string,
  successCallback?: (response: PackageModal) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    getCustomPackageApi(
      promo,
      (res) => {
        const { result } = res?.data;
        if (successCallback) {
          successCallback(result);
        }
      },
      (err) => {
        toast.error("Invaild code!");
        if (errorCallback) {
          errorCallback(err);
        }
        console.error(err);
      }
    );
  };
};

const getUserPackageAction = (
  userId: number,
  status: string,
  successCallback?: (response: PackageModal) => void,
  errorCallback?: (error: any) => void
) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoaderStateAction(true));
      let response: any = await getUserPackageApi(
        userId,
        status,
        (res) => {
          const { result } = res?.data;
          dispatch({ type: SET_USER_PACKAGE, payload: result });
          if (successCallback) {
            successCallback(result);
          }
        },
        (err) => {
          if (errorCallback) {
            errorCallback(err);
          }
          dispatch({ type: SET_USER_PACKAGE, payload: [] });
          console.error(err);
        }
      );
      dispatch(setLoaderStateAction(false));
      if (response?.status === 200) {
        return response;
      }
      return [];
    } catch (error) {
      dispatch(setLoaderStateAction(false));
      console.error(error);
      return [];
    }
  };
};

const postPackageFactorAction = (
  packageId: number,
  data: any,
  successCallback?: (response: PackageFactorModal) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    postPackageFactorApi(
      packageId,
      data,
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            dispatch({ type: SET_PACKAGE_FACTOR, payload: result });
            if (successCallback) {
              successCallback(result);
            }
          } else {
            toast.error("Something went wrong");
            console.error(response);
          }
        }
      },
      (error: any) => {
        console.error(error);
        toast.error(error.message);
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );
  };
};

const getEligiblePackageListAction = (
  userId: number,
  packageTypeId: number,
  categoryId: number,
  successCallback?: (response: PackageModal) => void,
  errorCallback?: (error: any) => void
) => {
  return async (dispatch: AppDispatch) => {
    let response: any = await getEligiblePackageListApi(
      userId,
      packageTypeId,
      categoryId,
      (res) => {
        const { result } = res?.data;
        if (successCallback) {
          successCallback(result);
        }
      },
      (err) => {
        if (errorCallback) {
          errorCallback(err);
        }
        console.error(err);
      }
    );
    const { result, status } = response?.data;
    if (status === 200) {
      return result;
    } else {
      return response;
    }
  };
};

const getPackageStatsAction = (
  userId: number,
  packageId: number,
  successCallback?: (response: PackageModal) => void,
  errorCallback?: (error: any) => void
) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoaderStateAction(true));
    let response: any = await getPackageStatsApi(
      userId,
      packageId,
      (res) => {
        const { result } = res?.data;
        if (successCallback) {
          successCallback(result);
        }
        dispatch(setLoaderStateAction(false));
      },
      (err) => {
        if (errorCallback) {
          errorCallback(err);
        }
        dispatch(setLoaderStateAction(false));
        console.error(err);
      }
    );
    const { result, status } = response?.data;
    if (status === 200) {
      return result;
    } else {
      return response;
    }
  };
};

const getAllPackageStatsAction = (
  userId: number,
  successCallback?: (response: Array<PackageStatsModal>) => void,
  errorCallback?: (error: any) => void
) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoaderStateAction(true));
    getAllPackageStatsApi(
      userId,
      (res) => {
        let { result } = res?.data;
        if (result && result.length) {
          const now = moment(new Date());
          result?.map((x: PackageStatsModal) => {
            if (x?.userPackage?.expire_time) {
              let exDate = moment(
                x?.userPackage?.expire_time,
                "YYYY-MM-DD hh:mm:ss A"
              );
              let days = exDate.diff(now, "days");
              let hours = exDate.subtract(days, "days").diff(now, "hours");
              if (x.status === "ACTIVE" && days <= 0 && hours <= 0) {
                x.status = "EXPIRED";
                x.status_message = "Package Has Expired";
              }
              if (x.status === "ACTIVE" && days >= 0 && hours >= 0) {
                x.status_message = `Sessions expire in ${days} days ${hours} hours`;
              }
              if (x.status === "DEACTIVE") {
                x.status_message = "Package Has Deactivated";
              }
            }
            return x;
          });
        }
        if (successCallback) {
          successCallback(result);
        }
        dispatch({ type: SET_ALL_PACKAGES_STATS, payload: result });
        dispatch(setLoaderStateAction(false));
      },
      (err) => {
        if (errorCallback) {
          errorCallback(err);
        }
        dispatch(setLoaderStateAction(false));
        console.error(err);
      }
    );
  };
};

const getUserPaymentHistoryAction = (
  userId: number,
  successCallback?: (response: PackageModal) => void,
  errorCallback?: (error: any) => void
) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoaderStateAction(true));
      let response: any = await getUserPaymentHistoryApi(
        userId,
        (res) => {
          const { result } = res?.data;
          dispatch({ type: SET_USER_PAYMENTS, payload: result });
          if (successCallback) {
            successCallback(result);
          }
        },
        (err) => {
          if (errorCallback) {
            errorCallback(err);
          }
          dispatch({ type: SET_USER_PAYMENTS, payload: [] });
          console.error(err);
        }
      );
      dispatch(setLoaderStateAction(false));
      if (response?.status === 200) {
        return response?.data?.result || [];
      }
      return [];
    } catch (error) {
      dispatch(setLoaderStateAction(false));
      console.error(error);
      return [];
    }
  };
};

export {
  getPackagesByServiceAction,
  updatePackageFactorAction,
  getCustomPackageAction,
  postPackageFactorAction,
  getUserPackageAction,
  getEligiblePackageListAction,
  getPackageStatsAction,
  getAllPackageStatsAction,
  getUserPaymentHistoryAction,
};
