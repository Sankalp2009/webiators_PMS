import axios from "axios";

const API_BASE_URL = "https://webiators-pms.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const productAPI = {
  getAllProducts: async () => {
    const response = await api.get("/api/v1/products");
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/api/v1/products/${id}`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await api.post("/api/v1/products", productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.patch(`/api/v1/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/api/v1/products/${id}`);
    return response.data;
  },
};

export default api;