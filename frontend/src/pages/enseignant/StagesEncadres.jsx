import { useState, useEffect } from 'react';
import api from '../../services/api';

const statutColors = {
  EN_COURS: 'bg-blue-50 text-blue-700',
  TERMINE: 'bg-amber-50 text-amber-700',
  VALIDE: 'bg-green-50 text-green-700',
  REFUSE: 'bg-red-50 text-red-700',
};

export default function StagesEncadres() {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/stages')
      .then(res => setStages(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-400">Chargement...</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Stages encadrés</h1>

      {stages.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-400">Aucun stage pour le moment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Titre</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Apprenant</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Dates</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Statut</th>
              </tr>
            </thead>
            <tbody>
              {stages.map(stage => (
                <tr key={stage.refStage} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{stage.titre}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {stage.apprenantNom ? `${stage.apprenantPrenom} ${stage.apprenantNom}` : 'Non affecté'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {stage.dateDebut} → {stage.dateFin}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statutColors[stage.statut]}`}>
                      {stage.statut.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
