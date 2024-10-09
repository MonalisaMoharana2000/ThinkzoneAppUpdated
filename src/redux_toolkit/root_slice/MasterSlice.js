// features/postsSlice.js
import {combineReducers} from '@reduxjs/toolkit';
import UserSlice from '../features/users/UserSlice';
import StudentSlice from '../features/students/StudentSlice';
import {FcmActions} from '../features/fcm/FcmSlice';

const MasterSlice = combineReducers({
  UserSlice,
  StudentSlice,
  FcmActions,
});
export default MasterSlice;
