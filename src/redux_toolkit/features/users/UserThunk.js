import {createAsyncThunk} from '@reduxjs/toolkit';
import API from '../../../environment/Api';

export const fetchUserDataThunk = createAsyncThunk(
  'user/fetchuser',
  async user => {
    // let response = await api.post("/authenticateuser", user);
    let response = await API.get(`getuserbyuserid/mkhbhhhyh.7683939162@tz.in`);
    // authUserCred/:userid/:pswd
    return response.data;
  },
);

export const authNewUserThunk = createAsyncThunk(
  'user/createuser',
  async data => {
    let response = await API.post(`authenticateuser`, data);
    console.log('=========================auth', response.data);

    return {
      data: response.data,
      status: response.status,
    };
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

//Rewards

export const fetchUserTotalCoinsThunk = createAsyncThunk(
  'user/fetchtotalcoins',
  async userid => {
    let response = await API.get(`getTotalCoins/${userid}`);

    return response.data;
  },
);

export const fetchPaymentDetails = createAsyncThunk(
  'user/payment',
  async studentid => {
    let response = await API.get(
      `getalltchpaymentdetailsbystudentid/${studentid}`,
    );

    return response.data;
  },
);
export const savePaymentDetails = createAsyncThunk(
  'user/payment',
  async data => {
    let response = await API.post(`savetchpaymentdetails`, data);
    return response.data;
  },
);
