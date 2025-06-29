import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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
  initialState: { 
    items: [
      // Демо данные для начала
      {
        id: '1',
        name: 'Анна Иванова',
        position: 'Менеджер',
        phone: '+7 (999) 123-45-67',
        email: 'anna@company.ru',
        avatar: null
      },
      {
        id: '2', 
        name: 'Петр Сидоров',
        position: 'Разработчик',
        phone: '+7 (999) 765-43-21',
        email: 'petr@company.ru',
        avatar: null
      },
      {
        id: '3',
        name: 'Мария Петрова', 
        position: 'Дизайнер',
        phone: '+7 (999) 555-66-77',
        email: 'maria@company.ru',
        avatar: null
      }
    ], 
    loading: false,
    searchQuery: '',
    sortBy: 'name'
  },
  reducers: {
    // Локальные действия для демо-режима
    addEmployeeLocal: (state, action) => {
      const employee = {
        id: Date.now().toString(),
        name: action.payload.name || '',
        position: action.payload.position || '',
        phone: action.payload.phone || '',
        email: action.payload.email || '',
        avatar: null
      };
      state.items.push(employee);
    },
    updateEmployeeLocal: (state, action) => {
      const index = state.items.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    deleteEmployeeLocal: (state, action) => {
      state.items = state.items.filter((e) => e.id !== action.payload);
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    }
  },
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

export const { addEmployeeLocal, updateEmployeeLocal, deleteEmployeeLocal, setSearchQuery, setSortBy } = employeesSlice.actions;
export default employeesSlice.reducer;
