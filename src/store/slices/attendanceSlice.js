
import { createSlice } from "@reduxjs/toolkit";
import { mockAttendance } from "../../data/mockData";

// Helper function to calculate hours between check-in and check-out
const calculateHours = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const [inH, inM] = checkIn.split(":").map(Number);
  const [outH, outM] = checkOut.split(":").map(Number);
  const totalMinutes = (outH * 60 + outM) - (inH * 60 + inM);
  return Math.round((totalMinutes / 60) * 100) / 100;
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    records: mockAttendance,
    selectedRecord: null,
    filterDate: "",
    filterEmployee: "",
  },
  reducers: {
    // Adds a new attendance record
    addAttendance: (state, action) => {
      const record = {
        ...action.payload,
        totalHours: calculateHours(
          action.payload.checkIn,
          action.payload.checkOut
        ),
      };
      state.records.push(record);
    },
    // Updates an existing attendance record
    updateAttendance: (state, action) => {
      const index = state.records.findIndex(
        (r) => r.id === action.payload.id
      );
      if (index !== -1) {
        state.records[index] = {
          ...action.payload,
          totalHours: calculateHours(
            action.payload.checkIn,
            action.payload.checkOut
          ),
        };
      }
    },
    // Deletes an attendance record
    deleteAttendance: (state, action) => {
      state.records = state.records.filter((r) => r.id !== action.payload);
    },
    // Sets which record is selected
    setSelectedRecord: (state, action) => {
      state.selectedRecord = action.payload;
    },
    // Sets date filter
    setFilterDate: (state, action) => {
      state.filterDate = action.payload;
    },
    // Sets employee filter
    setFilterEmployee: (state, action) => {
      state.filterEmployee = action.payload;
    },
  },
});

export const {
  addAttendance,
  updateAttendance,
  deleteAttendance,
  setSelectedRecord,
  setFilterDate,
  setFilterEmployee,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;