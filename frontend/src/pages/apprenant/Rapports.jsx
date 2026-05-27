import { useState, useEffect } from 'react';
import api from '../../services/api';

const STATUT_COLORS = {
  DEPOSE: 'bg-gray-100 text-gray-700',
  EVALUE: 'bg-amber-50 text-amber-700',
  VALIDE: 'bg-green-50 text-green-700',
  REJETE: 'bg-red-50 text-red-700'
};

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
        setError('Le dépôt a échoué. Vérifiez que le fichier est bien un PDF, puis réessayez.');
        setSubmitting(false);
      });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Deposer un rapport</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-500">Stage *</label>
            <select className="w-full border rounded-lg px-3 py-2 text-sm"
              value={stageId} onChange={e => setStageId(e.target.value)} required>
              <option value="">Selectionner un stage</option>
              {stages.map(s => (
                <option key={s.refStage} value={s.refStage}>{s.titre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500">Fichier PDF *</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" type="file" accept=".pdf"
              onChange={e => setFichier(e.target.files[0])} required />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={submitting}
              className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {submitting ? 'Depot...' : 'Deposer'}
            </button>
            <button type="button" onClick={onClose} className="flex-1 border rounded-lg py-2 text-sm font-medium hover:bg-gray-50">
              Annuler
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

  useEffect(() => {
    loadRapports();
  }, []);

  const loadRapports = () => {
    api.get('/rapports/me')
      .then(res => setRapports(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleDeposer = (stageId, formData) => {
    return api.post(`/rapports/deposer/${stageId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(() => {
      loadRapports();
    });
  };

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-gray-400">Chargement...</p></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Mes rapports</h1>
        <button onClick={() => setShowDepot(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          + Deposer
        </button>
      </div>
      {rapports.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-400">Aucun rapport.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rapports.map(r => (
            <div key={r.refRapport} className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-800">{r.stageTitre || 'Rapport'}</h3>
              <p className="text-xs text-gray-500 mt-1">Déposé le {r.dateDepot}</p>
              {r.note != null && <p className="text-sm font-medium text-gray-800 mt-2">Note : {r.note}/20</p>}
              {r.commentaire && <p className="text-xs text-gray-500 mt-1">{r.commentaire}</p>}
              {r.evaluateurNom && <p className="text-xs text-gray-500">Évaluateur : {r.evaluateurNom} {r.evaluateurPrenom}</p>}
              <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${STATUT_COLORS[r.statut] || 'bg-gray-100'}`}>{r.statut}</span>
            </div>
          ))}
        </div>
      )}

      {showDepot && <DepotModal onClose={() => setShowDepot(false)} onSave={handleDeposer} />}
    </div>
  );
}
