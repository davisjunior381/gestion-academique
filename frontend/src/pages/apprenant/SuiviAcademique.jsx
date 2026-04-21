import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function SuiviAcademique() {
  const { user } = useAuth();
  const [suivis, setSuivis] = useState([]);
  const [moyenne, setMoyenne] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.codeUtilisateur) {
      setLoading(false);
      return;
    }
    const id = user.codeUtilisateur;
    Promise.all([
      api.get(`/suivi-academique/apprenant/${id}`).then(res => res.data),
      api.get(`/suivi-academique/apprenant/${id}/moyenne`).then(res => res.data)
    ]).then(([s, m]) => {
      setSuivis(s);
      setMoyenne(m);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-gray-400">Chargement...</p></div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Suivi académique</h1>

      {moyenne && moyenne.moyenneGenerale != null && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <p className="text-sm text-gray-500">Moyenne générale</p>
          <p className="text-3xl font-semibold text-gray-800">{moyenne.moyenneGenerale.toFixed(2)}/20</p>
          <p className="text-xs text-gray-400 mt-1">{moyenne.nombreSuivis} évaluation(s)</p>
        </div>
      )}

      {suivis.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-400">Aucun suivi académique.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3">Semestre</th>
                <th className="px-4 py-3">Moyenne</th>
                <th className="px-4 py-3">Appréciation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {suivis.map(s => (
                <tr key={s.codeSuivi}>
                  <td className="px-4 py-3 font-medium text-gray-800">{s.semestre}</td>
                  <td className="px-4 py-3 text-gray-600">{s.moyenne != null ? `${s.moyenne}/20` : '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{s.appreciation || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
