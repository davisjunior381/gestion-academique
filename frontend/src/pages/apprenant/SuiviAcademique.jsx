import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ui } from '../../components/common/ui';

function mention(moyenne) {
  if (moyenne == null) return '';
  if (moyenne >= 16) return 'Très bien';
  if (moyenne >= 14) return 'Bien';
  if (moyenne >= 12) return 'Assez bien';
  if (moyenne >= 10) return 'Passable';
  return 'Insuffisant';
}

export default function SuiviAcademique() {
  const { user } = useAuth();
  const [suivis, setSuivis] = useState([]);
  const [moyenne, setMoyenne] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuivi = async () => {
      const id = user?.codeUtilisateur;
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const [s, m] = await Promise.all([
          api.get(`/suivi-academique/apprenant/${id}`).then(res => res.data),
          api.get(`/suivi-academique/apprenant/${id}/moyenne`).then(res => res.data)
        ]);
        setSuivis(s);
        setMoyenne(m);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSuivi();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">Chargement...</p>
      </div>
    );
  }

  const m = moyenne?.moyenneGenerale;

  return (
    <div>
      <header className={ui.pageHeader}>
        <p className={ui.kicker}>Mes notes</p>
        <h1 className={ui.pageTitle}>Suivi académique</h1>
        <p className={ui.pageLead}>
          Vos notes par semestre, les commentaires de vos profs et votre moyenne.
        </p>
      </header>

      {m != null && (
        <section className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="sygle-reveal sygle-reveal-1 lg:col-span-2 rounded-sm border border-ink-200 bg-white p-8">
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink-500">
              Moyenne générale
            </p>
            <div className="mt-2 flex items-baseline gap-4">
              <p className="font-display text-7xl font-medium tabular-nums tracking-tighter text-ink-900">
                {m.toFixed(2)}
              </p>
              <p className="font-display text-2xl text-ink-400">/20</p>
            </div>
            {mention(m) && (
              <p className="mt-2 font-display text-lg italic text-accent-600">
                Mention {mention(m).toLowerCase()}
              </p>
            )}
          </div>
          <div className="sygle-reveal sygle-reveal-2 rounded-sm border border-ink-200 bg-ink-50 p-6">
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink-500">
              Semestres notés
            </p>
            <p className="mt-2 font-display text-4xl font-medium tabular-nums text-ink-900">
              {moyenne.nombreSuivis}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-ink-500">
              Moyenne calculée sur tous les semestres saisis par vos profs.
              Si une note vous semble fausse, parlez-en à votre prof référent.
            </p>
          </div>
        </section>
      )}

      {suivis.length === 0 ? (
        <div className="rounded-sm border border-dashed border-ink-300 bg-white px-8 py-16 text-center">
          <p className="font-display text-xl font-medium text-ink-800">
            Aucune note pour l'instant.
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink-500">
            Vos notes s'afficheront ici dès qu'un prof en aura ajouté une.
          </p>
        </div>
      ) : (
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead className={ui.thead}>
              <tr>
                <th className={ui.th}>Semestre</th>
                <th className={ui.th}>Moyenne</th>
                <th className={ui.th}>Commentaire du prof</th>
              </tr>
            </thead>
            <tbody className={ui.tbody}>
              {suivis.map(s => (
                <tr key={s.codeSuivi} className={ui.tr}>
                  <td className={ui.tdStrong}>
                    <span className="font-display text-base">{s.semestre}</span>
                  </td>
                  <td className={`${ui.td} font-mono`}>
                    {s.moyenne != null
                      ? <span>{s.moyenne}<span className="text-ink-400">/20</span></span>
                      : '-'}
                  </td>
                  <td className={`${ui.td} max-w-md italic`}>
                    {s.appreciation || <span className="not-italic text-ink-400">-</span>}
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
