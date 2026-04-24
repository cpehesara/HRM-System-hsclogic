
import { createSlice } from "@reduxjs/toolkit";
import { mockCandidates } from "../../data/mockData";

const recruitmentSlice = createSlice({
  name: "recruitment",
  initialState: {
    candidates: mockCandidates,
    selectedCandidate: null,
    filterStatus: "All",
  },
  reducers: {
    // Adds a new candidate application
    addCandidate: (state, action) => {
      state.candidates.push(action.payload);
    },
    // Updates an existing candidate record
    updateCandidate: (state, action) => {
      const index = state.candidates.findIndex(
        (c) => c.id === action.payload.id
      );
      if (index !== -1) {
        state.candidates[index] = action.payload;
      }
    },
    // Updates only the status of a candidate
    updateCandidateStatus: (state, action) => {
      const candidate = state.candidates.find(
        (c) => c.id === action.payload.id
      );
      if (candidate) {
        candidate.status = action.payload.status;
      }
    },
    // Removes a candidate record
    deleteCandidate: (state, action) => {
      state.candidates = state.candidates.filter(
        (c) => c.id !== action.payload
      );
    },
    // Sets which candidate is currently selected
    setSelectedCandidate: (state, action) => {
      state.selectedCandidate = action.payload;
    },
    // Sets the filter for candidate status
    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
    },
  },
});

export const {
  addCandidate,
  updateCandidate,
  updateCandidateStatus,
  deleteCandidate,
  setSelectedCandidate,
  setFilterStatus,
} = recruitmentSlice.actions;

export default recruitmentSlice.reducer;