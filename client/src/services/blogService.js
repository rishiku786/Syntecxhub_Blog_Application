import api from './api';

export const blogService = {
  getAll: (params) => api.get('/blogs', { params }),
  getBySlug: (slug) => api.get(`/blogs/${slug}`),
  create: (data) => api.post('/blogs', data),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  delete: (id) => api.delete(`/blogs/${id}`),
  toggleLike: (id) => api.post(`/blogs/${id}/like`),
  getTrending: () => api.get('/blogs/trending'),
  getFeatured: () => api.get('/blogs/featured'),
  getMyBlogs: (params) => api.get('/blogs/my-blogs', { params }),
  getStats: () => api.get('/blogs/stats'),
  getAdminStats: () => api.get('/blogs/admin-stats'),
};

export const commentService = {
  getByBlog: (blogId) => api.get(`/comments/${blogId}`),
  create: (blogId, data) => api.post(`/comments/${blogId}`, data),
  update: (id, data) => api.put(`/comments/${id}`, data),
  delete: (id) => api.delete(`/comments/${id}`),
  toggleLike: (id) => api.post(`/comments/${id}/like`),
};

export const bookmarkService = {
  getAll: () => api.get('/bookmarks'),
  toggle: (blogId) => api.post(`/bookmarks/${blogId}`),
  check: (blogId) => api.get(`/bookmarks/check/${blogId}`),
};

export const userService = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  follow: (id) => api.post(`/users/follow/${id}`),
  unfollow: (id) => api.delete(`/users/unfollow/${id}`),
  getAll: (params) => api.get('/users', { params }),
  delete: (id) => api.delete(`/users/${id}`),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
};

export const categoryService = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const uploadService = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteImage: (public_id) => api.delete('/upload', { data: { public_id } }),
};

export const newsletterService = {
  subscribe: (email) => api.post('/newsletter', { email }),
};

export const authService = {
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) =>
    api.post(`/auth/reset-password/${token}`, { password }),
};
