import { cloneDeep } from "lodash";
import {
  SET_SESSIONS_LIST,
  UPDATE_SESSIONS_LIST,
  UPDATE_SESSION_DATA_IN_STORE,
} from "../types";

const INITIAL_STATE = {
  sessionsList: [],
  currentPage: 1,
  totalPages: 1,
};

const SessionsReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SET_SESSIONS_LIST:
      return {
        ...state,
        sessionsList: action.payload.sessions,
        currentPage: action.payload.page,
        totalPages: action.payload.lastPage,
      };

    case UPDATE_SESSIONS_LIST:
      return {
        ...state,
        sessionsList: [...state.sessionsList, ...action.payload.sessions],
        currentPage: action.payload.page,
        totalPages: action.payload.lastPage,
      };

    case UPDATE_SESSION_DATA_IN_STORE:
      const sessionListCopy: Array<any> = cloneDeep(state.sessionsList);
      const { sessionId, data } = action.payload;
      const sessionIndex: number = sessionListCopy.findIndex(
        (session: any) => session.id === sessionId
      );
      if (sessionIndex !== -1) {
        sessionListCopy[sessionIndex] = {
          ...sessionListCopy[sessionIndex],
          ...data,
        };
      }
      return {
        ...state,
        sessionsList: sessionListCopy,
      };

    default:
      return state;
  }
};

export { SessionsReducer };
