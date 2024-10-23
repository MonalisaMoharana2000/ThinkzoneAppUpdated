import {createAsyncThunk} from '@reduxjs/toolkit';
import API from '../../../environment/Api';

export const fetchUserDataThunk = createAsyncThunk(
  'user/fetchuser',
  async userid => {
    // let response = await api.post("/authenticateuser", user);
    let response = await API.get(`getuserbyuserid/${userid}`);
    // authUserCred/:userid/:pswd
    return response.data;
  },
);

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
      if (error.response) {
        return rejectWithValue({
          error: error.response.data,
          status: error.response.status,
        });
      } else {
        return rejectWithValue({
          error: error.message,
        });
      }
    }
  },
);

export const fetchDistrictDataThunk = createAsyncThunk(
  'user/district',
  async user => {
    let response = await API.get(`getdistrictsofstate/${20}`);
    // authUserCred/:userid/:pswd
    return response.data;
  },
);

export const fetchBlockDataThunk = createAsyncThunk(
  'user/block',
  async districtId => {
    let response = await API.get(`getblocksofdistricts/${20}/${districtId}`);
    // authUserCred/:userid/:pswd
    return response.data;
  },
);

export const createNewUserThunk = createAsyncThunk(
  'user/newuser',
  async data => {
    let response = await API.post(`createnewuser`, data);
    // authUserCred/:userid/:pswd
    return response.data;
  },
);

export const phoneNumberVerifyThunk = createAsyncThunk(
  'user/userphoneverify',
  async data => {
    let response = await API.post(`verifyUserCredentials`, data);
    // authUserCred/:userid/:pswd
    return response.data;
  },
);

export const updateUserThunk = createAsyncThunk(
  'user/userupdate',
  async data => {
    let response = await API.put(`updateuser/${data.userid}`, data.user);
    // authUserCred/:userid/:pswd
    return response.data;
  },
);

//Rewards

export const fetchUserTotalCoinsThunk = createAsyncThunk(
  'user/fetchtotalcoins',
  async userid => {
    let response = await API.get(`getTotalCoins/${userid}`);

    return response.data;
  },
);

export const getUserProgressbyid = async data =>
  await API.get(
    `getTchTrainingProgress/${data.userid}/${data.usertype}/${data.trainingType}/"od"`,
  );
