import { useState, useEffect } from 'react';
import api from '../../services/api';

const STATUT_STYLES = {
  EN_COURS: 'bg-blue-50 text-blue-700 ring-blue-200',
  TERMINE: 'bg-amber-50 text-amber-700 ring-amber-200',
  VALIDE: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  REFUSE: 'bg-red-50 text-red-700 ring-red-200',
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

  if (loading) return <div className="flex h-64 items-center justify-center text-sm text-slate-400">Chargement...</div>;

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Stages encadrés</h1>

      {stages.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <p className="text-sm text-slate-500">Aucun stage pour le moment.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Titre</th>
                <th className="px-4 py-3 font-medium">Apprenant</th>
                <th className="px-4 py-3 font-medium">Dates</th>
                <th className="px-4 py-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stages.map(stage => (
                <tr key={stage.refStage} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{stage.titre}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {stage.apprenantNom ? `${stage.apprenantPrenom} ${stage.apprenantNom}` : 'Non affecté'}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {stage.dateDebut} → {stage.dateFin}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUT_STYLES[stage.statut] || 'bg-slate-100 text-slate-600 ring-slate-200'}`}>
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
