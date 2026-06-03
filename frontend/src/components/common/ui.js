/*
 * Primitives Tailwind pour Sygle.
 * Classes pretes a composer pour eviter la divergence entre pages.
 */

import api from '../../services/api';

/**
 * Ouvre le PDF d'un rapport dans un nouvel onglet.
 * Recupere le fichier en blob authentifie (le JWT est ajoute par l'intercepteur axios),
 * cree un objectURL et l'ouvre.
 * Renvoie une promesse qui resout en true si l'ouverture a reussi, false sinon.
 */
export async function ouvrirRapportPDF(rapportId) {
  try {
    const response = await api.get(`/rapports/${rapportId}/fichier`, {
      responseType: 'blob',
    });
    const blobUrl = URL.createObjectURL(response.data);
    const opened = window.open(blobUrl, '_blank', 'noopener,noreferrer');
    if (!opened) {
      // Popup bloque : on declenche un telechargement comme repli
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `rapport-${rapportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    // Liberer l'objectURL un peu plus tard pour laisser le navigateur l'ouvrir
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
    return true;
  } catch (err) {
    console.error('Echec de la consultation du rapport', err);
    return false;
  }
}

export const ui = {
  // Boutons
  btnPrimary:
    'sygle-btn-primary inline-flex items-center justify-center rounded-sm bg-brand-700 px-4 py-2 text-sm font-medium tracking-tight text-ink-50 transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50',
  btnSecondary:
    'inline-flex items-center justify-center rounded-sm border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-700 transition hover:bg-ink-50 hover:border-ink-300',
  btnGhost:
    'inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium text-ink-600 transition hover:bg-ink-100 hover:text-ink-900',
  btnDanger:
    'inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium text-accent-600 transition hover:bg-accent-50',

  // Champs de formulaire
  input:
    'w-full rounded-sm border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 transition focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500',
  label:
    'mb-1 block font-mono text-[11px] uppercase tracking-wider text-ink-500',

  // Surfaces
  surface:
    'rounded-sm border border-ink-200 bg-white',
  surfaceMuted:
    'rounded-sm border border-ink-200 bg-ink-50',
  divider: 'border-t border-ink-200',

  // Tableaux
  tableWrap:
    'overflow-hidden rounded-sm border border-ink-200 bg-white',
  table: 'w-full text-sm',
  thead:
    'border-b border-ink-200 bg-ink-50 text-left',
  th:
    'px-4 py-3 font-mono text-[11px] font-medium uppercase tracking-wider text-ink-500',
  tbody: 'divide-y divide-ink-100',
  tr: 'transition-colors duration-150 hover:bg-ink-50/60',
  td: 'px-4 py-3 text-ink-700',
  tdStrong: 'px-4 py-3 font-medium text-ink-900',

  // Modale
  modalOverlay:
    'sygle-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4 backdrop-blur-[2px]',
  modalPanel:
    'sygle-modal-panel w-full max-w-md overflow-hidden rounded-sm border border-ink-200 bg-white shadow-xl',
  modalHeader:
    'border-b border-ink-200 bg-ink-50 px-5 py-4',
  modalTitle:
    'font-display text-lg font-medium tracking-tight text-ink-900',
  modalBody: 'space-y-4 px-5 py-5',
  modalFooter:
    'flex justify-end gap-2 border-t border-ink-200 bg-ink-50 px-5 py-3',

  // Page header
  pageHeader: 'mb-8',
  kicker:
    'font-mono text-[11px] uppercase tracking-[0.14em] text-accent-600',
  pageTitle:
    'mt-1 font-display text-3xl font-medium tracking-tight text-ink-900',
  pageLead:
    'mt-2 max-w-2xl text-sm text-ink-500',
};

// Statuts (badges)
export const STATUT_LABELS = {
  DEPOSE: 'Déposé',
  EVALUE: 'Évalué',
  VALIDE: 'Validé',
  REJETE: 'Rejeté',
  EN_COURS: 'En cours',
  TERMINE: 'Terminé',
  REFUSE: 'Refusé',
  PLANIFIEE: 'Planifiée',
  EFFECTUEE: 'Effectuée',
  ANNULEE: 'Annulée',
};

const BADGE_STYLES = {
  DEPOSE: 'bg-ink-100 text-ink-700 ring-ink-200',
  EVALUE: 'bg-warning-50 text-warning-700 ring-warning-100',
  VALIDE: 'bg-success-50 text-success-700 ring-success-100',
  REJETE: 'bg-danger-50 text-danger-700 ring-danger-100',
  EN_COURS: 'bg-brand-50 text-brand-700 ring-brand-100',
  TERMINE: 'bg-warning-50 text-warning-700 ring-warning-100',
  REFUSE: 'bg-danger-50 text-danger-700 ring-danger-100',
  PLANIFIEE: 'bg-brand-50 text-brand-700 ring-brand-100',
  EFFECTUEE: 'bg-success-50 text-success-700 ring-success-100',
  ANNULEE: 'bg-ink-100 text-ink-600 ring-ink-200',
};

export function badgeClass(statut) {
  const style = BADGE_STYLES[statut] || 'bg-ink-100 text-ink-600 ring-ink-200';
  return `inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider ring-1 ring-inset ${style}`;
}

export function statutLabel(statut) {
  return STATUT_LABELS[statut] || statut || '-';
}

// Format de date FR avec espaces fines
export function formatDateFR(value, options) {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString(
    'fr-FR',
    options || { day: '2-digit', month: 'short', year: 'numeric' }
  );
}

export function formatDateTimeFR(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  const date = d.toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
  const time = d.toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit',
  });
  return `${date}, ${time}`;
}
