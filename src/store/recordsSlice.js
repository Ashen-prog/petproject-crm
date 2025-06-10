import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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
  reducers: {
    // Локальные действия для демо-режима
    addRecordLocal: (state, action) => {
      const record = {
        id: Date.now().toString(),
        ...action.payload
      };
      state.items.push(record);
    },
    updateRecordLocal: (state, action) => {
      const idx = state.items.findIndex((r) => r.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    deleteRecordLocal: (state, action) => {
      state.items = state.items.filter((r) => r.id !== action.payload);
    }
  },
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

export const { addRecordLocal, updateRecordLocal, deleteRecordLocal } = recordsSlice.actions;
export default recordsSlice.reducer;
