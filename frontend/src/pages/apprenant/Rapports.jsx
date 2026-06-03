import { useState, useEffect } from 'react';
import api from '../../services/api';

const STATUT_LABELS = {
  DEPOSE: 'Déposé',
  EVALUE: 'Évalué',
  VALIDE: 'Validé',
  REJETE: 'Rejeté'
};

const STATUT_STYLES = {
  DEPOSE: 'bg-slate-100 text-slate-700 ring-slate-200',
  EVALUE: 'bg-amber-50 text-amber-700 ring-amber-200',
  VALIDE: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  REJETE: 'bg-red-50 text-red-700 ring-red-200'
};

function StatutBadge({ statut }) {
  const style = STATUT_STYLES[statut] || 'bg-slate-100 text-slate-600 ring-slate-200';
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${style}`}>
      {STATUT_LABELS[statut] || statut}
    </span>
  );
}

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white shadow-lg">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">Déposer un rapport</h2>
          <p className="mt-0.5 text-sm text-slate-500">Sélectionnez le stage concerné et joignez votre rapport au format PDF.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Stage</label>
            <select
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
              value={stageId} onChange={e => setStageId(e.target.value)} required>
              <option value="">Sélectionner un stage</option>
              {stages.map(s => (
                <option key={s.refStage} value={s.refStage}>{s.titre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Fichier PDF</label>
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-sm file:text-slate-700 hover:file:bg-slate-200 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
              type="file" accept=".pdf"
              onChange={e => setFichier(e.target.files[0])} required />
            <p className="mt-1 text-xs text-slate-400">Format accepté : PDF uniquement.</p>
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Annuler
            </button>
            <button type="submit" disabled={submitting}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50">
              {submitting ? 'Dépôt en cours...' : 'Déposer le rapport'}
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

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-sm text-slate-400">Chargement...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Mes rapports</h1>
          <p className="mt-1 text-sm text-slate-500">
            {rapports.length} rapport{rapports.length > 1 ? 's' : ''} déposé{rapports.length > 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={() => setShowDepot(true)}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
          Déposer un rapport
        </button>
      </div>

      {rapports.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <p className="text-sm font-medium text-slate-700">Aucun rapport déposé</p>
          <p className="mt-1 text-sm text-slate-500">Déposez le rapport de votre stage pour qu'il soit évalué.</p>
          <button onClick={() => setShowDepot(true)}
            className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
            Déposer un rapport
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {rapports.map(r => (
            <div key={r.refRapport} className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-slate-900">{r.stageTitre || 'Rapport de stage'}</h3>
                <StatutBadge statut={r.statut} />
              </div>
              <p className="mt-1 text-xs text-slate-500">Déposé le {r.dateDepot}</p>

              {(r.note != null || r.commentaire || r.evaluateurNom) && (
                <div className="mt-3 border-t border-slate-100 pt-3">
                  {r.note != null && (
                    <p className="text-sm font-medium text-slate-900">Note : {r.note}/20</p>
                  )}
                  {r.commentaire && <p className="mt-1 text-sm text-slate-600">{r.commentaire}</p>}
                  {r.evaluateurNom && (
                    <p className="mt-1 text-xs text-slate-400">Évaluateur : {r.evaluateurNom} {r.evaluateurPrenom}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showDepot && <DepotModal onClose={() => setShowDepot(false)} onSave={handleDeposer} />}
    </div>
  );
}
