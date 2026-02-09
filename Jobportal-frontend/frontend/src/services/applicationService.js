import api from './api';

export const applicationService = {
  applyForJob: async (jobId, applicationData) => {
    const response = await api.post(`/applications/${jobId}`, applicationData);
    return response.data;
  },

  getCandidateApplications: async () => {
    const response = await api.get('/applications');
    return response.data;
  },

  getEmployerApplicants: async () => {
    const response = await api.get('/applications/employer/applicants');
    return response.data;
  },

  getJobApplicants: async (jobId) => {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
  },

  updateApplicationStatus: async (applicationId, status) => {
    const response = await api.put(`/applications/${applicationId}/status`, { status });
    return response.data;
  }
};