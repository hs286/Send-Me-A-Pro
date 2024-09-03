import { toast } from "react-toastify";
import {
  getAllFranchisesApi,
  getCountriesApi,
  getFranchiseByCountryIdApi,
  guestUpApi,
  postManualSigninApi,
  postManualSignupApi,
  postOauthApi,
  postUpdateProfileApi,
  postAppleSignupApi,
  userForgotPassApi,
  userResetPassApi,
  changeUserAvatarApi,
  getCityListApi,
  getStateListApi,
  updateUserProfileApi,
  changeOldPasswordApi,
  getUserProfileApi,
  getProfileApi,
  updateUserBankDetailApi,
} from "../apis";
import {
  CityModal,
  CountryModal,
  ForgotPasswordState,
  FranchiseModal,
  GuestUpModal,
  OAuthModal,
  ProviderSignupModal,
  ResetPasswordState,
  SigninModal,
  SignupModal,
  StateModal,
  TrainerModal,
  UpdateBankDetailModal,
  UpdatePasswordModal,
  UpdateProfileModal,
  UserModal,
  UsetInfoUpdateModal,
} from "../modals";
import { AppDispatch } from "../store";
import {
  SET_CITIES,
  SET_COUNTRIES,
  SET_FRANCHISE_LIST,
  SET_STATES,
  SET_USER,
} from "../types";
import { setLoaderStateAction } from "./loaderActions";

const getCountriesAction = (
  successCallback?: (response: Array<CountryModal>) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    getCountriesApi(
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            dispatch({ type: SET_COUNTRIES, payload: result });
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

const getFranchiseByCountryIdAction = (
  country_id: number = 1,
  shouldStoreInRedux: boolean = true,
  successCallback?: (response: Array<FranchiseModal>) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    getFranchiseByCountryIdApi(
      country_id,
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            if (shouldStoreInRedux) {
              dispatch({ type: SET_FRANCHISE_LIST, payload: result });
            }
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

const getAllFranchisesAction = (
  successCallback?: (response: Array<FranchiseModal>) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    dispatch(setLoaderStateAction(true));
    getAllFranchisesApi(
      (response: any) => {
        if (response) {
          dispatch(setLoaderStateAction(false));
          const {
            status,
            result,
          }: { status: any; result: Array<FranchiseModal> } = response?.data;
          if (status === 200) {
            dispatch({ type: SET_FRANCHISE_LIST, payload: result });
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
        dispatch(setLoaderStateAction(false));
        console.error(error);
        toast.error(error.message);
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );
  };
};

const manualSignupAction = (
  body: SignupModal,
  successCallback?: (response: UserModal) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    postManualSignupApi(
      body,
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            dispatch({ type: SET_USER, payload: result.user });
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
        toast.error(error?.response?.data?.result);
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );
  };
};

const manualSigninAction = (
  body: SigninModal,
  successCallback?: (response: UserModal) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    postManualSigninApi(
      body,
      async (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            dispatch({ type: SET_USER, payload: result.user });
            await localStorage.setItem(
              "userProfile",
              JSON.stringify(result.user)
            );
            await localStorage.setItem("isTemp", JSON.stringify(false));
            if (result && result?.token) {
              await localStorage.setItem("token", result?.token?.token);
            }
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
        toast.error(error?.response?.data?.result);
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );
  };
};

const postOauthAction = (
  provider: string,
  body: OAuthModal,
  successCallback?: (response: UserModal) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    postOauthApi(
      provider,
      body,
      async (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            if (result && result.user) {
              if (successCallback) {
                successCallback(result);
              }
            }
            return result;
          } else {
            toast.error("Something went wrong");
            console.error(response);
          }
        }
      },
      (error: any) => {
        console.error(error);
        toast.error(error?.response?.data?.result);
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );
  };
};

const guestUpAction = (
  body: GuestUpModal,
  successCallback?: (response: any) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    guestUpApi(
      body,
      async (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
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
        toast.error(error?.response?.data?.result);
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );
  };
};

const updateGoogleFacebookUserAction = (
  id: number,
  body: UsetInfoUpdateModal,
  successCallback?: (response: UserModal) => void,
  errorCallback?: (error: any) => void,
  headers?: any
) => {
  return (dispatch: AppDispatch) => {
    postUpdateProfileApi(
      id,
      body,
      async (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            if (successCallback) {
              successCallback(result);
            }
            return result;
          } else {
            toast.error("Something went wrong");
            console.error(response);
          }
        }
      },
      (error: any) => {
        console.error(error);
        toast.error(error?.response?.data?.result);
        if (errorCallback) {
          errorCallback(error);
        }
      },
      headers
    );
  };
};

const appleSignupAction = (
  body: any,
  successCallback?: (response: UserModal) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    postAppleSignupApi(
      body,
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            dispatch({ type: SET_USER, payload: result });
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
        toast.error(error?.response?.data?.result);
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );
  };
};

