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

  if (loading) return <p className="text-gray-400">Chargement...</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Soutenances</h1>

      {soutenances.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-400">Aucune soutenance planifiée.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {soutenances.map(s => (
            <div key={s.id || s.refSoutenance} className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-800">Soutenance</h3>
              <p className="text-xs text-gray-500 mt-1">Date : {s.date || 'Non définie'}</p>
              <p className="text-xs text-gray-500">Salle : {s.salle || 'Non définie'}</p>
              {s.note && <p className="text-sm font-medium text-gray-800 mt-2">Note : {s.note}/20</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
