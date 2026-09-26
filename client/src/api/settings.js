import { api } from './client.js';

export const settingsApi = {
  get: () => api.get('/settings'),
  update: (partial) => api.put('/settings', partial),
};
