import {
  SET_IS_LOGGED_IN,
  SET_SELECTED_COUNTRY,
  SET_SELECTED_FRANCHISE,
  SET_USER,
  TOGGLE_FRANCHISE_MODAL_STATE,
  TOGGLE_SIGN_IN_SIGN_UP_MODAL_STATE,
} from "../types";

const INITIAL_STATE = {
  profile: {},
  isLoggedIn: false,
  selectedFranchise: {},
  selectedCountry: {},
  isChangeFranchiseModalOpen: false,
  isSignInSignUpModalOpen: false,
};

const userReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        profile: action.payload,
      };
    case SET_IS_LOGGED_IN:
      return {
        ...state,
        isLoggedIn: action.payload,
      };
    case SET_SELECTED_FRANCHISE:
      return {
        ...state,
        selectedFranchise: action.payload,
      };
    case SET_SELECTED_COUNTRY:
      return {
        ...state,
        selectedCountry: action.payload,
      };
    case TOGGLE_FRANCHISE_MODAL_STATE:
      return {
        ...state,
        isChangeFranchiseModalOpen: action.payload,
      };
    case TOGGLE_SIGN_IN_SIGN_UP_MODAL_STATE:
      return {
        ...state,
        isSignInSignUpModalOpen: action.payload,
      };
    default:
      return state;
  }
};

export { userReducer };
