import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const statutColors = {
  EN_COURS: 'bg-blue-50 text-blue-700',
  TERMINE: 'bg-amber-50 text-amber-700',
  VALIDE: 'bg-green-50 text-green-700',
  REFUSE: 'bg-red-50 text-red-700',
};

export default function StagesEncadres() {
  const { user } = useAuth();
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const enseignants = await api.get('/enseignants');
        const moi = enseignants.data.find(e => e.email === user?.email);
        if (moi) {
          const res = await api.get(`/stages/encadrant/${moi.codeUtilisateur}`);
          setStages(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStages();
  }, [user]);

  if (loading) return <p className="text-slate-400">Chargement...</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Stages encadrés</h1>

      {stages.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-200 p-8 text-center">
          <p className="text-slate-400">Aucun stage encadré pour le moment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Titre</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Apprenant</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Entreprise</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Dates</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stages.map(stage => (
                <tr key={stage.refStage} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{stage.titre}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {stage.apprenantNom ? `${stage.apprenantPrenom} ${stage.apprenantNom}` : 'Non affecté'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{stage.entrepriseNom || '-'}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{stage.dateDebut} → {stage.dateFin}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-md ring-1 ring-inset text-xs font-medium ${statutColors[stage.statut]}`}>
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
