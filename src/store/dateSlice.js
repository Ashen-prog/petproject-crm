import { createSlice } from "@reduxjs/toolkit";

const dateSlice = createSlice({
  name: "date",
  initialState: {
    currentDate: Date.now(),
  },
  reducers: {
    setCurrentDate: (state, action) => {
      state.currentDate = new Date(action.payload).getTime();
    },
  },
});

export const { setCurrentDate } = dateSlice.actions;
export default dateSlice.reducer;
