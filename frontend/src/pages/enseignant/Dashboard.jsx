import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { ui } from '../../components/common/ui';

export default function EnseignantDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ stages: 0, rapports: 0, rapportsAEvaluer: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const enseignants = await api.get('/enseignants');
        const moi = enseignants.data.find(e => e.email === user?.email);
        if (moi) {
          const [stages, rapports] = await Promise.all([
            api.get(`/stages/encadrant/${moi.codeUtilisateur}`).catch(() => ({ data: [] })),
            api.get(`/rapports/evaluateur/${moi.codeUtilisateur}`).catch(() => ({ data: [] })),
          ]);
          setStats({
            stages: stages.data.length,
            rapports: rapports.data.length,
            rapportsAEvaluer: rapports.data.filter(r => r.statut === 'DEPOSE').length,
          });
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">Chargement...</p>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-10 border-b border-ink-200 pb-8">
        <p className={ui.kicker}>Espace enseignant</p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink-900">
          Bonjour {user?.prenom},
        </h1>
        <p className="mt-3 max-w-2xl text-base text-ink-600">
          Vos stages, vos rapports à noter et vos soutenances à venir, d'un coup d'œil.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Link to="/enseignant/stages"
          className="sygle-lift group rounded-sm border border-ink-200 bg-white p-6 transition hover:border-brand-400">
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink-500">
            Stages encadrés
          </p>
          <p className="mt-2 font-display text-4xl font-medium tabular-nums tracking-tight text-ink-900">
            {stats.stages}
          </p>
          <p className="mt-2 text-xs text-ink-500 transition group-hover:text-brand-700">
            Voir mes stages -&gt;
          </p>
        </Link>

        <Link to="/enseignant/rapports"
          className="sygle-lift group rounded-sm border border-ink-200 bg-white p-6 transition hover:border-brand-400">
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink-500">
            Rapports en tout
          </p>
          <p className="mt-2 font-display text-4xl font-medium tabular-nums tracking-tight text-ink-900">
            {stats.rapports}
          </p>
          <p className="mt-2 text-xs text-ink-500 transition group-hover:text-brand-700">
            Tous les rapports déposés
          </p>
        </Link>

        <Link to="/enseignant/rapports"
          className="sygle-lift group rounded-sm border border-accent-200 bg-white p-6 transition hover:border-accent-400">
          <p className="font-mono text-[11px] uppercase tracking-wider text-accent-600">
            À noter
          </p>
          <p className="mt-2 font-display text-4xl font-medium tabular-nums tracking-tight text-ink-900">
            {stats.rapportsAEvaluer}
          </p>
          {stats.rapportsAEvaluer > 0 ? (
            <p className="mt-2 inline-flex items-center rounded-sm bg-accent-50 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-accent-700 ring-1 ring-inset ring-accent-200">
              À faire
            </p>
          ) : (
            <p className="mt-2 text-xs text-ink-500">Tout est à jour.</p>
          )}
        </Link>
      </section>
    </div>
  );
}
