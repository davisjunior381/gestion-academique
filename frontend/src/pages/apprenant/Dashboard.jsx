import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { ui, badgeClass, statutLabel, formatDateFR } from '../../components/common/ui';

export default function ApprenantDashboard() {
  const { user } = useAuth();
  const [stages, setStages] = useState([]);
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/stages/me').then(r => r.data).catch(() => []),
      api.get('/rapports/me').then(r => r.data).catch(() => []),
    ]).then(([s, r]) => {
      setStages(s);
      setRapports(r);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">
          Chargement...
        </p>
      </div>
    );
  }

  const stageEnCours = stages.find(s => s.statut === 'EN_COURS') || stages[0];
  const rapportsAttente = rapports.filter(r => r.statut === 'DEPOSE' || r.statut === 'EVALUE').length;

  return (
    <div>
      <header className="mb-10 border-b border-ink-200 pb-8">
        <p className={ui.kicker}>Espace apprenant</p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink-900">
          Bonjour {user?.prenom},
        </h1>
        <p className="mt-3 max-w-2xl text-base text-ink-600">
          Voici où en sont vos stages et vos rapports.
          Déposez vos rapports à temps et lisez les retours de vos profs depuis cette page.
        </p>
      </header>

      <section className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Link to="/apprenant/stages"
          className="sygle-lift group rounded-sm border border-ink-200 bg-white p-6 transition hover:border-brand-400">
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink-500">Stages</p>
          <p className="mt-2 font-display text-4xl font-medium tabular-nums tracking-tight text-ink-900">
            {stages.length}
          </p>
          <p className="mt-2 text-xs text-ink-500 transition group-hover:text-brand-700">
            Consulter mes stages -&gt;
          </p>
        </Link>

        <Link to="/apprenant/rapports"
          className="sygle-lift group rounded-sm border border-ink-200 bg-white p-6 transition hover:border-brand-400">
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink-500">Rapports déposés</p>
          <p className="mt-2 font-display text-4xl font-medium tabular-nums tracking-tight text-ink-900">
            {rapports.length}
          </p>
          {rapportsAttente > 0 ? (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-sm bg-warning-50 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-warning-700 ring-1 ring-inset ring-warning-100">
              {rapportsAttente} en attente de note
            </p>
          ) : (
            <p className="mt-2 text-xs text-ink-500 transition group-hover:text-brand-700">
              Déposer un nouveau rapport -&gt;
            </p>
          )}
        </Link>

        <Link to="/apprenant/suivi"
          className="sygle-lift group rounded-sm border border-ink-200 bg-white p-6 transition hover:border-brand-400">
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink-500">Mes notes</p>
          <p className="mt-2 font-display text-4xl font-medium tabular-nums tracking-tight text-ink-900">
            -
          </p>
          <p className="mt-2 text-xs text-ink-500 transition group-hover:text-brand-700">
            Voir ma moyenne -&gt;
          </p>
        </Link>
      </section>

      {stageEnCours && (
        <section className="rounded-sm border border-ink-200 bg-white">
          <header className="flex items-baseline justify-between border-b border-ink-100 px-6 py-4">
            <h2 className="font-display text-lg font-medium tracking-tight text-ink-900">
              Votre stage en cours
            </h2>
            <span className={badgeClass(stageEnCours.statut)}>
              {statutLabel(stageEnCours.statut)}
            </span>
          </header>
          <div className="px-6 py-5">
            <h3 className="font-display text-xl tracking-tight text-ink-900">
              {stageEnCours.titre}
            </h3>
            {stageEnCours.objectif && (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-600">
                {stageEnCours.objectif}
              </p>
            )}
            <dl className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3 text-sm md:grid-cols-4">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-400">Début</dt>
                <dd className="mt-1 font-mono text-ink-900">{formatDateFR(stageEnCours.dateDebut)}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-400">Fin</dt>
                <dd className="mt-1 font-mono text-ink-900">{formatDateFR(stageEnCours.dateFin)}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-400">Encadrant</dt>
                <dd className="mt-1 text-ink-700">
                  {stageEnCours.encadrantNom
                    ? `${stageEnCours.encadrantPrenom || ''} ${stageEnCours.encadrantNom}`.trim()
                    : 'Non affecté'}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-400">Entreprise</dt>
                <dd className="mt-1 text-ink-700">{stageEnCours.entrepriseNom || '-'}</dd>
              </div>
            </dl>
          </div>
        </section>
      )}
    </div>
  );
}
