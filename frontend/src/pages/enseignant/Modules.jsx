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

  if (loading) return <p className="text-gray-400">Chargement...</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Mes modules</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-400">Aucun module affecté pour le moment.</p>
        <p className="text-xs text-gray-300 mt-2">Les modules apparaîtront ici une fois affectés par l'administrateur.</p>
      </div>
    </div>
  );
}
