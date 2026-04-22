import { useState, useEffect } from 'react';
import api from '../../services/api';

const STATUT_COLORS = {
  EN_COURS: 'bg-blue-50 text-blue-700',
  TERMINE: 'bg-amber-50 text-amber-700',
  VALIDE: 'bg-green-50 text-green-700',
  REFUSE: 'bg-red-50 text-red-700'
};

export default function Stages() {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/stages')
      .then(res => setStages(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-gray-400">Chargement...</p></div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Mes stages</h1>
      {stages.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-400">Aucun stage.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stages.map(s => (
            <div key={s.refStage} className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-800">{s.titre}</h3>
              <p className="text-xs text-gray-500 mt-1">Du {s.dateDebut} au {s.dateFin}</p>
              {s.encadrantNom && <p className="text-xs text-gray-500">Encadrant : {s.encadrantNom} {s.encadrantPrenom}</p>}
              {s.entrepriseNom && <p className="text-xs text-gray-500">Entreprise : {s.entrepriseNom}</p>}
              <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${STATUT_COLORS[s.statut] || 'bg-gray-100'}`}>{s.statut}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
