import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios/dist/node/axios.cjs";

const API_URL = "http://localhost:4000/api";

export const fetchRecords = createAsyncThunk(
  "records/fetch",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.get(`${API_URL}/records`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

export const createRecord = createAsyncThunk(
  "records/create",
  async (record, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.post(`${API_URL}/records`, record, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

export const updateRecordAsync = createAsyncThunk(
  "records/update",
  async (record, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.put(`${API_URL}/records/${record.id}`, record, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

export const deleteRecordAsync = createAsyncThunk(
  "records/delete",
  async (id, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      await axios.delete(`${API_URL}/records/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

export const recordsSlice = createSlice({
  name: "records",
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecords.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchRecords.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRecord.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateRecordAsync.fulfilled, (state, action) => {
        const idx = state.items.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteRecordAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r.id !== action.payload);
      });
  },
});
export default recordsSlice.reducer;
