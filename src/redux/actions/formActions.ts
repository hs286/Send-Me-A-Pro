import { getFormsApi } from "../apis";
import { AppDispatch } from "../store";

export const getFormsAction = (category_id: number) => {
  return async (dispatch: AppDispatch, getState: any) => {
    try {
      const response = await getFormsApi(category_id);
      if (response.status === 200) {
        return response.result;
      }
      return response;
    } catch (err) {
      return false;
    }
  };
};
