import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function Modules() {
  const [enseignant, setEnseignant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enseignants')
      .then(res => {
        if (res.data.length > 0) setEnseignant(res.data[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex h-64 items-center justify-center text-sm text-slate-400">Chargement...</div>;

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Mes modules</h1>

      <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <p className="text-sm text-slate-500">Aucun module affecté pour le moment.</p>
        <p className="mt-2 text-xs text-slate-400">Les modules apparaîtront ici une fois affectés par l'administrateur.</p>
      </div>
    </div>
  );
}
