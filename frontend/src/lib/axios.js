import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL || "/api";
const normalizedApiUrl = configuredApiUrl.replace(/\/+$/, "");
const apiBaseUrl = normalizedApiUrl.endsWith("/api") ? normalizedApiUrl : `${normalizedApiUrl}/api`;

const axiosInstance = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true
});

axiosInstance.interceptors.request.use(
    async (config) => {
        try {
            const token = await window.Clerk?.session?.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Error getting Clerk token:", error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
