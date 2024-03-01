import thunk from "redux-thunk";
import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import { USER_LOGOUT } from "../actions/actionsTypes";
import commonReducer from "./commonReducer";

const middleware = [thunk];

const reducers = combineReducers({
  common: commonReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === USER_LOGOUT) {
    return reducers(undefined, action);
  }
  return reducers(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      middleware: middleware,
      serializableCheck: false,
    }),
});

export default store;