const userForgotPassAction = (
  body: ForgotPasswordState,
  successCallback?: (response: UserModal) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    userForgotPassApi(
      body,
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            if (successCallback) {
              successCallback(status);
              toast.success(result);
            }
          } else {
            toast.error("Something went wrong");
            console.error(response);
          }
        }
      },
      (error: any) => {
        console.error(error);
        toast.error(error?.response?.data?.result);
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );
  };
};

const userResetPassAction = (
  body: ResetPasswordState,
  successCallback?: (response: UserModal) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    userResetPassApi(
      body,
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            if (successCallback) {
              successCallback(status);
              toast.success(result);
            }
          } else {
            toast.error("Something went wrong");
            console.error(response);
          }
        }
      },
      (error: any) => {
        console.error(error);
        toast.error(error?.response?.data?.result);
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );
  };
};

const updateUserAvatarAction = (
  id: number,
  data: FormData,
  successCallback: any,
  errorCallback: any
) => {
  return (dispatch: AppDispatch) => {
    changeUserAvatarApi(
      id,
      data,
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            if (successCallback) {
              successCallback(result);
              toast.success(result);
            }
          } else {
            toast.error("Something went wrong");
            console.error(response);
          }
        }
      },
      (error: any) => {
        toast.error(error?.response?.data?.result);
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );
  };
};

const getStatesAction = (
  countryId: number,
  successCallback?: (response: Array<StateModal>) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    getStateListApi(
      countryId,
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            dispatch({ type: SET_STATES, payload: result });
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
const getCitiesAction = (
  countryId: number,
  stateId: number,
  successCallback?: (response: Array<CityModal>) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    getCityListApi(
      countryId,
      stateId,
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            dispatch({ type: SET_CITIES, payload: result });
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

const updateUserProfileAction = (
  userId: number,
  data: UpdateProfileModal,
  successCallback?: (response: any) => void,
  errorCallback?: (error: any) => void
) => {
  return () => {
    updateUserProfileApi(
      userId,
      data,
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
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

const changeOldPasswordAction = (
  data: UpdatePasswordModal,
  successCallback?: (response: any) => void,
  errorCallback?: (error: any) => void
) => {
  return () => {
    changeOldPasswordApi(
      data,
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            toast.success("Password updated sucessfully !");
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
        toast.error(error?.response?.data?.result);
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );
  };
};

const getUserProfileAction = (
  userId: number,
  successCallback?: (response: any) => void,
  errorCallback?: (error: any) => void
) => {
  return () => {
    getUserProfileApi(
      userId,
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
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

const getProfileDataAction = (
  id: number,
  successCallback?: (response: TrainerModal) => void,
  errorCallback?: (error: any) => void,
  headers?: any
) => {
  return (dispatch: AppDispatch) => {
    getProfileApi(
      id,
      async (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            dispatch({ type: SET_USER, payload: result });
            if (successCallback) {
              successCallback(result);
            }
            return result;
          } else {
            toast.error("Something went wrong");
            console.error(response);
          }
        }
      },
      (error: any) => {
        console.error(error);
        toast.error(error?.response?.data?.result);
        if (errorCallback) {
          errorCallback(error);
        }
      },
      headers
    );
  };
};

const updateUserBankDetailsAction = (
  userId: number,
  data: UpdateBankDetailModal,
  successCallback?: (response: any) => void,
  errorCallback?: (error: any) => void
) => {
  return () => {
    updateUserBankDetailApi(
      userId,
      data,
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
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

const providerManualSignupAction = (
  body: ProviderSignupModal,
  successCallback?: (response: UserModal) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    postManualSignupApi(
      body,
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            dispatch({ type: SET_USER, payload: result.user });
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
        toast.error(error?.response?.data?.result);
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );
  };
};

export {
  getCountriesAction,
  getFranchiseByCountryIdAction,
  manualSignupAction,
  manualSigninAction,
  postOauthAction,
  updateGoogleFacebookUserAction,
  guestUpAction,
  getAllFranchisesAction,
  appleSignupAction,
  userForgotPassAction,
  userResetPassAction,
  updateUserAvatarAction,
  getStatesAction,
  getCitiesAction,
  updateUserProfileAction,
  changeOldPasswordAction,
  getUserProfileAction,
  getProfileDataAction,
  updateUserBankDetailsAction,
  providerManualSignupAction,
};
