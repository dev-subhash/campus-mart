import api from './api';

export const findOrCreateConversation = (recipientId, productId) =>
  api.post('/conversations', { recipientId, productId }).then((r) => r.data);

export const getConversations = () => api.get('/conversations').then((r) => r.data);
export const getConversationById = (id) => api.get(`/conversations/${id}`).then((r) => r.data);

export const sendMessage = (conversationId, text) =>
  api.post('/messages', { conversationId, text }).then((r) => r.data);

export const getMessages = (conversationId) =>
  api.get(`/messages/${conversationId}`).then((r) => r.data);
