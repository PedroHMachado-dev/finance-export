import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

export const financeApi = {
  // Transações
  getTransactions: async (params = {}) => {
    const response = await api.get('/transactions', { params });
    return response.data;
  },

  getTransactionById: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  createTransaction: async (data) => {
    const response = await api.post('/transactions', data);
    return response.data;
  },

  updateTransaction: async (id, data) => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  },

  deleteTransaction: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  // Upload CSV (Extrato de Conta ou Fatura de Cartão)
  importCsv: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/transactions/import/csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Dashboard & Métricas
  getSummary: async (params = {}) => {
    const response = await api.get('/dashboard/summary', { params });
    return response.data;
  },

  getByCategory: async (type = 'DESPESA', params = {}) => {
    const response = await api.get('/dashboard/by-category', {
      params: { type, ...params },
    });
    return response.data;
  },

  getMonthlyTrend: async (year = 2026) => {
    const response = await api.get('/dashboard/monthly-trend', {
      params: { year },
    });
    return response.data;
  },

  // Gráfico 1: Controle Mensal (Gastos Diários)
  getDailyExpenses: async (params = {}) => {
    const response = await api.get('/dashboard/daily-expenses', { params });
    return response.data;
  },

  // Gráfico 2: Controle Semanal (Dias da Semana)
  getWeeklyExpenses: async (params = {}) => {
    const response = await api.get('/dashboard/weekly-expenses', { params });
    return response.data;
  },

  // Gráfico 3: Comparativo Dinheiro Guardado (Caixinhas)
  getSavingsTrend: async (year = 2026) => {
    const response = await api.get('/dashboard/savings-trend', {
      params: { year },
    });
    return response.data;
  },

  // Categorias
  getCategories: async (type) => {
    const response = await api.get('/categories', {
      params: type ? { type } : {},
    });
    return response.data;
  },

  createCategory: async (data) => {
    const response = await api.post('/categories', data);
    return response.data;
  },
};

export default api;
