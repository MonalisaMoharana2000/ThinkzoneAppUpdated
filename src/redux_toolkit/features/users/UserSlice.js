import {createSlice} from '@reduxjs/toolkit';
import {fetchUserDataThunk} from './UserThunk';

const initialState = {
  user: [],
  loading: false,
  status: '',
  message: '',
};

const UserSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {},

  extraReducers: builder => {
    builder
      .addCase(fetchUserDataThunk.pending, (state, action) => {
        state.user = [];
        state.loading = true;
        state.status = action.meta.requestStatus;
        state.message = 'loading';
      })
      .addCase(fetchUserDataThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.status = 'succeeded';
        state.message = 'Data fetched successfully';
      })
      .addCase(fetchUserDataThunk.rejected, (state, action) => {
        state.user = [];
        state.loading = false;
        state.status = 'failed';
        state.message = 'Error fetching data';
      });
  },
});

export default UserSlice.reducer;
