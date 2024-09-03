import { AppDispatch } from "../store";
import { SET_FULL_SCREEN_LOADER } from "../types";

const setLoaderStateAction = (payload: boolean) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: SET_FULL_SCREEN_LOADER, payload });
  };
};

export { setLoaderStateAction };
