import {createAsyncThunk} from '@reduxjs/toolkit';
import API from '../../../environment/Api';

// Fetch user data by user ID
export const fetchUserDataThunk = createAsyncThunk(
  'user/fetchuser',
  async (user, {rejectWithValue}) => {
    try {
      let response = await API.get(`getuserbyuserid/${user}`);
      console.log('response in API call', response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : 'Server Error',
      );
    }
  },
);

// Authenticate new user
export const authNewUserThunk = createAsyncThunk(
  'user/createuser',
  async (data, {rejectWithValue}) => {
    try {
      let response = await API.post(`authenticateuser`, data);
      console.log('=========================auth', response.data);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : 'Server Error',
      );
    }
  },
);

// Fetch district data for a specific state (hardcoded state ID = 20)
export const fetchDistrictDataThunk = createAsyncThunk(
  'user/district',
  async (user, {rejectWithValue}) => {
    try {
      let response = await API.get(`getdistrictsofstate/${20}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : 'Server Error',
      );
    }
  },
);

// Fetch block data based on district ID (state ID = 20 is hardcoded)
export const fetchBlockDataThunk = createAsyncThunk(
  'user/block',
  async (districtId, {rejectWithValue}) => {
    try {
      let response = await API.get(`getblocksofdistricts/${20}/${districtId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : 'Server Error',
      );
    }
  },
);

// Create a new user
export const createNewUserThunk = createAsyncThunk(
  'user/newuser',
  async (data, {rejectWithValue}) => {
    try {
      let response = await API.post(`createnewuser`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : 'Server Error',
      );
    }
  },
);

// Fetch total coins for a user
export const fetchUserTotalCoinsThunk = createAsyncThunk(
  'user/fetchtotalcoins',
  async (userid, {rejectWithValue}) => {
    try {
      let response = await API.get(`getTotalCoins/${userid}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : 'Server Error',
      );
    }
  },
);
