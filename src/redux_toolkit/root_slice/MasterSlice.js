// features/postsSlice.js
import {combineReducers} from '@reduxjs/toolkit';
import UserSlice from '../features/users/UserSlice';
import StudentSlice from '../features/students/StudentSlice';

const MasterSlice = combineReducers({
  UserSlice,
  StudentSlice,
});
export default MasterSlice;
