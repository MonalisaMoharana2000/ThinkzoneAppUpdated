// features/postsSlice.js
import {combineReducers} from '@reduxjs/toolkit';
import UserSlice from '../features/users/UserSlice';

const MasterSlice = combineReducers({
  UserSlice,
});
export default MasterSlice;
