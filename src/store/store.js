import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./authSlice";
import dateReducer from "./dateSlice";
import recordsReducer from "./recordsSlice";
import modalReducer from "./modalSlice";
import employeesReducer from "./employeesSlice";
import clientsReducer from "./clientsSlice";
import financesReducer from "./financesSlice";

const store = configureStore({
  reducer: {
    auth: AuthReducer,
    date: dateReducer,
    records: recordsReducer,
    modal: modalReducer,
    employees: employeesReducer,
    clients: clientsReducer,
    finances: financesReducer,
  },
});

export default store;
