import { createSlice } from "@reduxjs/toolkit";

export const USER_CREDENTIALS = [
  {
    email: "admin@hsclogic.com",
    password: "admin123",
    name: "Admin User",
    role: "Admin",
  },
  {
    email: "hr@hsclogic.com",
    password: "hr123",
    name: "Nimasha Fernando",
    role: "HR Staff",
  },
  {
    email: "manager@hsclogic.com",
    password: "manager123",
    name: "Ruwan Bandara",
    role: "Management",
  },
];

const authSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser: null,
    isLoggedIn: false,
    loginError: "",
  },
  reducers: {
    login: (state, action) => {
      const { email, password } = action.payload;
      const match = USER_CREDENTIALS.find(
        (u) => u.email === email && u.password === password
      );
      if (match) {
        state.currentUser = { name: match.name, role: match.role, email: match.email };
        state.isLoggedIn = true;
        state.loginError = "";
      } else {
        state.loginError = "Invalid email or password.";
      }
    },
    logout: (state) => {
      state.currentUser = null;
      state.isLoggedIn = false;
      state.loginError = "";
    },
    clearLoginError: (state) => {
      state.loginError = "";
    },
  },
});

export const { login, logout, clearLoginError } = authSlice.actions;
export default authSlice.reducer;
