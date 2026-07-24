import axios from 'axios';
import { store } from '../store/store';
import { logout } from '../store/slices/authSlice';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

import { AxiosError, AxiosResponse } from 'axios';

// Response interceptor to handle global errors like 401 Unauthorized
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      // Dispatch logout action to clear state and redirect to login
      store.dispatch(logout());
      
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);
