import { api } from './client.js';

export const authApi = {
  status: () => api.get('/auth/status'),
  setupPin: (pin) => api.post('/auth/setup', { pin }),
  login: (pin) => api.post('/auth/login', { pin }),
  logout: () => api.post('/auth/logout'),
};
