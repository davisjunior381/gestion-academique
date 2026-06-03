import axios from 'axios';
import { toast } from './toast-store';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Routes pour lesquelles on n'affiche pas de toast d'erreur
// (l'appelant gère lui-même le message d'erreur dans l'UI).
const SILENT_ERROR_PATHS = ['/auth/login'];

function isSilent(error) {
  const url = error.config?.url || '';
  return SILENT_ERROR_PATHS.some((p) => url.includes(p));
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Erreur réseau (pas de réponse du back)
    if (!error.response) {
      if (!isSilent(error)) {
        toast('Connexion impossible. Vérifiez votre réseau.', 'error');
      }
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    if (status === 401) {
      localStorage.removeItem('token');
      // Évite la boucle de redirection si on est déjà sur /login.
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    if (isSilent(error)) {
      return Promise.reject(error);
    }

    if (status >= 500) {
      toast('Erreur serveur, veuillez réessayer.', 'error');
      return Promise.reject(error);
    }

    if (status >= 400) {
      // 403, 404, 409, 422, etc. : on remonte le message du back si dispo
      const message =
        (typeof data === 'string' && data) ||
        data?.message ||
        data?.error ||
        'Action impossible. Vérifiez les informations saisies.';
      toast(message, 'error');
    }

    return Promise.reject(error);
  }
);

export default api;
