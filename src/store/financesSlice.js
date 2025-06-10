import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api";

export const fetchFinances = createAsyncThunk(
  "finances/fetch",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.get(`${API_URL}/finances`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

export const addFinance = createAsyncThunk(
  "finances/add",
  async (finance, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.post(`${API_URL}/finances`, finance, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

export const updateFinance = createAsyncThunk(
  "finances/update",
  async (finance, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.put(`${API_URL}/finances/${finance.id}`, finance, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

export const deleteFinance = createAsyncThunk(
  "finances/delete",
  async (id, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      await axios.delete(`${API_URL}/finances/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

const financesSlice = createSlice({
  name: "finances",
  initialState: { 
    items: [
      // Демо данные для финансов
      {
        id: '1',
        type: 'income',
        category: 'Услуги',
        description: 'Стрижка и укладка - Анна Петрова',
        amount: 3500,
        date: '2025-06-08',
        clientName: 'Анна Петрова',
        paymentMethod: 'Наличные'
      },
      {
        id: '2',
        type: 'income',
        category: 'Услуги',
        description: 'Маникюр - Елена Смирнова',
        amount: 2800,
        date: '2025-06-07',
        clientName: 'Елена Смирнова',
        paymentMethod: 'Карта'
      },
      {
        id: '3',
        type: 'expense',
        category: 'Материалы',
        description: 'Покупка лаков для ногтей',
        amount: 4500,
        date: '2025-06-06',
        clientName: '',
        paymentMethod: 'Карта'
      },
      {
        id: '4',
        type: 'income',
        category: 'Услуги',
        description: 'Мужская стрижка - Дмитрий Волков',
        amount: 1800,
        date: '2025-06-05',
        clientName: 'Дмитрий Волков',
        paymentMethod: 'Наличные'
      },
      {
        id: '5',
        type: 'expense',
        category: 'Аренда',
        description: 'Аренда помещения за июнь',
        amount: 25000,
        date: '2025-06-01',
        clientName: '',
        paymentMethod: 'Перевод'
      },
      {
        id: '6',
        type: 'expense',
        category: 'Коммунальные',
        description: 'Электричество и вода',
        amount: 3200,
        date: '2025-06-03',
        clientName: '',
        paymentMethod: 'Карта'
      },
      {
        id: '7',
        type: 'income',
        category: 'Услуги',
        description: 'SPA процедуры - Ольга Кузнецова',
        amount: 8500,
        date: '2025-06-09',
        clientName: 'Ольга Кузнецова',
        paymentMethod: 'Карта'
      }
    ], 
    loading: false,
    searchQuery: '',
    filterType: 'all', // 'all', 'income', 'expense'
    filterCategory: 'all',
    filterPaymentMethod: 'all',
    sortBy: 'date',
    viewMode: 'cards' // 'cards' или 'table'
  },
  reducers: {
    addFinanceLocal: (state, action) => {
      const finance = {
        id: Date.now().toString(),
        type: action.payload.type || 'income',
        category: action.payload.category || '',
        description: action.payload.description || '',
        amount: action.payload.amount || 0,
        date: action.payload.date || new Date().toISOString().split('T')[0],
        clientName: action.payload.clientName || '',
        paymentMethod: action.payload.paymentMethod || 'Наличные'
      };
      state.items.push(finance);
    },
    updateFinanceLocal: (state, action) => {
      const index = state.items.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    deleteFinanceLocal: (state, action) => {
      state.items = state.items.filter((f) => f.id !== action.payload);
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilterType: (state, action) => {
      state.filterType = action.payload;
    },
    setFilterCategory: (state, action) => {
      state.filterCategory = action.payload;
    },
    setFilterPaymentMethod: (state, action) => {
      state.filterPaymentMethod = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFinances.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchFinances.pending, (state) => {
        state.loading = true;
      })
      .addCase(addFinance.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateFinance.fulfilled, (state, action) => {
        const index = state.items.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteFinance.fulfilled, (state, action) => {
        state.items = state.items.filter((f) => f.id !== action.payload);
      });
  },
});

export const { 
  addFinanceLocal, 
  updateFinanceLocal, 
  deleteFinanceLocal, 
  setSearchQuery, 
  setFilterType, 
  setFilterCategory,
  setFilterPaymentMethod,
  setSortBy,
  setViewMode 
} = financesSlice.actions;

export default financesSlice.reducer;
