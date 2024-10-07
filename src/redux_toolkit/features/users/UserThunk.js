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

//Rewards

export const fetchUserTotalCoinsThunk = createAsyncThunk(
  'user/fetchtotalcoins',
  async userid => {
    let response = await API.get(`getTotalCoins/${userid}`);

    return response.data;
  },
);
