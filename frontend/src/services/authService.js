import api from './api';

export const registerUser = (payload) => api.post('/auth/register', payload).then((r) => r.data);
export const loginUser = (payload) => api.post('/auth/login', payload).then((r) => r.data);
export const logoutUser = () => api.post('/auth/logout').then((r) => r.data);
export const getCurrentUser = () => api.get('/auth/me').then((r) => r.data);
export const requestPasswordReset = (payload) => api.post('/auth/forgot-password', payload).then((r) => r.data);
export const verifyPasswordReset = (payload) => api.post('/auth/forgot-password/verify', payload).then((r) => r.data);
export const resetPassword = (payload) => api.post('/auth/forgot-password/reset', payload).then((r) => r.data);
