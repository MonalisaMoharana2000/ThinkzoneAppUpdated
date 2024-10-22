import axios from 'axios';

//Version to update in the profile page for user
export const Version = {
  version: '2.0.6',
};

// Create axios instance
const API = axios.create({
  // baseURL: 'https://thinkzone.in.net/thinkzone/', //New Tests
  baseURL: 'https://thinkzone.co/thinkzone/', // Production New
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Set a reasonable timeout of 10 seconds
});

export default API;
