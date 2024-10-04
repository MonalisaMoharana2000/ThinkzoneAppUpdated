import {createSlice} from '@reduxjs/toolkit';
import {
  fetchStudentsDataThunk,
  createStudentsDataThunk,
  deleteStudentsDataThunk,
  updateStudentsDataThunk,
  fetchStudentsAttendanceThunk,
} from './StudentThunk';

const initialState = {
  students: [],
  loading: false,
  status: '',
  message: '',
  attendancedate: [],
};

const StudentSlice = createSlice({
  name: 'studentSlice',
  initialState,
  reducers: {},

  extraReducers: builder => {
    builder
      .addCase(fetchStudentsDataThunk.pending, (state, action) => {
        state.students = [];
        state.loading = true;
        state.status = action.meta.requestStatus;
        state.message = 'loading';
      })
      .addCase(fetchStudentsDataThunk.fulfilled, (state, action) => {
        state.students = action.payload;
        state.loading = false;
        state.status = 'succeeded';
        state.message = 'Data fetched successfully';
      })
      .addCase(fetchStudentsDataThunk.rejected, (state, action) => {
        state.students = [];
        state.loading = false;
        state.status = 'failed';
        state.message = 'Error fetching data';
      });

    // For createStudentsDataThunk
    builder
      .addCase(createStudentsDataThunk.pending, (state, action) => {
        // state.createdStudent = null;
        state.loading = true;
        state.status = 'loading';
        state.message = 'Creating student...';
      })
      .addCase(createStudentsDataThunk.fulfilled, (state, action) => {
        // state.createdStudent = action.payload;
        state.loading = false;
        state.status = 'succeeded';
        state.message = 'Student created successfully';
      })
      .addCase(createStudentsDataThunk.rejected, (state, action) => {
        // state.createdStudent = null;
        state.loading = false;
        state.status = 'failed';
        state.message = 'Error creating student';
      });

    // For updateStudentsDataThunk

    builder
      .addCase(updateStudentsDataThunk.pending, (state, action) => {
        // state.createdStudent = null;
        state.loading = true;
        state.status = 'loading';
        state.message = 'Creating student...';
      })
      .addCase(updateStudentsDataThunk.fulfilled, (state, action) => {
        state.students = action.payload;
        state.loading = false;
        state.status = 'succeeded';
        state.message = 'Student updated successfully';
      })
      .addCase(updateStudentsDataThunk.rejected, (state, action) => {
        // state.createdStudent = null;
        state.loading = false;
        state.status = 'failed';
        state.message = 'Error creating student';
      });

    // For deleteStudentsDataThunk

    builder
      .addCase(deleteStudentsDataThunk.pending, (state, action) => {
        // state.createdStudent = null;
        state.loading = true;
        state.status = 'loading';
        state.message = 'Creating student...';
      })
      .addCase(deleteStudentsDataThunk.fulfilled, (state, action) => {
        // state.createdStudent = action.payload;
        state.loading = false;
        state.status = 'succeeded';
        state.message = 'Student created successfully';
      })
      .addCase(deleteStudentsDataThunk.rejected, (state, action) => {
        // state.createdStudent = null;
        state.loading = false;
        state.status = 'failed';
        state.message = 'Error creating student';
      });

    //For student Attendance

    builder
      .addCase(fetchStudentsAttendanceThunk.pending, (state, action) => {
        // state.createdStudent = null;
        state.loading = true;
        state.status = 'loading';
        state.message = 'Get student attendance...';
      })
      .addCase(fetchStudentsAttendanceThunk.fulfilled, (state, action) => {
        state.attendancedate = action.payload;
        state.loading = false;
        state.status = 'succeeded';
        state.message = 'Student attendance get successfully';
      })
      .addCase(fetchStudentsAttendanceThunk.rejected, (state, action) => {
        // state.createdStudent = null;
        state.loading = false;
        state.status = 'failed';
        state.message = 'Error getting student attendance';
      });
  },
});

export default StudentSlice.reducer;
