import { api } from './client.js';

export const expensesApi = {
  list: () => api.get('/expenses'),
  create: (expense) => api.post('/expenses', expense),
  remove: (id) => api.del(`/expenses/${id}`),
};
