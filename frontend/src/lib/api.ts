// src/lib/api.ts
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
});

// Interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// [NEW] Interceptor to handle expired tokens and refresh them automatically
api.interceptors.response.use(
  (response) => response, // If the response is successful, just return it
  async (error) => {
    const originalRequest = error.config;
    const { refreshToken, setTokens, logout } = useAuthStore.getState();

    // Check if the error is a 401 and we haven't already tried to refresh the token for this request
    if (error.response?.status === 401 && refreshToken && !originalRequest._retry) {
      originalRequest._retry = true; // Mark that we've tried to refresh once

      try {
        // Make a request to the token refresh endpoint
        const response = await axios.post(`${api.defaults.baseURL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access, refresh } = response.data;

        // Update the tokens in our Zustand store
        setTokens(access, refresh);

        // Update the authorization header for the original request and retry it
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If the refresh token is also invalid, log the user out
        console.error("Refresh token is invalid, logging out.", refreshError);
        logout();
        // Redirect to login page
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }

    // For any other errors, just reject the promise
    return Promise.reject(error);
  }
);


export default api;