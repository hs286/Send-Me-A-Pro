import { SET_BROADCAST_REQUEST_MODAL_IS_VISIVLE } from "../types";

const INITIAL_STATE = {
  isBroadcastRequestModalVisible: false,
};

const broadcastRequestReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SET_BROADCAST_REQUEST_MODAL_IS_VISIVLE:
      return {
        ...state,
        isBroadcastRequestModalVisible: action.payload,
      };

    default:
      return state;
  }
};

export { broadcastRequestReducer };
