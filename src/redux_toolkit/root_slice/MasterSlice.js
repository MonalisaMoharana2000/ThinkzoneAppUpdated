// features/postsSlice.js
import {combineReducers} from '@reduxjs/toolkit';
import UserSlice from '../features/users/UserSlice';
import StudentSlice from '../features/students/StudentSlice';
import TrainingSlice from '../features/training/TrainingSlice';

const MasterSlice = combineReducers({
  UserSlice,
  StudentSlice,
  TrainingSlice,
});
export default MasterSlice;
