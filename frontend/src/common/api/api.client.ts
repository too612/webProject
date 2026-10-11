import axios, { AxiosError, type AxiosInstance } from 'axios';
import { useAuthStore } from '../auth/authStore';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    authRevision?: number;
  }
}

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api';

const client: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  (config) => {
    config.authRevision = useAuthStore.getState().authRevision;
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => {
    if (response.data?.statusCode === 401 && response.config.url !== '/auth/login'
      && response.config.authRevision !== undefined) {
      useAuthStore.getState().clearAuth(response.config.authRevision);
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401 && error.config?.url !== '/auth/login'
      && error.config?.authRevision !== undefined) {
      useAuthStore.getState().clearAuth(error.config.authRevision);
    }
    return Promise.reject(error);
  }
);

export default client;
