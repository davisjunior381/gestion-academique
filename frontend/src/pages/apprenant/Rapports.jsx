import { useState, useEffect } from 'react';
import api from '../../services/api';

const STATUT_COLORS = {
  DEPOSE: 'bg-gray-100 text-gray-700',
  EVALUE: 'bg-amber-50 text-amber-700',
  VALIDE: 'bg-green-50 text-green-700',
  REJETE: 'bg-red-50 text-red-700'
};

export default function Rapports() {
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/rapports')
      .then(res => setRapports(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-gray-400">Chargement...</p></div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Mes rapports</h1>
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
    </div>
  );
}
