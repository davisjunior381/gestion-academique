import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStats } from '../../services/statsService';

function StatCard({ label, value, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
    purple: 'bg-purple-50 text-purple-700',
    gray: 'bg-gray-50 text-gray-700',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-semibold text-gray-800">{value}</p>
      <div className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium ${colorClasses[color] || colorClasses.gray}`}>
        {label}
      </div>
    </div>
  );
}

function StageStatusBar({ enCours, termines, valides, total }) {
  if (total === 0) return <p className="text-sm text-gray-400">Aucun stage</p>;
  const pEnCours = Math.round((enCours / total) * 100);
  const pTermines = Math.round((termines / total) * 100);
  const pValides = Math.round((valides / total) * 100);

  return (
    <div>
      <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
        {pEnCours > 0 && <div className="bg-blue-500" style={{ width: `${pEnCours}%` }} />}
        {pTermines > 0 && <div className="bg-amber-500" style={{ width: `${pTermines}%` }} />}
        {pValides > 0 && <div className="bg-green-500" style={{ width: `${pValides}%` }} />}
      </div>
      <div className="flex gap-4 mt-2 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" />En cours ({enCours})</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" />Terminés ({termines})</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" />Validés ({valides})</span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Chargement des statistiques...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Bonjour {user?.prenom}, voici un aperçu de la plateforme.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Apprenants" value={stats?.totalApprenants || 0} color="blue" />
        <StatCard label="Enseignants" value={stats?.totalEnseignants || 0} color="purple" />
        <StatCard label="Stages" value={stats?.totalStages || 0} color="amber" />
        <StatCard label="Soutenances" value={stats?.totalSoutenances || 0} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Statut des stages</h2>
          <StageStatusBar
            enCours={stats?.stagesEnCours || 0}
            termines={stats?.stagesTermines || 0}
            valides={stats?.stagesValides || 0}
            total={stats?.totalStages || 0}
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Rapports de stage</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Déposés</span>
              <span className="text-sm font-medium bg-gray-100 px-2.5 py-0.5 rounded-full">{stats?.rapportsDeposes || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Évalués</span>
              <span className="text-sm font-medium bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full">{stats?.rapportsEvalues || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Validés</span>
              <span className="text-sm font-medium bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full">{stats?.rapportsValides || 0}</span>
            </div>
            <div className="flex justify-between items-center border-t pt-3 mt-3">
              <span className="text-sm font-medium text-gray-700">Total</span>
              <span className="text-sm font-semibold">{stats?.totalRapports || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
