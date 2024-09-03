import {
  SET_ALL_PACKAGES_STATS,
  SET_COUPON,
  SET_PACKAGES,
  SET_PACKAGE_CATEGORIED,
  SET_PACKAGE_FACTOR,
  SET_USER_PACKAGE,
  SET_USER_PAYMENTS,
} from "../types";

const INITIAL_STATE = {
  list: [],
  packageCategoryList: [],
  factor: {},
  coupon: {},
  userPackages: [],
  allPackageStats: [],
  userPaymentsHistory: [],
};

const packageReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SET_PACKAGES:
      return {
        ...state,
        list: action.payload,
      };
    case SET_PACKAGE_CATEGORIED:
      return {
        ...state,
        packageCategoryList: action.payload,
      };
    case SET_PACKAGE_FACTOR:
      return {
        ...state,
        factor: action.payload,
      };
    case SET_COUPON:
      return {
        ...state,
        coupon: action.payload,
      };
    case SET_USER_PACKAGE:
      return {
        ...state,
        userPackages: action.payload,
      };
    case SET_ALL_PACKAGES_STATS:
      return {
        ...state,
        allPackageStats: action.payload,
      };
    case SET_USER_PAYMENTS:
      return {
        ...state,
        userPaymentsHistory: action.payload,
      };
    default:
      return state;
  }
};

export { packageReducer };
