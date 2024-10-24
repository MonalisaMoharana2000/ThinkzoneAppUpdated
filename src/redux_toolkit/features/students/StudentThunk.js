import {createAsyncThunk} from '@reduxjs/toolkit';
import API from '../../../environment/Api';

export const fetchStudentsDataThunk = createAsyncThunk(
  'student/fetchstudents',
  async userid => {
    let response = await API.get(`getactivemaasterstudentsbyuserid/${userid}`);
    // console.log('student----->', response.data);

    return response.data;
  },
);

export const createStudentsDataThunk = createAsyncThunk(
  'student/createstudents',
  async studentDetails => {
    let response = await API.post(`savemasterstudent`, studentDetails);
    // console.log('student----->', response.data);

    return response.data;
  },
);

export const deleteStudentsDataThunk = createAsyncThunk(
  'student/deletestudents',
  async datas => {
    let response = await API.delete(
      `deletemasterstudent/${datas.userid}/${datas.studentid}/${datas.studentname}/${datas.class}/${datas.otp_isverified}`,
    );
    // console.log('student----->', response.data);

    return response.data;
  },
);

export const updateStudentsDataThunk = createAsyncThunk(
  'student/updatestudents',
  async ({studentId, studentUpdateDetails}) => {
    const response = await API.put(
      `updatemasterstudent/${studentId}`,
      studentUpdateDetails,
    );
    console.log('Updated student----->', response.data);
    return response.data;
  },
);

export const fetchStudentsAttendanceThunk = createAsyncThunk(
  'student/attendance',
  async data => {
    let response = await API.get(
      `getlast7attendancedates/${data.userid}/${data.attendancedate}`,
    );
    // console.log('student----->', response.data);
    return response.data;
  },
);
