import { useState, useEffect } from 'react';
import api from '../../services/api';

const STATUT_COLORS = {
  DEPOSE: 'bg-gray-100 text-gray-700',
  EVALUE: 'bg-amber-50 text-amber-700',
  VALIDE: 'bg-green-50 text-green-700',
  REJETE: 'bg-red-50 text-red-700'
};

function EvaluationModal({ rapport, onClose, onSave }) {
  const [form, setForm] = useState({ note: '', commentaire: '', evaluateurId: '' });
  const [enseignants, setEnseignants] = useState([]);

  useEffect(() => {
    api.get('/enseignants').then(res => setEnseignants(res.data)).catch(console.error);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(rapport.refRapport, {
      note: Number(form.note),
      commentaire: form.commentaire,
      evaluateurId: Number(form.evaluateurId)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Evaluer le rapport</h2>
        <p className="text-sm text-gray-500 mb-4">Stage : {rapport.stageTitre}</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-500">Note /20 *</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" type="number"
              min="0" max="20" step="0.5" placeholder="Note"
              value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} required />
          </div>
          <textarea className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Commentaire"
            rows={3} value={form.commentaire} onChange={e => setForm({ ...form, commentaire: e.target.value })} />
          <div>
            <label className="text-xs text-gray-500">Evaluateur *</label>
            <select className="w-full border rounded-lg px-3 py-2 text-sm"
              value={form.evaluateurId} onChange={e => setForm({ ...form, evaluateurId: e.target.value })} required>
              <option value="">Selectionner un enseignant</option>
              {enseignants.map(e => (
                <option key={e.codeUtilisateur} value={e.codeUtilisateur}>{e.nom} {e.prenom}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700">
              Evaluer
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

function DepotModal({ onClose, onSave }) {
  const [stageId, setStageId] = useState('');
  const [fichier, setFichier] = useState(null);
  const [stages, setStages] = useState([]);

  useEffect(() => {
    api.get('/stages').then(res => setStages(res.data)).catch(console.error);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fichier || !stageId) return;
    const formData = new FormData();
    formData.append('fichier', fichier);
    onSave(stageId, formData);
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
          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700">
              Deposer
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
  const [evaluating, setEvaluating] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadRapports();
  }, []);

  const loadRapports = () => {
    api.get('/rapports')
      .then(res => setRapports(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleDeposer = (stageId, formData) => {
    api.post(`/rapports/deposer/${stageId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(() => {
      loadRapports();
      setShowDepot(false);
    }).catch(console.error);
  };

  const handleEvaluer = (rapportId, evaluation) => {
    api.post(`/rapports/${rapportId}/evaluer`, evaluation)
      .then(() => {
        loadRapports();
        setEvaluating(null);
      }).catch(console.error);
  };

  const handleValider = (id) => {
    api.patch(`/rapports/${id}/valider`)
      .then(() => loadRapports())
      .catch(console.error);
  };

  const handleRejeter = (id) => {
    api.patch(`/rapports/${id}/rejeter`)
      .then(() => loadRapports())
      .catch(console.error);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Supprimer ce rapport ?')) return;
    api.delete(`/rapports/${id}`)
      .then(() => loadRapports())
      .catch(console.error);
  };

  const filtered = filter
    ? rapports.filter(r => r.statut === filter)
    : rapports;

  if (loading) {
    return <div className="flex items-center justify-center h-64"><p className="text-gray-400">Chargement...</p></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Rapports de stage</h1>
          <p className="text-sm text-gray-500 mt-1">{rapports.length} rapport(s)</p>
        </div>
        <button onClick={() => setShowDepot(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          + Deposer
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {['', 'DEPOSE', 'EVALUE', 'VALIDE', 'REJETE'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium ${filter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {s || 'Tous'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3">Date depot</th>
              <th className="px-4 py-3">Note</th>
              <th className="px-4 py-3">Evaluateur</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(r => (
              <tr key={r.refRapport}>
                <td className="px-4 py-3 font-medium text-gray-800">{r.stageTitre || '-'}</td>
                <td className="px-4 py-3 text-gray-600">{r.dateDepot || '-'}</td>
                <td className="px-4 py-3 text-gray-600">{r.note != null ? `${r.note}/20` : '-'}</td>
                <td className="px-4 py-3 text-gray-600">
                  {r.evaluateurNom ? `${r.evaluateurNom} ${r.evaluateurPrenom}` : '-'}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUT_COLORS[r.statut] || 'bg-gray-100'}`}>
                    {r.statut}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {r.statut === 'DEPOSE' && (
                      <button onClick={() => setEvaluating(r)}
                        className="text-amber-600 hover:text-amber-800 text-xs">Evaluer</button>
                    )}
                    {r.statut === 'EVALUE' && (
                      <>
                        <button onClick={() => handleValider(r.refRapport)}
                          className="text-green-600 hover:text-green-800 text-xs">Valider</button>
                        <button onClick={() => handleRejeter(r.refRapport)}
                          className="text-red-600 hover:text-red-800 text-xs">Rejeter</button>
                      </>
                    )}
                    <button onClick={() => handleDelete(r.refRapport)}
                      className="text-red-600 hover:text-red-800 text-xs">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Aucun rapport</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showDepot && <DepotModal onClose={() => setShowDepot(false)} onSave={handleDeposer} />}
      {evaluating && <EvaluationModal rapport={evaluating} onClose={() => setEvaluating(null)} onSave={handleEvaluer} />}
    </div>
  );
}
