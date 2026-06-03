import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function SuiviAcademique() {
  const { user } = useAuth();
  const [suivis, setSuivis] = useState([]);
  const [moyenne, setMoyenne] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuivi = async () => {
      try {
        const apprenants = await api.get('/apprenants');
        const moi = apprenants.data.find(a => a.email === user?.email);
        if (moi) {
          const id = moi.codeUtilisateur;
          const [s, m] = await Promise.all([
            api.get(`/suivi-academique/apprenant/${id}`).then(res => res.data),
            api.get(`/suivi-academique/apprenant/${id}/moyenne`).then(res => res.data)
          ]);
          setSuivis(s);
          setMoyenne(m);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSuivi();
  }, [user]);

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-slate-400">Chargement...</p></div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Suivi académique</h1>

      {moyenne !== null && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6 flex items-center gap-4">
          <div>
            <p className="text-sm text-slate-500">Moyenne générale</p>
            <p className="text-3xl font-semibold text-emerald-600">{moyenne}/20</p>
          </div>
        </div>
      )}

      {suivis.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-200 p-8 text-center">
          <p className="text-slate-400">Aucun suivi académique disponible.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {suivis.map(s => (
            <div key={s.codeSuivi || s.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-slate-800">Semestre {s.semestre}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.appreciation || 'Pas d\'appréciation'}</p>
                </div>
                {s.moyenne && (
                  <span className="text-lg font-semibold text-emerald-600">{s.moyenne}/20</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
