import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStats } from '../../services/statsService';

function MetricCell({ label, value, hint, index = 0 }) {
  const delayClass = ['sygle-reveal-1', 'sygle-reveal-2', 'sygle-reveal-3', 'sygle-reveal-4'][index] || '';
  return (
    <div className={`sygle-reveal ${delayClass} border-l border-ink-200 px-6 py-4 first:border-l-0 first:pl-0`}>
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-500">
        {label}
      </p>
      <p className="mt-2 font-display text-4xl font-medium tabular-nums tracking-tight text-ink-900">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}

function StageStatusBar({ enCours, termines, valides, total }) {
  if (total === 0) {
    return (
      <p className="text-sm text-ink-400">Aucun stage suivi à ce jour.</p>
    );
  }
  const pEnCours = (enCours / total) * 100;
  const pTermines = (termines / total) * 100;
  const pValides = (valides / total) * 100;

  return (
    <div>
      <div className="flex h-1.5 overflow-hidden rounded-sm bg-ink-100">
        {pEnCours > 0 && <div className="bg-brand-500" style={{ width: `${pEnCours}%` }} />}
        {pTermines > 0 && <div className="bg-warning-500" style={{ width: `${pTermines}%` }} />}
        {pValides > 0 && <div className="bg-success-500" style={{ width: `${pValides}%` }} />}
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-4 text-xs">
        <div className="border-l-2 border-brand-500 pl-3">
          <dt className="font-mono uppercase tracking-wider text-ink-500">En cours</dt>
          <dd className="mt-1 font-display text-xl tabular-nums text-ink-900">{enCours}</dd>
        </div>
        <div className="border-l-2 border-warning-500 pl-3">
          <dt className="font-mono uppercase tracking-wider text-ink-500">Terminés</dt>
          <dd className="mt-1 font-display text-xl tabular-nums text-ink-900">{termines}</dd>
        </div>
        <div className="border-l-2 border-success-500 pl-3">
          <dt className="font-mono uppercase tracking-wider text-ink-500">Validés</dt>
          <dd className="mt-1 font-display text-xl tabular-nums text-ink-900">{valides}</dd>
        </div>
      </dl>
    </div>
  );
}

function RapportRow({ label, value, accent }) {
  return (
    <div className="flex items-baseline justify-between border-b border-ink-100 py-2 last:border-b-0">
      <span className={`text-sm ${accent || 'text-ink-600'}`}>{label}</span>
      <span className="font-mono text-sm tabular-nums text-ink-900">{value}</span>
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
      <div className="flex h-64 items-center justify-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">
          Chargement des indicateurs...
        </p>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-10 border-b border-ink-200 pb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-600">
          Tableau de bord admin
        </p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink-900">
          {user?.prenom}, vue d'ensemble de la plateforme.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-ink-500">
          Un résumé des élèves, des stages en cours et des rapports.
          Les chiffres se mettent à jour tout seuls.
        </p>
      </header>

      {/* Indicateurs cles : style "bandeau de chiffres" facon presse */}
      <section className="mb-12 grid grid-cols-2 gap-x-2 border-y border-ink-200 py-6 md:grid-cols-4">
        <MetricCell index={0} label="Apprenants" value={stats?.totalApprenants || 0} hint="inscrits" />
        <MetricCell index={1} label="Enseignants" value={stats?.totalEnseignants || 0} hint="affectés" />
        <MetricCell index={2} label="Stages" value={stats?.totalStages || 0} hint="recensés" />
        <MetricCell index={3} label="Soutenances" value={stats?.totalSoutenances || 0} hint="planifiées" />
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <article className="sygle-lift rounded-sm border border-ink-200 bg-white p-6">
          <header className="mb-5 flex items-baseline justify-between border-b border-ink-100 pb-3">
            <h2 className="font-display text-lg font-medium tracking-tight text-ink-900">
              Avancement des stages
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink-400">
              {stats?.totalStages || 0} suivi(s)
            </span>
          </header>
          <StageStatusBar
            enCours={stats?.stagesEnCours || 0}
            termines={stats?.stagesTermines || 0}
            valides={stats?.stagesValides || 0}
            total={stats?.totalStages || 0}
          />
        </article>

        <article className="sygle-lift rounded-sm border border-ink-200 bg-white p-6">
          <header className="mb-5 flex items-baseline justify-between border-b border-ink-100 pb-3">
            <h2 className="font-display text-lg font-medium tracking-tight text-ink-900">
              Rapports de stage
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink-400">
              Suivi
            </span>
          </header>
          <RapportRow label="Déposés, en attente de note" value={stats?.rapportsDeposes || 0} />
          <RapportRow label="Notés par un prof" value={stats?.rapportsEvalues || 0} />
          <RapportRow label="Validés par l'admin" value={stats?.rapportsValides || 0} />
          <div className="mt-3 flex items-baseline justify-between border-t border-ink-200 pt-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink-500">Total</span>
            <span className="font-display text-xl tabular-nums text-ink-900">
              {stats?.totalRapports || 0}
            </span>
          </div>
        </article>
      </section>
    </div>
  );
}
