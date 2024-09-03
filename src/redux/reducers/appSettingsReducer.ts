import { SET_APP_SETTINGS } from "../types";

const INITIAL_STATE = {
  appSettings: {},
};

const appSettingsReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SET_APP_SETTINGS:
      return {
        ...state,
        appSettings: action.payload,
      };

    default:
      return state;
  }
};

export { appSettingsReducer };
