
import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "./slices/employeeSlice";
import recruitmentReducer from "./slices/recruitmentSlice";
import attendanceReducer from "./slices/attendanceSlice";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    employees: employeeReducer,
    recruitment: recruitmentReducer,
    attendance: attendanceReducer,
    auth: authReducer,
  },
});

export default store;