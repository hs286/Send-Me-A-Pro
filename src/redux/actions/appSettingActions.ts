import { toast } from "react-toastify";
import { getAppSettingByTypeApi } from "../apis";
import { AppDispatch } from "../store";
import { SET_APP_SETTINGS } from "../types";
import { setLoaderStateAction } from "./loaderActions";

const getAppSettingByTypeAction = (
  type: string,
  franchise_id: number,
  successCallback?: (response: any) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    dispatch(setAppSettingsAction({}));
    dispatch(setLoaderStateAction(true));
    getAppSettingByTypeApi(
      type,
      franchise_id,
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            dispatch(setAppSettingsAction(result));
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
        console.error(error);
        dispatch(setAppSettingsAction({}));
        dispatch(setLoaderStateAction(false));
        toast.error(error.message);
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );
  };
};

const setAppSettingsAction = (payload: any) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: SET_APP_SETTINGS, payload });
  };
};

export { getAppSettingByTypeAction };
