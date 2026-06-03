/*
 * Singleton pour exposer la fonction `toast()` en dehors du cycle React
 * (intercepteur axios, services, etc.). Le ToastProvider enregistre
 * son dispatcher au montage via setToastDispatcher().
 */

let pushToast = () => {
  // No-op tant que le ToastProvider n'est pas monté.
  // Évite de perdre des erreurs au démarrage : on log au moins en console.
  // eslint-disable-next-line no-console
  console.warn('[toast] Provider non monté, message ignoré.');
};

export const setToastDispatcher = (fn) => {
  pushToast = fn;
};

export const toast = (message, type = 'info') => {
  pushToast(message, type);
};
