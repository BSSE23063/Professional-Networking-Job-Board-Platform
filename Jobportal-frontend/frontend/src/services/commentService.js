import api from './api';

export const commentService = {
  getPostComments: async (postId) => {
    const response = await api.get(`/comments/${postId}`);
    return response.data;
  },

  addComment: async (postId, commentData) => {
    const response = await api.post(`/comments/${postId}`, commentData);
    return response.data;
  },

  updateComment: async (commentId, commentData) => {
    const response = await api.put(`/comments/${commentId}`, commentData);
    return response.data;
  },

  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  }
};