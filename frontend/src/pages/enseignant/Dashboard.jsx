import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function EnseignantDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ stages: 0, rapports: 0, rapportsAEvaluer: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [stages, rapports] = await Promise.all([
          api.get('/stages').catch(() => ({ data: [] })),
          api.get('/rapports').catch(() => ({ data: [] })),
        ]);
        setStats({
          stages: stages.data.filter(s => s.encadrantId === user?.codeUtilisateur).length || stages.data.length,
          rapports: rapports.data.length,
          rapportsAEvaluer: rapports.data.filter(r => r.statut === 'DEPOSE').length,
        });
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchStats();
  }, [user]);

  if (loading) return <p className="text-gray-400 p-6">Chargement...</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Bienvenue, {user?.prenom}</h1>
        <p className="text-sm text-gray-500 mt-1">Voici un aperçu de votre activité.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link to="/enseignant/stages" className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition">
          <p className="text-sm text-gray-500">Stages encadrés</p>
          <p className="text-3xl font-semibold text-gray-800 mt-1">{stats.stages}</p>
        </Link>
        <Link to="/enseignant/rapports" className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition">
          <p className="text-sm text-gray-500">Rapports total</p>
          <p className="text-3xl font-semibold text-gray-800 mt-1">{stats.rapports}</p>
        </Link>
        <Link to="/enseignant/rapports" className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition">
          <p className="text-sm text-gray-500">Rapports à évaluer</p>
          <p className="text-3xl font-semibold text-amber-600 mt-1">{stats.rapportsAEvaluer}</p>
          {stats.rapportsAEvaluer > 0 && (
            <span className="inline-block mt-2 px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-medium">Action requise</span>
          )}
        </Link>
      </div>
    </div>
  );
}
