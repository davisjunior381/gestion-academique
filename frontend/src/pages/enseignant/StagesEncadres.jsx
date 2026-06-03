import { useState, useEffect } from 'react';
import api from '../../services/api';
import { ui, badgeClass, statutLabel, formatDateFR } from '../../components/common/ui';

export default function StagesEncadres() {
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
        <p className={ui.kicker}>Mes élèves en stage</p>
        <h1 className={ui.pageTitle}>Stages encadrés</h1>
        <p className={ui.pageLead}>
          Les stages dont vous êtes le tuteur côté école.
        </p>
      </header>

      {stages.length === 0 ? (
        <div className="rounded-sm border border-dashed border-ink-300 bg-white px-8 py-16 text-center">
          <p className="font-display text-xl font-medium text-ink-800">
            Aucun stage à encadrer pour l'instant.
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink-500">
            Vos stages s'afficheront ici dès que l'admin vous en aura confié un.
          </p>
        </div>
      ) : (
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead className={ui.thead}>
              <tr>
                <th className={ui.th}>Intitulé</th>
                <th className={ui.th}>Apprenant</th>
                <th className={ui.th}>Période</th>
                <th className={ui.th}>Statut</th>
              </tr>
            </thead>
            <tbody className={ui.tbody}>
              {stages.map(stage => (
                <tr key={stage.refStage} className={ui.tr}>
                  <td className={ui.tdStrong}>
                    <span className="font-display text-base">{stage.titre}</span>
                  </td>
                  <td className={ui.td}>
                    {stage.apprenantNom
                      ? `${stage.apprenantPrenom || ''} ${stage.apprenantNom}`.trim()
                      : <span className="italic text-ink-400">Non affecté</span>}
                  </td>
                  <td className={`${ui.td} font-mono text-xs`}>
                    {formatDateFR(stage.dateDebut)} <span className="text-ink-300">-</span> {formatDateFR(stage.dateFin)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={badgeClass(stage.statut)}>{statutLabel(stage.statut)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
