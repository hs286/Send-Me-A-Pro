import { SET_SERVICES } from "../types";

const INITIAL_STATE = {
  list: [],
};

const serviceReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SET_SERVICES:
      return {
        ...state,
        list: action.payload,
      };

    default:
      return state;
  }
};

export { serviceReducer };
