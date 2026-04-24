
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser: {
      name: "Admin User",
      role: "Admin", // Admin | HR Staff | Management
      email: "admin@hsclogic.com",
    },
    isLoggedIn: true,
  },
  reducers: {
    // Switch between user roles for demo purposes
    switchRole: (state, action) => {
      state.currentUser.role = action.payload;
    },
  },
});

export const { switchRole } = authSlice.actions;
export default authSlice.reducer;