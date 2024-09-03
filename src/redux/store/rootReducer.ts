import { combineReducers } from "redux";
import {
  appSettingsReducer,
  authReducer,
  broadcastRequestReducer,
  chatReducer,
  loaderReducer,
  packageReducer,
  serviceReducer,
  SessionsReducer,
  trainerReducer,
  userReducer,
} from "../reducers";

const rootReducer = combineReducers({
  trainers: trainerReducer,
  auth: authReducer,
  user: userReducer,
  service: serviceReducer,
  package: packageReducer,
  loader: loaderReducer,
  appSettings: appSettingsReducer,
  chat: chatReducer,
  sessions: SessionsReducer,
  broadcastRequestReducer: broadcastRequestReducer,
});

export default rootReducer;
