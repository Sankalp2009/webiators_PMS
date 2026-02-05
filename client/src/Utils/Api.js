import axios from "axios";

const API_BASE_URL = "https://webiators-pms.onrender.com";
const token = localStorage.getItem("token");
// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
