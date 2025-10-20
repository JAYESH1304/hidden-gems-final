import axios from 'axios';

import axios from 'axios';

// Use environment variable or default to local
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const postAPI = {
  getAll: () => api.get('/posts'),
  create: (data) => api.post('/posts', data),
  getById: (id) => api.get(`/posts/${id}`),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
  getByUser: () => api.get('/posts/user/me'),
};

export const commentAPI = {
  getByPostId: (postId) => api.get(`/comments/${postId}`),
  create: (postId, data) => api.post(`/comments/${postId}`, data),
  delete: (commentId) => api.delete(`/comments/${commentId}`),
};

export default api;
