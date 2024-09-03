import { toast } from "react-toastify";
import { updateSessionApi, getAllSessionsApi, setReviewApi } from "../apis";
import { ReviewsStateModel, sessionParams } from "../modals";
import {
  SET_SESSIONS_LIST,
  UPDATE_SESSIONS_LIST,
  UPDATE_SESSION_DATA_IN_STORE,
} from "../types";
import { setLoaderStateAction } from "./loaderActions";

const getSessionsAction = (
  pageNumber: number,
  successCallback?: (response: any) => void,
  errorCallback?: (error: any) => void
) => {
  return async (dispatch: any) => {
    let res: any = await getAllSessionsApi(
      pageNumber,
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            if (pageNumber === 1) {
              dispatch({
                type: SET_SESSIONS_LIST,
                payload: {
                  sessions: result.data,
                  lastPage: result.lastPage,
                  page: pageNumber + 1,
                },
              });
            } else {
              dispatch({
                type: UPDATE_SESSIONS_LIST,
                payload: {
                  sessions: result.data,
                  lastPage: result.lastPage,
                  page: pageNumber + 1,
                },
              });
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
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );
    const { result } = res?.data;
    return result;
  };
};

const updateSessionAction = (
  data: sessionParams,
  id: number,
  successCallback?: (response: any) => void,
  errorCallback?: (error: any) => void
) => {
  return async (dispatch: any) => {
    dispatch(setLoaderStateAction(true));
    let res: any = await updateSessionApi(
      data,
      id,
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
            toast.error("Something went wrong");
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
    const { status, result } = res?.data;
    if (status === 200) {
      return result;
    } else {
      return {};
    }
  };
};

const setReviewAction = (
  data: ReviewsStateModel,
  sessionData: any,
  successCallback?: (response: any) => void,
  errorCallback?: (error: any) => void
) => {
  return async (dispatch: any) => {
    dispatch(setLoaderStateAction(true));
    let res: any = await setReviewApi(
      data,
      sessionData,
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
            toast.error("Something went wrong");
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
    const { status, result } = res?.data;
    if (status === 200) {
      return result;
    } else {
      return false;
    }
  };
};

const updateSessionInStoreAction = (data: any, sessionId: number) => {
  return (dispatch: any) => {
    dispatch({
      type: UPDATE_SESSION_DATA_IN_STORE,
      payload: { sessionId, data },
    });
  };
};

const resetSessionsListAction = () => {
  return (dispatch: any) => {
    dispatch({
      type: SET_SESSIONS_LIST,
      payload: {
        sessions: [],
        lastPage: 1,
        page: 1,
      },
    });
  };
};

export {
  getSessionsAction,
  updateSessionAction,
  setReviewAction,
  updateSessionInStoreAction,
  resetSessionsListAction,
};
