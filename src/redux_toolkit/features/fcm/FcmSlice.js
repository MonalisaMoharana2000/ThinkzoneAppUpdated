import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '../../../utils/AsyncStorage';

// Define an async thunk for getting FCM messages
export const getFcmMessage = createAsyncThunk(
  'fcm/getFcmMessage',
  async payload => {
    await AsyncStorage.storeObject('@fcm_message', payload); // Storing the message
    return payload; // Return the payload
  },
);

// Define an async thunk for getting FCM messages from storage
export const getFcmMessageFromStore = createAsyncThunk(
  'fcm/getFcmMessageFromStore',
  async () => {
    const res = await AsyncStorage.getObject('@fcm_message');
    return res; // Return the retrieved message
  },
);

// Define an async thunk for clearing FCM messages
export const clearFcmMessage = createAsyncThunk(
  'fcm/clearFcmMessage',
  async () => {
    await AsyncStorage.removeValue('@fcm_message');
    return []; // Return an empty array after clearing
  },
);

const initialState = {
  fcmMessage: [],
  isLoading: false,
  error: null, // Change to null to better represent no error
};

const FcmSlice = createSlice({
  name: 'FcmSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getFcmMessage.pending, state => {
        state.isLoading = true;
      })
      .addCase(getFcmMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fcmMessage = action.payload;
      })
      .addCase(getFcmMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message; // Capture the error message
      })
      .addCase(getFcmMessageFromStore.pending, state => {
        state.isLoading = true;
      })
      .addCase(getFcmMessageFromStore.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fcmMessage = action.payload;
      })
      .addCase(getFcmMessageFromStore.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message; // Capture the error message
      })
      .addCase(clearFcmMessage.pending, state => {
        state.isLoading = true;
      })
      .addCase(clearFcmMessage.fulfilled, state => {
        state.isLoading = false;
        state.fcmMessage = []; // Reset the message array
      })
      .addCase(clearFcmMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message; // Capture the error message
      });
  },
});

export const FcmActions = {
  getFcmMessage,
  getFcmMessageFromStore,
  clearFcmMessage,
};

export default FcmSlice.reducer;
