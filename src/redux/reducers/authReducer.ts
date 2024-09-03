import {
  SET_CITIES,
  SET_COUNTRIES,
  SET_FRANCHISE_LIST,
  SET_STATES,
} from "../types";

const INITIAL_STATE = {
  countries: [],
  states: [],
  cities: [],
  franchiseList: [],
};

const authReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SET_COUNTRIES:
      return {
        ...state,
        countries: action.payload,
      };
    case SET_STATES:
      return {
        ...state,
        states: action.payload,
      };
    case SET_CITIES:
      return {
        ...state,
        cities: action.payload,
      };
    case SET_FRANCHISE_LIST:
      return {
        ...state,
        franchiseList: action.payload,
      };
    default:
      return state;
  }
};

export { authReducer };
