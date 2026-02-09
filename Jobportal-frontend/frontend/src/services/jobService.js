// services/jobService.js
import api from './api';

export const jobService = {
  getJobs: async (params = {}) => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  getJob: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  createJob: async (jobData) => {
    console.log('📤 Sending job creation request:', jobData);
    
    try {
      // Remove any empty strings or undefined values
      const cleanData = {};
      Object.keys(jobData).forEach(key => {
        if (jobData[key] !== undefined && jobData[key] !== '') {
          cleanData[key] = jobData[key];
        }
      });
      
      console.log('🧹 Cleaned job data:', cleanData);
      
      const response = await api.post('/jobs', cleanData);
      console.log('✅ Job created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Job creation failed:', error.response?.data || error.message);
      console.error('📝 Request payload:', jobData);
      throw error;
    }
  },

  updateJob: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  getJobCount: async (days) => {
    const response = await api.get('/jobs/count', { params: { days } });
    return response.data;
  }
};