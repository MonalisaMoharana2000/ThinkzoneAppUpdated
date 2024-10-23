import {createSlice} from '@reduxjs/toolkit';
import {
  authNewUserThunk,
  createNewUserThunk,
  fetchBlockDataThunk,
  fetchDistrictDataThunk,
  fetchUserDataThunk,
  fetchUserTotalCoinsThunk,
  phoneNumberVerifyThunk,
  getUserProgressbyid,
  updateUserThunk,
} from './UserThunk';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  user: [],
  rewards: [],
  district: [],
  block: [],
  userProgress: [],
  loading: false,
  status: '',
  message: '',
};

const UserSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    // Add a clearUser reducer
    clearUser: state => {
      state.user = []; // Reset user to an empty array
      state.status = 'cleared';
      state.message = 'User data cleared';
      AsyncStorage.clear();
    },
  },

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

    //auth user
    builder
      .addCase(authNewUserThunk.pending, (state, action) => {
        state.user = [];
        state.loading = true;
        state.status = action.meta.requestStatus;
        state.message = 'loading';
      })
      .addCase(authNewUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.status = 'succeeded';
        state.message = 'Data fetched successfully';
      })
      .addCase(authNewUserThunk.rejected, (state, action) => {
        state.user = [];
        state.loading = false;
        state.status = 'failed';
        state.message = 'Error fetching data';
      });

    //Update user
    builder
      .addCase(updateUserThunk.pending, (state, action) => {
        state.user = [];
        state.loading = true;
        state.status = action.meta.requestStatus;
        state.message = 'loading';
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.status = 'succeeded';
        state.message = 'Data fetched successfully';
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.user = [];
        state.loading = false;
        state.status = 'failed';
        state.message = 'Error fetching data';
      });

    //create new user
    builder
      .addCase(createNewUserThunk.pending, (state, action) => {
        state.user = [];
        state.loading = true;
        state.status = action.meta.requestStatus;
        state.message = 'loading';
      })
      .addCase(createNewUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.status = 'succeeded';
        state.message = 'Data fetched successfully';
      })
      .addCase(createNewUserThunk.rejected, (state, action) => {
        state.user = [];
        state.loading = false;
        state.status = 'failed';
        state.message = 'Error fetching data';
      });

    //district

    builder
      .addCase(fetchDistrictDataThunk.pending, (state, action) => {
        state.district = [];
        state.loading = true;
        state.status = action.meta.requestStatus;
        state.message = 'loading';
      })
      .addCase(fetchDistrictDataThunk.fulfilled, (state, action) => {
        state.district = action.payload;
        state.loading = false;
        state.status = 'succeeded';
        state.message = 'Data fetched successfully';
      })
      .addCase(fetchDistrictDataThunk.rejected, (state, action) => {
        state.district = [];
        state.loading = false;
        state.status = 'failed';
        state.message = 'Error fetching data';
      });

    //block

    builder
      .addCase(fetchBlockDataThunk.pending, (state, action) => {
        state.block = [];
        state.loading = true;
        state.status = action.meta.requestStatus;
        state.message = 'loading';
      })
      .addCase(fetchBlockDataThunk.fulfilled, (state, action) => {
        state.block = action.payload;
        state.loading = false;
        state.status = 'succeeded';
        state.message = 'Data fetched successfully';
      })
      .addCase(fetchBlockDataThunk.rejected, (state, action) => {
        state.block = [];
        state.loading = false;
        state.status = 'failed';
        state.message = 'Error fetching data';
      });

    //Phone number verified

    builder
      .addCase(phoneNumberVerifyThunk.pending, (state, action) => {
        state.user = [];
        state.loading = true;
        state.status = action.meta.requestStatus;
        state.message = 'loading';
      })
      .addCase(phoneNumberVerifyThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.status = 'succeeded';
        state.message = 'Data fetched successfully';
      })
      .addCase(phoneNumberVerifyThunk.rejected, (state, action) => {
        state.user = [];
        state.loading = false;
        state.status = 'failed';
        state.message = 'Error fetching data';
      });

    //Get Total Coins
    builder
      .addCase(fetchUserTotalCoinsThunk.pending, (state, action) => {
        state.rewards = [];
        state.loading = true;
        state.status = action.meta.requestStatus;
        state.message = 'loading';
      })
      .addCase(fetchUserTotalCoinsThunk.fulfilled, (state, action) => {
        state.rewards = action.payload;
        state.loading = false;
        state.status = 'succeeded';
        state.message = 'Data fetched successfully';
      })
      .addCase(fetchUserTotalCoinsThunk.rejected, (state, action) => {
        state.rewards = [];
        state.loading = false;
        state.status = 'failed';
        state.message = 'Error fetching data';
      });
  },
});
export const {clearUser} = UserSlice.actions;
export default UserSlice.reducer;
