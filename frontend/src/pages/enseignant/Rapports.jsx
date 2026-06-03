import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ui, badgeClass, statutLabel, formatDateFR } from '../../components/common/ui';

export default function Rapports() {
  const { user } = useAuth();
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evalModal, setEvalModal] = useState(null);
  const [note, setNote] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchRapports = () => {
    api.get('/rapports')
      .then(res => setRapports(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRapports(); }, []);

  const handleEvaluer = async (rapportId) => {
    setSubmitting(true);
    setError('');
    try {
      await api.post(`/rapports/${rapportId}/evaluer`, {
        note: parseFloat(note),
        commentaire,
        evaluateurId: user?.codeUtilisateur,
      });
      setEvalModal(null);
      setNote('');
      setCommentaire('');
      fetchRapports();
    } catch (err) {
      setError('La note n\'a pas pu être enregistrée. Réessayez dans un instant.');
    }
    setSubmitting(false);
  };

  const handleValider = async (rapportId) => {
    try {
      await api.patch(`/rapports/${rapportId}/valider`);
      fetchRapports();
    } catch (err) { alert('Action impossible'); }
  };

  const handleRejeter = async (rapportId) => {
    try {
      await api.patch(`/rapports/${rapportId}/rejeter`);
      fetchRapports();
    } catch (err) { alert('Action impossible'); }
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
        <p className={ui.kicker}>Notation des rapports</p>
        <h1 className={ui.pageTitle}>Rapports à noter</h1>
        <p className={ui.pageLead}>
          Mettez une note, laissez un commentaire, puis validez le rapport
          ou demandez à l'élève de le retravailler.
        </p>
      </header>

      {rapports.length === 0 ? (
        <div className="rounded-sm border border-dashed border-ink-300 bg-white px-8 py-16 text-center">
          <p className="font-display text-xl font-medium text-ink-800">
            Aucun rapport à noter pour l'instant.
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink-500">
            Les rapports s'afficheront ici dès qu'un élève en aura déposé un.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {rapports.map(rapport => (
            <li key={rapport.refRapport}>
              <article className="sygle-lift rounded-sm border border-ink-200 bg-white p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-ink-400">
                      Réf. {rapport.refRapport}
                    </p>
                    <h3 className="mt-1 font-display text-xl font-medium tracking-tight text-ink-900">
                      {rapport.stageTitre}
                    </h3>
                    <p className="mt-1 text-xs text-ink-500">
                      Déposé le {formatDateFR(rapport.dateDepot)}
                    </p>
                  </div>
                  <span className={badgeClass(rapport.statut)}>{statutLabel(rapport.statut)}</span>
                </div>

                {rapport.note !== null && rapport.note !== undefined && (
                  <div className="mt-4 grid grid-cols-1 gap-4 rounded-sm border border-ink-100 bg-ink-50 p-4 md:grid-cols-4">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-ink-500">Note</p>
                      <p className="mt-1 font-display text-3xl font-medium tabular-nums text-ink-900">
                        {rapport.note}<span className="text-base text-ink-400">/20</span>
                      </p>
                    </div>
                    {rapport.commentaire && (
                      <div className="md:col-span-3">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-500">
                          Commentaire
                        </p>
                        <p className="mt-1 text-sm italic text-ink-700">
                          «&nbsp;{rapport.commentaire}&nbsp;»
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-2 border-t border-ink-100 pt-4">
                  {rapport.statut === 'DEPOSE' && (
                    <button
                      onClick={() => setEvalModal(rapport.refRapport)}
                      className={ui.btnPrimary}>
                      Noter ce rapport
                    </button>
                  )}
                  {rapport.statut === 'EVALUE' && (
                    <>
                      <button onClick={() => handleValider(rapport.refRapport)}
                        className="inline-flex items-center justify-center rounded-sm bg-success-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-success-700">
                        Valider
                      </button>
                      <button onClick={() => handleRejeter(rapport.refRapport)}
                        className="inline-flex items-center justify-center rounded-sm border border-accent-200 px-4 py-2 text-sm font-medium text-accent-600 transition hover:bg-accent-50">
                        Demander à refaire
                      </button>
                    </>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}

      {evalModal && (
        <div className={ui.modalOverlay}>
          <div className={ui.modalPanel}>
            <div className={ui.modalHeader}>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent-600">
                Notation
              </p>
              <h2 className={ui.modalTitle}>Noter le rapport</h2>
            </div>
            <div className={ui.modalBody}>
              <div>
                <label className={ui.label}>Note sur 20</label>
                <input
                  type="number" min="0" max="20" step="0.5" value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className={ui.input}
                  placeholder="15,5"
                />
              </div>
              <div>
                <label className={ui.label}>Commentaire</label>
                <textarea
                  value={commentaire} onChange={(e) => setCommentaire(e.target.value)}
                  className={ui.input}
                  rows={4} placeholder="Ce qui est bien, ce qui peut être amélioré..."
                />
              </div>
              {error && (
                <div className="rounded-sm border border-danger-100 bg-danger-50 px-3 py-2 text-sm text-danger-700">
                  {error}
                </div>
              )}
            </div>
            <div className={ui.modalFooter}>
              <button onClick={() => { setEvalModal(null); setError(''); }} className={ui.btnSecondary}>
                Annuler
              </button>
              <button onClick={() => handleEvaluer(evalModal)} disabled={!note || submitting}
                className={ui.btnPrimary}>
                {submitting ? 'Envoi...' : 'Enregistrer la note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
