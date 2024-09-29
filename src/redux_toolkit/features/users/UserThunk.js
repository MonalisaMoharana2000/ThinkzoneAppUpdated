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
