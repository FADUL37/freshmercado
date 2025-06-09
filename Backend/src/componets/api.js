import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para log de requisições
api.interceptors.request.use(
  (config) => {
    console.log(`📤 Enviando requisição: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para log de respostas
api.interceptors.response.use(
  (response) => {
    console.log(`📥 Resposta recebida: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Erro na resposta:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export const productService = {
  getAll: () => api.get('/products'),
  getByCategory: (category) => api.get(`/products?category=${category}`),
  getById: (id) => api.get(`/products/${id}`),
};

export const offerService = {
  getDailyOffers: () => api.get('/daily-offers'),
};

export const orderService = {
  create: (orderData) => {
    console.log('📦 Criando pedido:', orderData);
    
    return Promise.resolve({
      data: {
        success: true,
        orderId: `ORD-${Date.now()}`,
        message: 'Pedido criado com sucesso!'
      }
    });
  },
  
  sendConfirmationEmail: async (orderData) => {
    console.log('📧 Enviando email via Nodemailer com Gmail...', orderData);
    
    try {
      const response = await api.post('/send-confirmation-email', {
        orderData: orderData
      });
      
      console.log('✅ Email enviado com sucesso!', response.data);
      
      return {
        success: true,
        message: 'Email de confirmação enviado com sucesso!',
        result: response.data
      };
      
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      
      if (error.response) {
        console.error('Erro do servidor:', error.response.data);
      }
      
      throw new Error(`Falha ao enviar email: ${error.response?.data?.error || error.message}`);
    }
  }
};

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export default api;