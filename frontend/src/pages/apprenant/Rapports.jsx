import { useState, useEffect } from 'react';
import api from '../../services/api';
import { ui, badgeClass, statutLabel, formatDateFR, ouvrirRapportPDF } from '../../components/common/ui';

function DepotModal({ onClose, onSave }) {
  const [stageId, setStageId] = useState('');
  const [fichier, setFichier] = useState(null);
  const [stages, setStages] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/stages/me').then(res => setStages(res.data)).catch(console.error);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fichier || !stageId) return;
    const formData = new FormData();
    formData.append('fichier', fichier);
    setSubmitting(true);
    setError('');
    onSave(stageId, formData)
      .then(() => onClose())
      .catch(() => {
        setError('L\'envoi a échoué. Vérifiez que votre fichier est bien en PDF, puis réessayez.');
        setSubmitting(false);
      });
  };

  return (
    <div className={ui.modalOverlay}>
      <div className={ui.modalPanel}>
        <div className={ui.modalHeader}>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent-600">
            Nouvel envoi
          </p>
          <h2 className={ui.modalTitle}>Envoyer un rapport</h2>
          <p className="mt-1 text-sm text-ink-500">
            Choisissez votre stage puis ajoutez votre rapport en PDF.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={ui.modalBody}>
          <div>
            <label className={ui.label}>Stage concerné</label>
            <select className={ui.input} required
              value={stageId} onChange={e => setStageId(e.target.value)}>
              <option value="">Choisir un stage</option>
              {stages.map(s => (
                <option key={s.refStage} value={s.refStage}>{s.titre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={ui.label}>Fichier PDF</label>
            <input
              className="w-full rounded-sm border border-ink-200 bg-white px-3 py-2 text-sm text-ink-700 transition file:mr-3 file:rounded-sm file:border-0 file:bg-ink-900 file:px-3 file:py-1 file:font-mono file:text-[11px] file:uppercase file:tracking-wider file:text-ink-50 hover:file:bg-ink-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              type="file" accept=".pdf"
              onChange={e => setFichier(e.target.files[0])} required />
            <p className="mt-1.5 text-xs text-ink-400">
              PDF uniquement. Relisez bien avant d'envoyer : une fois déposé, vous ne pouvez plus le changer.
            </p>
          </div>

          {error && (
            <div className="rounded-sm border border-danger-100 bg-danger-50 px-3 py-2 text-sm text-danger-700">
              {error}
            </div>
          )}

          <div className={ui.modalFooter}>
            <button type="button" onClick={onClose} className={ui.btnSecondary}>Annuler</button>
            <button type="submit" disabled={submitting} className={ui.btnPrimary}>
              {submitting ? 'Envoi en cours...' : 'Envoyer le rapport'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Rapports() {
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDepot, setShowDepot] = useState(false);

  useEffect(() => { loadRapports(); }, []);

  const loadRapports = () => {
    api.get('/rapports/me')
      .then(res => setRapports(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleDeposer = (stageId, formData) => {
    return api.post(`/rapports/deposer/${stageId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(() => { loadRapports(); });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">Chargement...</p>
      </div>
    );
  }

  return (
    <div>
      <header className={ui.pageHeader}>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className={ui.kicker}>Mes rapports</p>
            <h1 className={ui.pageTitle}>Vos rapports</h1>
            <p className={ui.pageLead}>
              {rapports.length === 0
                ? 'Vous n\'avez encore envoyé aucun rapport.'
                : `${rapports.length} rapport${rapports.length > 1 ? 's' : ''} envoyé${rapports.length > 1 ? 's' : ''}. Les notes et commentaires de vos profs s'affichent ci-dessous.`}
            </p>
          </div>
          <button onClick={() => setShowDepot(true)} className={ui.btnPrimary}>
            Envoyer un rapport
          </button>
        </div>
      </header>

      {rapports.length === 0 ? (
        <div className="rounded-sm border border-dashed border-ink-300 bg-white px-8 py-16 text-center">
          <p className="font-display text-xl font-medium text-ink-800">
            Pas encore de rapport envoyé.
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink-500">
            Quand votre stage est terminé, envoyez votre rapport en PDF.
            Vos profs pourront le lire, le noter et le valider.
          </p>
          <button onClick={() => setShowDepot(true)} className={`${ui.btnPrimary} mt-6`}>
            Envoyer mon rapport
          </button>
        </div>
      ) : (
        <ul className="space-y-4">
          {rapports.map(r => (
            <li key={r.refRapport} className="sygle-lift rounded-sm border border-ink-200 bg-white">
              <article className="grid grid-cols-1 md:grid-cols-4">
                <div className="border-b border-ink-100 px-6 py-5 md:col-span-3 md:border-b-0 md:border-r">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-ink-400">
                        Réf. {r.refRapport}
                      </p>
                      <h3 className="mt-1 font-display text-xl font-medium tracking-tight text-ink-900">
                        {r.stageTitre || 'Rapport de stage'}
                      </h3>
                      <p className="mt-1 text-xs text-ink-500">
                        Envoyé le {formatDateFR(r.dateDepot)}
                      </p>
                    </div>
                    <span className={badgeClass(r.statut)}>{statutLabel(r.statut)}</span>
                  </div>

                  {r.commentaire && (
                    <blockquote className="mt-4 border-l-2 border-accent-300 pl-4 text-sm italic text-ink-600">
                      «&nbsp;{r.commentaire}&nbsp;»
                    </blockquote>
                  )}

                  <div className="mt-4">
                    <button onClick={() => ouvrirRapportPDF(r.refRapport)} className={ui.btnSecondary}>
                      Consulter mon rapport
                    </button>
                  </div>
                </div>

                <div className="px-6 py-5 md:py-5">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-ink-400">
                    Note
                  </p>
                  {r.note != null ? (
                    <p className="mt-1 font-display text-4xl font-medium tabular-nums tracking-tight text-ink-900">
                      {r.note}<span className="text-base text-ink-400">/20</span>
                    </p>
                  ) : (
                    <p className="mt-1 font-display text-xl italic text-ink-400">en attente</p>
                  )}
                  {r.evaluateurNom && (
                    <p className="mt-3 text-xs text-ink-500">
                      Noté par<br />
                      <span className="text-ink-800">{r.evaluateurPrenom} {r.evaluateurNom}</span>
                    </p>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}

      {showDepot && <DepotModal onClose={() => setShowDepot(false)} onSave={handleDeposer} />}
    </div>
  );
}
