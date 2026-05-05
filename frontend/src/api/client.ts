import axios, { AxiosError, type AxiosInstance } from 'axios';

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
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
        }
        return Promise.reject(error);
    },
);

export default client;
