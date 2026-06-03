import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ui, badgeClass, statutLabel, formatDateTimeFR } from '../../components/common/ui';

export default function Soutenances() {
  const { user } = useAuth();
  const [soutenances, setSoutenances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSoutenances = async () => {
      try {
        const apprenants = await api.get('/apprenants');
        const moi = apprenants.data.find(a => a.email === user?.email);
        if (moi) {
          const stages = await api.get('/stages/me');
          const stageIds = Array.isArray(stages.data)
            ? stages.data.map(s => s.refStage)
            : stages.data ? [stages.data.refStage] : [];

          const allSoutenances = await api.get('/soutenances');
          const mesSoutenances = allSoutenances.data.filter(s =>
            stageIds.includes(s.stageId || s.stage?.refStage)
          );
          setSoutenances(mesSoutenances);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSoutenances();
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
      <header className={ui.pageHeader}>
        <p className={ui.kicker}>Mes soutenances</p>
        <h1 className={ui.pageTitle}>Vos soutenances</h1>
        <p className={ui.pageLead}>
          La date, la salle et le jury de vos soutenances à venir.
        </p>
      </header>

      {soutenances.length === 0 ? (
        <div className="rounded-sm border border-dashed border-ink-300 bg-white px-8 py-16 text-center">
          <p className="font-display text-xl font-medium text-ink-800">
            Aucune soutenance prévue pour l'instant.
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink-500">
            Votre soutenance s'affichera ici dès que l'admin aura fixé la date et choisi le jury.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {soutenances.map(s => (
            <li key={s.refSoutenance || s.id}>
              <article className="sygle-lift h-full rounded-sm border border-ink-200 bg-white p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-ink-400">
                      Soutenance
                    </p>
                    <h3 className="mt-1 font-display text-xl font-medium tracking-tight text-ink-900">
                      {s.stageTitre || 'Soutenance de stage'}
                    </h3>
                  </div>
                  <span className={badgeClass(s.statut || 'PLANIFIEE')}>
                    {statutLabel(s.statut || 'PLANIFIEE')}
                  </span>
                </div>

                <dl className="mt-5 space-y-3 border-t border-ink-100 pt-4 text-sm">
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-400">Date</dt>
                    <dd className="font-mono text-ink-900">{formatDateTimeFR(s.date)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-400">Salle</dt>
                    <dd className="text-ink-900">{s.salle || 'À confirmer'}</dd>
                  </div>
                  {s.duree && (
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-400">Durée</dt>
                      <dd className="text-ink-900">{s.duree} min</dd>
                    </div>
                  )}
                  {s.juryIntitule && (
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-400">Jury</dt>
                      <dd className="text-right text-ink-900">{s.juryIntitule}</dd>
                    </div>
                  )}
                  {s.note != null && (
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-400">Note</dt>
                      <dd className="font-display text-lg font-semibold text-success-700">{s.note}/20</dd>
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
