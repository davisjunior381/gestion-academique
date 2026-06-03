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

  if (loading) return <div className="flex h-64 items-center justify-center text-sm text-slate-400">Chargement...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Bienvenue, {user?.prenom}</h1>
        <p className="mt-1 text-sm text-slate-500">Aperçu de votre activité.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link to="/enseignant/stages" className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-300">
          <p className="text-sm text-slate-500">Stages encadrés</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">{stats.stages}</p>
        </Link>
        <Link to="/enseignant/rapports" className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-300">
          <p className="text-sm text-slate-500">Rapports au total</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">{stats.rapports}</p>
        </Link>
        <Link to="/enseignant/rapports" className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-300">
          <p className="text-sm text-slate-500">Rapports à évaluer</p>
          <p className="mt-1 text-3xl font-semibold text-amber-600">{stats.rapportsAEvaluer}</p>
          {stats.rapportsAEvaluer > 0 && (
            <span className="mt-2 inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
              Action requise
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}
