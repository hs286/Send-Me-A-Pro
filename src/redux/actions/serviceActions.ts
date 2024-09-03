import { toast } from "react-toastify";
import { getServicesListApi } from "../apis";
import { ServiceModal } from "../modals";
import { AppDispatch } from "../store";
import { SET_SERVICES } from "../types";

const getServiceListAction = (
  franchise_id: number,
  successCallback?: (response: Array<ServiceModal>) => void,
  errorCallback?: (error: any) => void
) => {
  return (dispatch: AppDispatch) => {
    getServicesListApi(
      franchise_id,
      (response: any) => {
        if (response) {
          const { status, result } = response?.data;
          if (status === 200) {
            dispatch({ type: SET_SERVICES, payload: result });
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

export { getServiceListAction };
