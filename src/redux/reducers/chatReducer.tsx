import { SET_CHAT_LIST } from "../types";

const INITIAL_STATE = {
  chatList: {
    data: [],
    hasUnreadAdminMessage: false,
    hasUnreadMessage: false,
  },
  franchiseList: [],
};

const chatReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SET_CHAT_LIST:
      return {
        ...state,
        chatList: action.payload,
      };

    default:
      return state;
  }
};

export { chatReducer };
