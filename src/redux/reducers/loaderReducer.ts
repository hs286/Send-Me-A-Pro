import { SET_FULL_SCREEN_LOADER } from "../types";

const INITIAL_STATE = {
  isFullScreenLoaderVisible: false,
};

const loaderReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SET_FULL_SCREEN_LOADER:
      return {
        ...state,
        isFullScreenLoaderVisible: action.payload,
      };
    default:
      return state;
  }
};

export { loaderReducer };
