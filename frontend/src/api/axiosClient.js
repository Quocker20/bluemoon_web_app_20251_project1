// File: frontend/src/api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Địa chỉ Backend
  headers: {
    'Content-Type': 'application/json',
  },
  // QUAN TRỌNG: Cho phép gửi/nhận Cookie (Token) giữa 2 domain khác nhau
  withCredentials: true, 
});

export default axiosClient;