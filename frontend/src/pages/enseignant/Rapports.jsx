import { useState, useEffect } from 'react';
import api from '../../services/api';

const statutColors = {
  DEPOSE: 'bg-gray-100 text-gray-700',
  EVALUE: 'bg-amber-50 text-amber-700',
  VALIDE: 'bg-green-50 text-green-700',
  REJETE: 'bg-red-50 text-red-700',
};

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

  if (loading) return <p className="text-gray-400">Chargement...</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Rapports de stage</h1>

      {rapports.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-400">Aucun rapport déposé.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rapports.map(rapport => (
            <div key={rapport.refRapport} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">{rapport.stageTitre}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Déposé le {rapport.dateDepot}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statutColors[rapport.statut]}`}>
                  {rapport.statut}
                </span>
              </div>

              {rapport.note !== null && (
                <div className="mb-3 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Note</p>
                      <p className="text-lg font-semibold text-gray-800">{rapport.note}/20</p>
                    </div>
                    {rapport.commentaire && (
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Commentaire</p>
                        <p className="text-sm text-gray-600">{rapport.commentaire}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {rapport.statut === 'DEPOSE' && (
                  <button
                    onClick={() => setEvalModal(rapport.refRapport)}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                  >
                    Évaluer
                  </button>
                )}
                {rapport.statut === 'EVALUE' && (
                  <>
                    <button
                      onClick={() => handleValider(rapport.refRapport)}
                      className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                    >
                      Valider
                    </button>
                    <button
                      onClick={() => handleRejeter(rapport.refRapport)}
                      className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Évaluer le rapport</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note (sur 20)</label>
                <input
                  type="number" min="0" max="20" step="0.5" value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="15.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
                <textarea
                  value={commentaire} onChange={(e) => setCommentaire(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3} placeholder="Bon travail, quelques points à améliorer..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setEvalModal(null)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                  Annuler
                </button>
                <button onClick={() => handleEvaluer(evalModal)} disabled={!note || submitting}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
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
