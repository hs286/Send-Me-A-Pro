import { toast } from "react-toastify";
import {
  addCertificateApi,
  addSpecialityApi,
  createRequestAndHireTrainerApi,
  getCategoryApi,
  getCertificateApi,
  getFilterOptionsApi,
  getLanguageApi,
  getSpecialityApi,
  getTrainersApis,
  getTrainersWithStatusApi,
  postTrainerAddDetailsApi,
  updateOpportunityStatusApi,
} from "../apis";
import {
  CertificateModal,
  FilterOptionsModal,
  GetTrainerFilterModal,
  SpecialityModal,
  TrainerModal,
} from "../modals";
import { AppDispatch } from "../store";
import {
  SET_FILTER_OPTIONS,
  SET_TRAINERS,
  SET_CATEGORIES_FILTERS,
  SET_SPECIALITY_FILTERS,
  SET_CERTIFICATE_FILTERS,
  SET_LANGUAGE_FILTERS,
  RESET_FILTERS,
  UPDATE_TRAINERS_LIST,
  SET_ACTIVE_TRAINERS_LIST,
  SET_SPECIALITIES_IN_FILTER_OPTIONS,
  SET_SPECIALITIES_FILTER_OPTIONS,
  NEW_SPECIALITY,
  SET_TRAINER_SPECIALITIES,
  NEW_CERTIFICATE,
  SET_TRAINER_CERTIFICATES,
  SET_TRAINER_LANGUAGES,
  SET_TRAINER_CATEGORIES,
} from "../types";
import { setLoaderStateAction } from "./loaderActions";
const getTrainersAction = (
  params: GetTrainerFilterModal,
  successCallback?: (response: Array<TrainerModal>) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    dispatch(setLoaderStateAction(true));
    getTrainersApis(
      params,
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            dispatch(setLoaderStateAction(false));
            if (params.page === 1) {
              dispatch({
                type: SET_TRAINERS,
                payload: {
                  list: result.data,
                  lastPage: result.lastPage,
                  page: params.page + 1,
                },
              });
            } else {
              dispatch({
                type: UPDATE_TRAINERS_LIST,
                payload: {
                  list: result.data,
                  lastPage: result.lastPage,
                  page: params.page + 1,
                },
              });
            }
            if (successCallback) {
              successCallback(result.data);
            }
          } else {
            dispatch(setLoaderStateAction(false));
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

const getFilterOptionsAction = (
  franchise_id: number,
  successCallback?: (response: FilterOptionsModal) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    dispatch(setLoaderStateAction(true));
    getFilterOptionsApi(
      franchise_id,
      (response: any) => {
        if (response) {
          dispatch(setLoaderStateAction(false));
          const { status, result } = response?.data;
          if (status === 200) {
            dispatch({ type: SET_FILTER_OPTIONS, payload: result });
            dispatch({
              type: SET_SPECIALITIES_FILTER_OPTIONS,
              payload: result?.specialities,
            });
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

const setCategoryFilter = (data: Array<number>) => {
  return (dispatch: AppDispatch) => {
    dispatch({
      type: SET_CATEGORIES_FILTERS,
      payload: data,
    });
  };
};

const setSpecialityFilter = (data: Array<number>) => {
  return (dispatch: AppDispatch) => {
    dispatch({
      type: SET_SPECIALITY_FILTERS,
      payload: data,
    });
  };
};

const setCertificateFilter = (data: Array<number>) => {
  return (dispatch: AppDispatch) => {
    dispatch({
      type: SET_CERTIFICATE_FILTERS,
      payload: data,
    });
  };
};

const setLanguageFilter = (data: Array<number>) => {
  return (dispatch: AppDispatch) => {
    dispatch({
      type: SET_LANGUAGE_FILTERS,
      payload: data,
    });
  };
};

const resetFiltersAction = () => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: RESET_FILTERS });
  };
};

const addSpecialityAction = (
  params: any,
  successCallback?: (response: SpecialityModal) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    dispatch(setLoaderStateAction(true));
    addSpecialityApi(
      params,
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            dispatch(setLoaderStateAction(false));
            dispatch({ type: NEW_SPECIALITY, payload: result });
            getSpecialityApi(
              async (response: any) => {
                if (response) {
                  const { status, result } = response?.data;
                  if (status === 200) {
                    dispatch({
                      type: SET_TRAINER_SPECIALITIES,
                      payload: result,
                    });
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
          } else {
            dispatch(setLoaderStateAction(false));
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

const addCertificatesAction = (
  params: any,
  successCallback?: (response: CertificateModal) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    dispatch(setLoaderStateAction(true));
    addCertificateApi(
      params,
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            dispatch(setLoaderStateAction(false));
            dispatch({ type: NEW_CERTIFICATE, payload: result });
          } else {
            dispatch(setLoaderStateAction(false));
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

const getTrainerSpecialities = (
  successCallback?: (response: FilterOptionsModal) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    getCategoryApi(
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            const specialities = result
              ?.map((item: any) => item?.CategorySpecialities)
              .flat();
            dispatch({ type: SET_TRAINER_SPECIALITIES, payload: specialities });
            if (successCallback) {
              successCallback(result);
            }
          } else {
            console.error(response);
          }
        }
      },
      (error: any) => {
        console.error(error);
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );
  };
};
const getTrainerCertificates = (
  successCallback?: (response: FilterOptionsModal) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    getCertificateApi(
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            dispatch({ type: SET_TRAINER_CERTIFICATES, payload: result });
            if (successCallback) {
              successCallback(result);
            }
          } else {
            console.error(response);
          }
        }
      },
      (error: any) => {
        console.error(error);
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );
  };
};
const getTrainerLanguages = (
  successCallback?: (response: FilterOptionsModal) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    getLanguageApi(
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            dispatch({ type: SET_TRAINER_LANGUAGES, payload: result });
            if (successCallback) {
              successCallback(result);
            }
          } else {
            console.error(response);
          }
        }
      },
      (error: any) => {
        console.error(error);
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );
  };
};
const getTrainerCategories = (
  successCallback?: (response: FilterOptionsModal) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    getCategoryApi(
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            dispatch({ type: SET_TRAINER_CATEGORIES, payload: result });
            if (successCallback) {
              successCallback(result);
            }
          } else {
            console.error(response);
          }
        }
      },
      (error: any) => {
        console.error(error);
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );
  };
};

