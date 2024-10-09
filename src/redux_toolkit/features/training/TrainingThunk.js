import {createAsyncThunk} from '@reduxjs/toolkit';
import API from '../../../environment/Api';

export const fetchAllModulesThunk = createAsyncThunk(
  'training/allmodules',
  async data => {
    let response = await API.get(
      `getAllModulesWithMarks/${data.userid}/${data.usertype}/${data.trainingType}/od`,
    );

    return response.data;
  },
);

export const fetchSubmodulesThunk = createAsyncThunk(
  'training/submodules',
  async moduledata => {
    let response = await API.get(
      `getAllSubmodulesAndTopics/${moduledata.userid}/${moduledata.usertype}/${moduledata.trainingType}/od/${moduledata.moduleId}`,
    );

    return response.data;
  },
);
