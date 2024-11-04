// paymentsThunk.js
import {createAsyncThunk} from '@reduxjs/toolkit';
import API from '../../../environment/Api';

// Thunk to save payment details
export const savePayments = createAsyncThunk(
  'payments/savePayment',
  async (data, {rejectWithValue}) => {
    try {
      console.log('savePayments - request data:', data); // Log request data for debugging
      const response = await API.post('savetchpaymentdetails', data);
      console.log('savePayments - response:', response);

      if (response.status === 200) {
        return response.data;
      } else {
        console.warn('Unexpected response format:', response); // Log unexpected response
        return rejectWithValue(
          response.error || 'Error saving payment details.',
        );
      }
    } catch (error) {
      console.error('Save Payment Error:', error);
      return rejectWithValue('An error occurred while saving the payment.');
    }
  },
);

// Thunk to get payment details for a specific user
export const getPayments = createAsyncThunk(
  'payments/getPayment',
  async (userid, {rejectWithValue}) => {
    try {
      console.log('getPayments - request userid:', userid); // Log user ID
      const response = await API.get(`getstudentswithpaymentdetails/${userid}`);
      console.log('getPayments - response:', response);

      if (response.status === 200) {
        return response.data;
      } else {
        console.warn('Unexpected response format:', response);
        return rejectWithValue(
          response.error || 'Error retrieving payment details.',
        );
      }
    } catch (error) {
      console.error('Get Payment Error:', error);
      return rejectWithValue(
        'An error occurred while retrieving payment details.',
      );
    }
  },
);
