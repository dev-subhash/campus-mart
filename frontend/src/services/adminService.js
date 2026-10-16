import api from './api';

export const getStats = () => api.get('/admin/stats').then((r) => r.data);
export const getAllUsers = () => api.get('/admin/users').then((r) => r.data);
export const setUserStatus = (id, isActive) =>
  api.put(`/admin/users/${id}/status`, { isActive }).then((r) => r.data);
export const setUserRole = (id, role) =>
  api.put(`/admin/users/${id}/role`, { role }).then((r) => r.data);
export const getAllProducts = () => api.get('/admin/products').then((r) => r.data);
export const removeProduct = (id) => api.delete(`/admin/products/${id}`).then((r) => r.data);
