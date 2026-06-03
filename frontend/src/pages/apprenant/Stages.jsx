import { useState, useEffect } from 'react';
import api from '../../services/api';
import { ui, badgeClass, statutLabel, formatDateFR } from '../../components/common/ui';

export default function Stages() {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/stages')
      .then(res => setStages(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">Chargement...</p>
      </div>
    );
  }

  return (
    <div>
      <header className={ui.pageHeader}>
        <p className={ui.kicker}>Mes stages</p>
        <h1 className={ui.pageTitle}>Vos stages</h1>
        <p className={ui.pageLead}>
          Vos stages, leurs dates et qui vous encadre.
        </p>
      </header>

      {stages.length === 0 ? (
        <div className="rounded-sm border border-dashed border-ink-300 bg-white px-8 py-16 text-center">
          <p className="font-display text-xl font-medium text-ink-800">
            Aucun stage pour l'instant.
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink-500">
            Vos stages s'afficheront ici dès que l'admin les aura ajoutés.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {stages.map(s => (
            <li key={s.refStage}>
              <article className="sygle-lift rounded-sm border border-ink-200 bg-white p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-ink-400">
                      Stage n°{s.refStage}
                    </p>
                    <h3 className="mt-1 font-display text-xl font-medium tracking-tight text-ink-900">
                      {s.titre}
                    </h3>
                  </div>
                  <span className={badgeClass(s.statut)}>{statutLabel(s.statut)}</span>
                </div>

                {s.objectif && (
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-600">
                    {s.objectif}
                  </p>
                )}

                <dl className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3 border-t border-ink-100 pt-4 text-sm md:grid-cols-4">
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-400">Début</dt>
                    <dd className="mt-1 font-mono text-ink-900">{formatDateFR(s.dateDebut)}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-400">Fin</dt>
                    <dd className="mt-1 font-mono text-ink-900">{formatDateFR(s.dateFin)}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-400">Encadrant</dt>
                    <dd className="mt-1 text-ink-700">
                      {s.encadrantNom ? `${s.encadrantPrenom || ''} ${s.encadrantNom}`.trim() : 'À affecter'}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-400">Entreprise</dt>
                    <dd className="mt-1 text-ink-700">{s.entrepriseNom || '-'}</dd>
                  </div>
                </dl>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
