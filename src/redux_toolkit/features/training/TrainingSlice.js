import {createSlice} from '@reduxjs/toolkit';
import {fetchAllModulesThunk, fetchSubmodulesThunk} from './TrainingThunk';

const initialState = {
  techmodule: [],
  techsubmodule: [],
  userTraingDetails: [],
  loading: false,
  status: '',
  message: '',
};

const TrainingSlice = createSlice({
  name: 'trainingSlice',
  initialState,
  reducer: {},

  extraReducers: builder => {
    //Get AllModules
    builder
      .addCase(fetchAllModulesThunk.pending, (state, action) => {
        state.techmodule = [];
        state.loading = true;
        state.status = action.meta.requestStatus;
        state.message = 'loading';
      })
      .addCase(fetchAllModulesThunk.fulfilled, (state, action) => {
        state.techmodule = action.payload;
        state.loading = false;
        state.status = 'succeeded';
        state.message = 'Data fetched successfully';
      })
      .addCase(fetchAllModulesThunk.rejected, (state, action) => {
        state.techmodule = [];
        state.loading = false;
        state.status = 'failed';
        state.message = 'Error fetching data';
      });

    //Get submodules per module

    builder
      .addCase(fetchSubmodulesThunk.pending, (state, action) => {
        state.techsubmodule = [];
        state.loading = true;
        state.status = action.meta.requestStatus;
        state.message = 'loading';
      })
      .addCase(fetchSubmodulesThunk.fulfilled, (state, action) => {
        state.techsubmodule = action.payload;
        state.loading = false;
        state.status = 'succeeded';
        state.message = 'Data fetched successfully';
      })
      .addCase(fetchSubmodulesThunk.rejected, (state, action) => {
        state.techsubmodule = [];
        state.loading = false;
        state.status = 'failed';
        state.message = 'Error fetching data';
      });
  },
});

export default TrainingSlice.reducer;
