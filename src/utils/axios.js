import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8082/api/v1",
  withCredentials: true,
});

// List of endpoints that don't require authentication
const publicEndpoints = ["/login", "/user/createSuperAdmin"];

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Check if the endpoint requires authentication
    if (!publicEndpoints.includes(config.url)) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await api.post("/auth/refresh-token");
        const newToken = response.data.token;

        localStorage.setItem("token", newToken);
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Handle logout or redirect to login page
        // For example:
        // window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
