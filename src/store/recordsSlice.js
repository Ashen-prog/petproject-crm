import { createSlice } from "@reduxjs/toolkit";

export const recordsSlice = createSlice({
  name: "records",
  initialState: {
    items: [],
  },
  reducers: {
    addRecord: (state, action) => {
      state.items.push(action.payload);
    },
    updateRecord: (state, action) => {
      const index = state.items.findIndex(
        (record) => record.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteRecord: (state, action) => {
      state.items = state.items.filter(
        (record) => record.id !== action.payload
      );
    },
  },
});
export const { addRecord, updateRecord, deleteRecord } = recordsSlice.actions;
export default recordsSlice.reducer;
