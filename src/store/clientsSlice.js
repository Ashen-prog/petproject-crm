import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:4000/api";

export const fetchClients = createAsyncThunk(
  "clients/fetch",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.get(`${API_URL}/clients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

export const addClient = createAsyncThunk(
  "clients/add",
  async (client, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.post(`${API_URL}/clients`, client, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

export const updateClient = createAsyncThunk(
  "clients/update",
  async (client, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.put(`${API_URL}/clients/${client.id}`, client, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

export const deleteClient = createAsyncThunk(
  "clients/delete",
  async (id, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      await axios.delete(`${API_URL}/clients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

const clientsSlice = createSlice({
  name: "clients",
  initialState: {    items: [
      // Демо данные для частных клиентов (B2C)
      {
        id: '1',
        name: 'Анна Петрова',
        contactPerson: 'Анна Петрова',
        phone: '+7 (495) 123-45-67',
        email: 'anna.petrova@gmail.com',
        address: 'г. Москва, ул. Тверская, д. 10, кв. 25',
        category: 'VIP',
        status: 'active',
        totalSpent: 150000,
        lastVisit: '2025-06-08',
        notes: 'Предпочитает утренние визиты, любит процедуры для лица',
        priority: 'high',
        source: 'Рекомендация'
      },
      {
        id: '2', 
        name: 'Елена Смирнова',
        contactPerson: 'Елена Смирнова',
        phone: '+7 (812) 987-65-43',
        email: 'elena.smirnova@yandex.ru',
        address: 'г. СПб, пр. Невский, д. 45, кв. 12',
        category: 'Постоянный',
        status: 'active',
        totalSpent: 80000,
        lastVisit: '2025-06-05',
        notes: 'Регулярно делает маникюр и педикюр',
        priority: 'medium',
        source: 'Сайт'
      },
      {
        id: '3',
        name: 'Дмитрий Волков',
        contactPerson: 'Дмитрий Волков',
        phone: '+7 (999) 555-77-88',
        email: 'dmitry.volkov@mail.ru',
        address: 'г. Казань, ул. Баумана, д. 25, кв. 8',
        category: 'Обычный',
        status: 'potential',
        totalSpent: 30000,
        lastVisit: '2025-05-20',
        notes: 'Заинтересован в мужских стрижках и уходе за бородой',
        priority: 'medium',
        source: 'Соцсети'
      },
      {
        id: '4',
        name: 'Ольга Кузнецова',
        contactPerson: 'Ольга Кузнецова',
        phone: '+7 (343) 444-22-11',
        email: 'olga.k@gmail.com', 
        address: 'г. Екатеринбург, ул. Ленина, д. 15, кв. 33',
        category: 'VIP',
        status: 'active',
        totalSpent: 200000,
        lastVisit: '2025-06-09',
        notes: 'Постоянный клиент, предпочитает комплексный уход',
        priority: 'high',
        source: 'Рекомендация'
      }
    ], 
    loading: false,    searchQuery: '',
    filterStatus: 'all',
    filterCategory: 'all',
    sortBy: 'name',
    viewMode: 'cards' // 'cards' или 'table'
  },
  reducers: {
    addClientLocal: (state, action) => {
      const client = {
        id: Date.now().toString(),
        name: action.payload.name || '',        contactPerson: action.payload.contactPerson || '',
        phone: action.payload.phone || '',
        email: action.payload.email || '',
        address: action.payload.address || '',
        category: action.payload.category || 'Обычный',
        status: action.payload.status || 'potential',
        totalSpent: action.payload.totalSpent || 0,
        lastVisit: new Date().toISOString().split('T')[0],
        notes: action.payload.notes || '',
        priority: action.payload.priority || 'medium',
        source: action.payload.source || ''
      };
      state.items.push(client);
    },
    updateClientLocal: (state, action) => {
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    deleteClientLocal: (state, action) => {
      state.items = state.items.filter((c) => c.id !== action.payload);
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
    },    setFilterCategory: (state, action) => {
      state.filterCategory = action.payload;
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
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
      })
      .addCase(addClient.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

export const { 
  addClientLocal, 
  updateClientLocal, 
  deleteClientLocal, 
  setSearchQuery, 
  setFilterStatus, 
  setFilterCategory, 
  setSortBy,
  setViewMode 
} = clientsSlice.actions;

export default clientsSlice.reducer;
