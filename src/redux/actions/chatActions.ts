import { getChatListApi, getChatWithApi } from "../apis";
import { AppDispatch } from "../store";
import { SET_CHAT_LIST } from "../types";

const getChatListAction = (userId: number) => {
  return async (dispatch: AppDispatch) => {
    let data = await getChatListApi(userId);
    if (data?.status === 200) {
      dispatch({ type: SET_CHAT_LIST, payload: data.result });
    }
  };
};

export const getChatWithAction = (userId: number) => {
  return async (dispatch: AppDispatch, getState: any) => {
    try {
      const response = await getChatWithApi(userId);
      if (response.status === 200) {
        return response.result;
      }
      return response;
    } catch (err) {
      return false;
    }
  };
};

export { getChatListAction };
