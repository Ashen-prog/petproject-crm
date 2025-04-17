import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  showRegistration: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.isAuth = true;
    },
    logout: (state) => {
      state.isAuth = false;
    },
    showRegistration: (state) => {
      state.showRegistration = true;
    },
    hideRegistration: (state) => {
      state.showRegistration = false;
    },
  },
});
export const { login, logout, showRegistration, hideRegistration } = authSlice.actions;
export default authSlice.reducer;
