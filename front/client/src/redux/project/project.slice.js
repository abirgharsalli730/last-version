import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";

/*==== CreateProject =====*/

export const createProject = createAsyncThunk(
  "project/createproject",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/project/createproject", data);
      toast.success(`Project Creation success`);
      return response.data.project; // Return the project info from the response
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Define the initial state
const initialState = {
  projectsList: [],
  projectInfo: {}, // Initialize projectInfo as an empty object
  errors: null,
  loading: false,
  isActive: false,
};

// Define the project slice
const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjectInfo(state, action) {
      state.projectInfo = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createProject.fulfilled, (state, action) => {
        state.errors = null;
        state.loading = false;
        state.isActive = true;
        // Dispatch the project info to setProjectInfo reducer
        projectSlice.caseReducers.setProjectInfo(state, action);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.errors = action.payload;
      });
  },
});

export const { setProjectInfo } = projectSlice.actions;

export default projectSlice.reducer;
