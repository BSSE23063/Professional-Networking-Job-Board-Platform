import api from './api';

export const companyService = {
  // ... existing code ...

  registerCompany: async (companyData) => {
    const response = await api.post('/companies', companyData);
    return response.data;
  },

  getCompanies: async () => {
    const response = await api.get('/companies');
    return response.data;
  },

  getCompany: async (id) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  }
};