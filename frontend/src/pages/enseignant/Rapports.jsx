import { useState, useEffect } from 'react';
import api from '../../services/api';

const STATUT_LABELS = {
  DEPOSE: 'Déposé',
  EVALUE: 'Évalué',
  VALIDE: 'Validé',
  REJETE: 'Rejeté',
};

const STATUT_STYLES = {
  DEPOSE: 'bg-slate-100 text-slate-700 ring-slate-200',
  EVALUE: 'bg-amber-50 text-amber-700 ring-amber-200',
  VALIDE: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  REJETE: 'bg-red-50 text-red-700 ring-red-200',
};

function StatutBadge({ statut }) {
  const style = STATUT_STYLES[statut] || 'bg-slate-100 text-slate-600 ring-slate-200';
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${style}`}>
      {STATUT_LABELS[statut] || statut}
    </span>
  );
}

export default function Rapports() {
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evalModal, setEvalModal] = useState(null);
  const [note, setNote] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchRapports = () => {
    api.get('/rapports')
      .then(res => setRapports(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRapports(); }, []);

  const handleEvaluer = async (rapportId) => {
    setSubmitting(true);
    try {
      await api.post(`/rapports/${rapportId}/evaluer`, {
        note: parseFloat(note),
        commentaire,
        evaluateurId: 2,
      });
      setEvalModal(null);
      setNote('');
      setCommentaire('');
      fetchRapports();
    } catch (err) {
      alert('Erreur lors de l\'évaluation');
    }
    setSubmitting(false);
  };

  const handleValider = async (rapportId) => {
    try {
      await api.patch(`/rapports/${rapportId}/valider`);
      fetchRapports();
    } catch (err) { alert('Erreur'); }
  };

  const handleRejeter = async (rapportId) => {
    try {
      await api.patch(`/rapports/${rapportId}/rejeter`);
      fetchRapports();
    } catch (err) { alert('Erreur'); }
  };

  if (loading) return <div className="flex h-64 items-center justify-center text-sm text-slate-400">Chargement...</div>;

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Rapports de stage</h1>

      {rapports.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <p className="text-sm text-slate-500">Aucun rapport déposé.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rapports.map(rapport => (
            <div key={rapport.refRapport} className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{rapport.stageTitre}</h3>
                  <p className="mt-0.5 text-xs text-slate-500">Déposé le {rapport.dateDepot}</p>
                </div>
                <StatutBadge statut={rapport.statut} />
              </div>

              {rapport.note !== null && (
                <div className="mb-3 rounded-md border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-slate-500">Note</p>
                      <p className="text-lg font-semibold text-slate-900">{rapport.note}/20</p>
                    </div>
                    {rapport.commentaire && (
                      <div className="flex-1">
                        <p className="text-xs text-slate-500">Commentaire</p>
                        <p className="text-sm text-slate-600">{rapport.commentaire}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {rapport.statut === 'DEPOSE' && (
                  <button
                    onClick={() => setEvalModal(rapport.refRapport)}
                    className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
                  >
                    Évaluer
                  </button>
                )}
                {rapport.statut === 'EVALUE' && (
                  <>
                    <button
                      onClick={() => handleValider(rapport.refRapport)}
                      className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                    >
                      Valider
                    </button>
                    <button
                      onClick={() => handleRejeter(rapport.refRapport)}
                      className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Rejeter
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {evalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white shadow-lg">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">Évaluer le rapport</h2>
            </div>
            <div className="space-y-4 px-5 py-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Note (sur 20)</label>
                <input
                  type="number" min="0" max="20" step="0.5" value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  placeholder="15.5"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Commentaire</label>
                <textarea
                  value={commentaire} onChange={(e) => setCommentaire(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  rows={3} placeholder="Bon travail, quelques points à améliorer..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setEvalModal(null)}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Annuler
                </button>
                <button onClick={() => handleEvaluer(evalModal)} disabled={!note || submitting}
                  className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50">
                  {submitting ? 'Envoi...' : 'Envoyer l\'évaluation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
