import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./AuthSlice";
import dateReducer from "./dateSlice";
import recordsReducer from "./recordsSlice";
import modalReducer from "./modalSlice";

const store = configureStore({
  reducer: {
    auth: AuthReducer,
    date: dateReducer,
    records: recordsReducer,
    modal: modalReducer,
  },
});

export default store;
