import { useState, useEffect } from 'react';
import api from '../../services/api';
import { ui } from '../../components/common/ui';

export default function Modules() {
  const [, setEnseignant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/enseignants')
      .then(res => {
        if (res.data.length > 0) setEnseignant(res.data[0]);
      })
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
        <p className={ui.kicker}>Mes cours</p>
        <h1 className={ui.pageTitle}>Vos modules</h1>
        <p className={ui.pageLead}>
          Les modules que vous enseignez cette année.
        </p>
      </header>

      <div className="rounded-sm border border-dashed border-ink-300 bg-white px-8 py-16 text-center">
        <p className="font-display text-xl font-medium text-ink-800">
          Aucun module pour l'instant.
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-500">
          Vos modules s'afficheront ici dès que l'admin vous en aura attribué.
          Vous recevrez aussi un mail à ce moment-là.
        </p>
      </div>
    </div>
  );
}
