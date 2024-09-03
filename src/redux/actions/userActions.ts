import {
  TOGGLE_FRANCHISE_MODAL_STATE,
  TOGGLE_SIGN_IN_SIGN_UP_MODAL_STATE,
} from "../types";

const toggleFranchiseModalStateAction = (payload: boolean) => {
  return (dispatch: any) => {
    dispatch({ type: TOGGLE_FRANCHISE_MODAL_STATE, payload });
  };
};

const toggleSignInSignUpModalStateAction = (payload: boolean) => {
  return (dispatch: any) => {
    dispatch({ type: TOGGLE_SIGN_IN_SIGN_UP_MODAL_STATE, payload });
  };
};

export { toggleFranchiseModalStateAction, toggleSignInSignUpModalStateAction };
