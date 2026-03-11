import { createSlice } from "@reduxjs/toolkit";

// Try to load user from localStorage
const storedUser = localStorage.getItem("user");

const initialState = storedUser ? JSON.parse(storedUser) : null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      const userData = action.payload;
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    },
    removeUser: () => {
      localStorage.removeItem("user");
      return null;
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
