import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function Soutenances() {
  const [soutenances, setSoutenances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/soutenances')
      .then(res => setSoutenances(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-gray-400">Chargement...</p></div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Mes soutenances</h1>
      {soutenances.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-400">Aucune soutenance.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {soutenances.map(s => (
            <div key={s.refSoutenance} className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-800">{s.stageTitre || 'Soutenance'}</h3>
              <p className="text-xs text-gray-500 mt-1">Date : {s.date || 'Non définie'}</p>
              <p className="text-xs text-gray-500">Salle : {s.salle || 'Non définie'}</p>
              {s.juryIntitule && <p className="text-xs text-gray-500">Jury : {s.juryIntitule}</p>}
              <span className="inline-block mt-2 bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                {s.statut || 'PLANIFIEE'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
