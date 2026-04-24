
import { createSlice } from "@reduxjs/toolkit";
import { mockEmployees } from "../../data/mockData";

const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    employees: mockEmployees,
    selectedEmployee: null,
  },
  reducers: {
    // Adds a brand new employee to the list
    addEmployee: (state, action) => {
      state.employees.push(action.payload);
    },
    // Updates an existing employee record
    updateEmployee: (state, action) => {
      const index = state.employees.findIndex(
        (e) => e.id === action.payload.id
      );
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
    },
    // Sets employee status to Inactive
    deactivateEmployee: (state, action) => {
      const employee = state.employees.find((e) => e.id === action.payload);
      if (employee) {
        employee.status = "Inactive";
      }
    },
    // Reactivates an inactive employee
    activateEmployee: (state, action) => {
      const employee = state.employees.find((e) => e.id === action.payload);
      if (employee) {
        employee.status = "Active";
      }
    },
    // Sets which employee is currently being viewed/edited
    setSelectedEmployee: (state, action) => {
      state.selectedEmployee = action.payload;
    },
  },
});

export const {
  addEmployee,
  updateEmployee,
  deactivateEmployee,
  activateEmployee,
  setSelectedEmployee,
} = employeeSlice.actions;

export default employeeSlice.reducer;