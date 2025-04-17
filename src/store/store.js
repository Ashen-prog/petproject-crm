import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./AuthSlice";
import dateReducer from "./dateSlice";
import recordsReducer from "./recordsSlice";

const store = configureStore({
  reducer: {
    auth: AuthReducer,
    date: dateReducer,
    records: recordsReducer,
  },
});

export default store;
