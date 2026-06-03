import { useState, useEffect } from 'react';
import api from '../../services/api';
import { ui, formatDateTimeFR } from '../../components/common/ui';

export default function Soutenances() {
  const [soutenances, setSoutenances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/soutenances')
      .then(res => setSoutenances(res.data))
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
        <p className={ui.kicker}>Soutenances de la promotion</p>
        <h1 className={ui.pageTitle}>Soutenances planifiées</h1>
        <p className={ui.pageLead}>
          Toutes les soutenances de l'année. Les jurys nominatifs seront affichés ici dès qu'ils seront constitués.
        </p>
      </header>

      {soutenances.length === 0 ? (
        <div className="rounded-sm border border-dashed border-ink-300 bg-white px-8 py-16 text-center">
          <p className="font-display text-xl font-medium text-ink-800">
            Aucune soutenance pour l'instant.
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink-500">
            Les soutenances s'afficheront ici dès qu'elles seront planifiées par l'admin.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {soutenances.map(s => (
            <li key={s.id || s.refSoutenance}>
              <article className="sygle-lift rounded-sm border border-ink-200 bg-white p-6">
                <p className="font-mono text-[10px] uppercase tracking-wider text-ink-400">
                  Soutenance
                </p>
                <h3 className="mt-1 font-display text-xl font-medium tracking-tight text-ink-900">
                  {s.stageTitre || 'Soutenance'}
                </h3>
                <dl className="mt-4 space-y-2 border-t border-ink-100 pt-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-400">Date</dt>
                    <dd className="font-mono text-ink-900">{formatDateTimeFR(s.date)}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-400">Salle</dt>
                    <dd className="text-ink-900">{s.salle || 'À confirmer'}</dd>
                  </div>
                  {s.note && (
                    <div className="flex justify-between gap-3">
                      <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-400">Note attribuée</dt>
                      <dd className="font-mono text-ink-900">{s.note}/20</dd>
                    </div>
                  )}
                </dl>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
