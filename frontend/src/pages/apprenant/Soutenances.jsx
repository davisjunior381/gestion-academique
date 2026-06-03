import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Soutenances() {
  const { user } = useAuth();
  const [soutenances, setSoutenances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSoutenances = async () => {
      try {
        // Récupère l'ID de l'apprenant via son email
        const apprenants = await api.get('/apprenants');
        const moi = apprenants.data.find(a => a.email === user?.email);
        if (moi) {
          // Récupère tous les stages de l'apprenant puis leurs soutenances
          const stages = await api.get('/stages/me');
          const stageIds = Array.isArray(stages.data) 
            ? stages.data.map(s => s.refStage)
            : stages.data ? [stages.data.refStage] : [];
          
          const allSoutenances = await api.get('/soutenances');
          const mesSoutenances = allSoutenances.data.filter(s => 
            stageIds.includes(s.stageId || s.stage?.refStage)
          );
          setSoutenances(mesSoutenances);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSoutenances();
  }, [user]);

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-slate-400">Chargement...</p></div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Mes soutenances</h1>

      {soutenances.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-200 p-8 text-center">
          <p className="text-slate-400">Aucune soutenance planifiée pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {soutenances.map(s => (
            <div key={s.id || s.refSoutenance} className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">{s.stageTitre || 'Soutenance'}</h3>
              <div className="space-y-1 text-sm text-slate-600">
                <p><span className="text-slate-400">Date :</span> {s.date ? new Date(s.date).toLocaleString('fr-FR') : 'Non définie'}</p>
                <p><span className="text-slate-400">Salle :</span> {s.salle || 'Non définie'}</p>
                <p><span className="text-slate-400">Durée :</span> {s.duree ? `${s.duree} min` : 'Non définie'}</p>
                {s.note && <p><span className="text-slate-400">Note :</span> <span className="font-semibold text-emerald-600">{s.note}/20</span></p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
