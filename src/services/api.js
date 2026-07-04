import axios from 'axios';

// Create an Axios instance with base configuration
const API = axios.create({
  baseURL: '', // Empty base URL allows relative paths (resolved against the current window host)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach local token to requests (useful for authenticating requests, demonstrating real-world pattern)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Product Services
export const productAPI = {
  // Get all products, optionally filtered by search text or category
  getAll: async (search = '', category = '') => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    const response = await API.get('/api/products', { params });
    return response.data;
  },

  // Get details for a single product by its ID
  getById: async (id) => {
    const response = await API.get(`/api/products/${id}`);
    return response.data;
  },

  // Add a new product (Admin)
  create: async (productData) => {
    const response = await API.post('/api/products', productData);
    return response.data;
  },

  // Update an existing product (Admin)
  update: async (id, productData) => {
    const response = await API.put(`/api/products/${id}`, productData);
    return response.data;
  },

  // Delete a product (Admin)
  delete: async (id) => {
    const response = await API.delete(`/api/products/${id}`);
    return response.data;
  }
};

// Authentication Services
export const authAPI = {
  // Sign Up a new user
  register: async (name, email, password) => {
    const response = await API.post('/api/users/register', { name, email, password });
    return response.data;
  },

  // Log in an existing user
  login: async (email, password) => {
    const response = await API.post('/api/users/login', { email, password });
    return response.data;
  }
};

export default API;
