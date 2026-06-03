import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { ui } from '../../components/common/ui';

export default function Modules() {
  const { user } = useAuth();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        // TODO : remplacer par user.codeUtilisateur dès que l'API /auth/me
        // expose l'identifiant interne. En attendant, fallback : lookup par email.
        let enseignantId = user?.codeUtilisateur;
        if (!enseignantId && user?.email) {
          const enseignants = await api.get('/enseignants');
          const moi = enseignants.data.find((e) => e.email === user.email);
          enseignantId = moi?.codeUtilisateur;
        }
        if (!enseignantId) {
          setModules([]);
          return;
        }
        const res = await api.get(`/enseignants/${enseignantId}/modules`);
        setModules(res.data);
      } catch (err) {
        // Toast géré par l'intercepteur axios.
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
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
        <p className={ui.kicker}>Mes cours</p>
        <h1 className={ui.pageTitle}>Vos modules</h1>
        <p className={ui.pageLead}>
          Les modules que vous enseignez cette année.
        </p>
      </header>

      {modules.length === 0 ? (
        <div className="rounded-sm border border-dashed border-ink-300 bg-white px-8 py-16 text-center">
          <p className="font-display text-xl font-medium text-ink-800">
            Aucun module pour l'instant.
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink-500">
            Vos modules s'afficheront ici dès que l'admin vous en aura attribué.
            Vous recevrez aussi un mail à ce moment-là.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <li key={m.codeModule}>
              <article className="sygle-lift h-full rounded-sm border border-ink-200 bg-white p-6">
                <p className="font-mono text-[10px] uppercase tracking-wider text-ink-400">
                  Module
                </p>
                <h3 className="mt-1 font-display text-xl font-medium tracking-tight text-ink-900">
                  {m.nom}
                </h3>
                {m.description && (
                  <p className="mt-3 border-t border-ink-100 pt-3 text-sm text-ink-600">
                    {m.description}
                  </p>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
