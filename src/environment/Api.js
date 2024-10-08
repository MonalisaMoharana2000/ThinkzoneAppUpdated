import axios from 'axios';

// Create axios instance
const API = axios.create({
  baseURL: 'https://thinkzone.in.net/thinkzone', // Ensure this is correct 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Set a reasonable timeout of 10 seconds
});

export default API;