const createRequestAndHireTrainerAction = (
  requestData: GetTrainerFilterModal,
  successCallback?: (response: Array<TrainerModal>) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    dispatch(setLoaderStateAction(true));
    createRequestAndHireTrainerApi(
      requestData,
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            dispatch(setLoaderStateAction(false));
            if (successCallback) {
              successCallback(result);
            }
          } else {
            dispatch(setLoaderStateAction(false));
            console.error(response);
          }
        }
      },
      (error: any) => {
        dispatch(setLoaderStateAction(false));
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );
  };
};

const getTrainersWithStatusAction = (
  userId: number,
  status: string[],
  successCallback?: (response: any) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    dispatch(setLoaderStateAction(true));
    getTrainersWithStatusApi(
      userId,
      status,
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            dispatch(setLoaderStateAction(false));
            dispatch({ type: SET_ACTIVE_TRAINERS_LIST, payload: result });
            if (successCallback) {
              successCallback(result);
            }
          } else {
            dispatch(setLoaderStateAction(false));
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

const updateOpportunityStatusAction = (
  oppId: number,
  status: string,
  successCallback?: (response: any) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    dispatch(setLoaderStateAction(true));
    updateOpportunityStatusApi(
      oppId,
      status,
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            dispatch(setLoaderStateAction(false));
            if (successCallback) {
              successCallback(result);
            }
          } else {
            dispatch(setLoaderStateAction(false));
            console.error(response);
          }
        }
      },
      (error: any) => {
        dispatch(setLoaderStateAction(false));
        toast.error(error.message);
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );
  };
};

const setSpecialitiesInFilterOptionsAction = (data: Array<SpecialityModal>) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: SET_SPECIALITIES_IN_FILTER_OPTIONS, payload: data });
  };
};

const postTrainerAddDetailsAction = (
  id: number,
  payload: any,
  successCallback?: any,
  errorCallback?: any
) => {
  return async (dispatch: AppDispatch) => {
    let response: any = await postTrainerAddDetailsApi(
      id,
      payload,
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
        toast.error(err.message);
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

export {
  getTrainersAction,
  getFilterOptionsAction,
  setCategoryFilter,
  setSpecialityFilter,
  setCertificateFilter,
  setLanguageFilter,
  resetFiltersAction,
  createRequestAndHireTrainerAction,
  getTrainersWithStatusAction,
  updateOpportunityStatusAction,
  addSpecialityAction,
  addCertificatesAction,
  getTrainerSpecialities,
  getTrainerCertificates,
  getTrainerLanguages,
  getTrainerCategories,
  setSpecialitiesInFilterOptionsAction,
  postTrainerAddDetailsAction,
};
