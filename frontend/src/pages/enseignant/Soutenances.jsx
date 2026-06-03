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

  if (loading) return <div className="flex h-64 items-center justify-center text-sm text-slate-400">Chargement...</div>;

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Soutenances</h1>

      {soutenances.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <p className="text-sm text-slate-500">Aucune soutenance planifiée.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {soutenances.map(s => (
            <div key={s.id || s.refSoutenance} className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-slate-900">{s.stageTitre || 'Soutenance'}</h3>
              <p className="mt-1 text-xs text-slate-500">Date : {s.date || 'Non définie'}</p>
              <p className="text-xs text-slate-500">Salle : {s.salle || 'Non définie'}</p>
              {s.note && <p className="mt-2 text-sm font-medium text-slate-900">Note : {s.note}/20</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
