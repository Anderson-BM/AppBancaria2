import { api } from './client.js';

export const fixedExpensesApi = {
  list: () => api.get('/fixed-expenses'),
  create: (item) => api.post('/fixed-expenses', item),
  update: (id, item) => api.put(`/fixed-expenses/${id}`, item),
  remove: (id) => api.del(`/fixed-expenses/${id}`),
};
