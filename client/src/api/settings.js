import { api } from './client.js';

export const settingsApi = {
  get: () => api.get('/settings'),
  update: (partial) => api.put('/settings', partial),
};

export function downloadBackup() {
  // Navegación simple: el navegador manda la cookie de sesión sola y el
  // servidor responde con Content-Disposition: attachment, así que esto
  // dispara la descarga sin sacarte de la app.
  window.location.href = '/api/backup';
}
