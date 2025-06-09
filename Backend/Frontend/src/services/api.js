import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productService = {
  getAll: () => api.get('/products'),
  getByCategory: (category) => api.get(`/products?category=${category}`),
  getById: (id) => api.get(`/products/${id}`),
};

export const offerService = {
  getDailyOffers: () => api.get('/daily-offers'),
};

export const orderService = {
  create: (orderData) => api.post('/orders', orderData),
};

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export default api;