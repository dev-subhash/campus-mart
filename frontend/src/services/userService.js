import api from './api';

export const getUserById = (id) => api.get(`/users/${id}`).then((r) => r.data);
export const updateProfile = (payload) => api.put('/users/me', payload).then((r) => r.data);
export const updateProfileImage = (file) => {
  const form = new FormData();
  form.append('image', file);
  return api
    .put('/users/me/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data);
};
export const getMyListings = () => api.get('/users/me/listings').then((r) => r.data);
