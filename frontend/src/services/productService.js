import api from './api';

export const getProducts = (params) => api.get('/products', { params }).then((r) => r.data);
export const getProductById = (id) => api.get(`/products/${id}`).then((r) => r.data);

const buildProductForm = (payload) => {
  const form = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (key === 'images') return;
    if (value !== undefined && value !== null) form.append(key, value);
  });
  if (payload.images) {
    Array.from(payload.images).forEach((file) => form.append('images', file));
  }
  return form;
};

export const createProduct = (payload) =>
  api
    .post('/products', buildProductForm(payload), {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data);

export const updateProduct = (id, payload) =>
  api
    .put(`/products/${id}`, buildProductForm(payload), {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data);

export const deleteProduct = (id) => api.delete(`/products/${id}`).then((r) => r.data);

export const deleteProductImage = (id, publicId) =>
  api.delete(`/products/${id}/images/${encodeURIComponent(publicId)}`).then((r) => r.data);

export const CATEGORIES = [
  'Books',
  'Electronics',
  'Furniture',
  'Notes',
  'Stationery',
  'Hostel Items',
  'Other',
];

export const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Used'];
