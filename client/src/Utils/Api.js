import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export const productAPI = {
 
  getAllProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

 
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },


  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  
  updateProduct: async (id, productData) => {
    const response = await api.patch(`/products/${id}`, productData);
    return response.data;
  },

 
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default api;