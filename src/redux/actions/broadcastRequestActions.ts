import { postCreateRequestOpportunityApi } from "../apis";
import { AppDispatch } from "../store";
import { SET_BROADCAST_REQUEST_MODAL_IS_VISIVLE } from "../types";

const setBroadcastRequestIsVisibleAction = (payload: boolean) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: SET_BROADCAST_REQUEST_MODAL_IS_VISIVLE, payload });
  };
};

const postCreateRequestOpportunityAction = (
  payload: any,
  successCallback?: any,
  errorCallback?: any
) => {
  return async (dispatch: AppDispatch) => {
    let response: any = await postCreateRequestOpportunityApi(
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
  setBroadcastRequestIsVisibleAction,
  postCreateRequestOpportunityAction,
};
