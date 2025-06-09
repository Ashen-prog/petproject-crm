import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios/dist/node/axios.cjs";

const API_URL = "http://localhost:4000/api";

export const loginAsync = createAsyncThunk(
  "auth/loginAsync",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      return res.data.token;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login error");
    }
  }
);

export const registerAsync = createAsyncThunk(
  "auth/registerAsync",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      await axios.post(`${API_URL}/register`, { email, password });
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration error");
    }
  }
);

const initialState = {
  isAuth: false,
  token: null,
  showRegistration: false,
  error: null,
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
      state.token = null;
    },
    showRegistration: (state) => {
      state.showRegistration = true;
    },
    hideRegistration: (state) => {
      state.showRegistration = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.token = action.payload;
        state.isAuth = true;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});
export const { login, logout, showRegistration, hideRegistration } = authSlice.actions;
export default authSlice.reducer;
