import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios/dist/node/axios.cjs";

const API_URL = "http://localhost:4000/api";

export const fetchEmployees = createAsyncThunk(
  "employees/fetch",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.get(`${API_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

export const addEmployee = createAsyncThunk(
  "employees/add",
  async (employee, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.post(`${API_URL}/employees`, employee, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  "employees/delete",
  async (id, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      await axios.delete(`${API_URL}/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

const employeesSlice = createSlice({
  name: "employees",
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.items = state.items.filter((e) => e.id !== action.payload);
      });
  },
});

export default employeesSlice.reducer;
