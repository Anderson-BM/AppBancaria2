import { api } from './client.js';

export const cardsApi = {
  list: () => api.get('/cards'),
  create: (card) => api.post('/cards', card),
  update: (id, card) => api.put(`/cards/${id}`, card),
  remove: (id) => api.del(`/cards/${id}`),
};
