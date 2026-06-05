import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const adminLinks = [
  { to: '/admin', label: 'Tableau de bord' },
  { to: '/admin/apprenants', label: 'Apprenants' },
  { to: '/admin/enseignants', label: 'Enseignants' },
  { to: '/admin/stages', label: 'Stages' },
  { to: '/admin/rapports', label: 'Rapports' },
  { to: '/admin/jurys', label: 'Jurys' },
  { to: '/admin/soutenances', label: 'Soutenances' },
  { to: '/admin/entreprises', label: 'Entreprises' },
];

const enseignantLinks = [
  { to: '/enseignant', label: 'Tableau de bord' },
  { to: '/enseignant/modules', label: 'Modules' },
  { to: '/enseignant/stages', label: 'Stages encadrés' },
  { to: '/enseignant/rapports', label: 'Rapports à évaluer' },
  { to: '/enseignant/soutenances', label: 'Soutenances' },
];

const apprenantLinks = [
  { to: '/apprenant', label: 'Tableau de bord' },
  { to: '/apprenant/stages', label: 'Stages' },
  { to: '/apprenant/rapports', label: 'Rapports' },
  { to: '/apprenant/soutenances', label: 'Soutenances' },
  { to: '/apprenant/suivi', label: 'Suivi académique' },
];

const ROLES = {
  ADMIN: { label: 'Espace admin', accent: 'text-accent-600' },
  ENSEIGNANT: { label: 'Espace enseignant', accent: 'text-brand-600' },
  APPRENANT: { label: 'Espace élève', accent: 'text-brand-600' },
};

export default function Sidebar() {
  const { user } = useAuth();

  const links =
    user?.role === 'ADMIN' ? adminLinks
    : user?.role === 'ENSEIGNANT' ? enseignantLinks
    : apprenantLinks;

  const role = ROLES[user?.role] || ROLES.APPRENANT;
  const rootHref =
    user?.role === 'ADMIN' ? '/admin'
    : user?.role === 'ENSEIGNANT' ? '/enseignant'
    : '/apprenant';

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-ink-200 bg-white">
      <div className="border-b border-ink-200 px-6 py-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
          ESEO Paris-Vélizy
        </p>
        <h1 className="mt-1 font-display text-2xl font-medium leading-none tracking-tight text-ink-900">
          Sygle<span className="text-accent-500">.</span>
        </h1>
        <p className={`mt-3 font-mono text-[11px] uppercase tracking-wider ${role.accent}`}>
          {role.label}
        </p>
      </div>

      <nav className="flex-1 px-3 py-5">
        <ul className="space-y-0.5">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === rootHref}
                className={({ isActive }) =>
                  `group relative flex items-center rounded-sm px-3 py-2 text-sm transition ${
                    isActive
                      ? 'bg-ink-100 font-medium text-ink-900'
                      : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      aria-hidden="true"
                      className={`mr-3 inline-block w-px transition-all duration-300 ${
                        isActive ? 'h-5 bg-accent-500' : 'h-3 bg-ink-200 group-hover:h-4 group-hover:bg-ink-300'
                      }`}
                    />
                    {link.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-ink-200 px-6 py-4">
        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-400">
          Année 2025 - 2026
        </p>
        <p className="mt-1 text-xs text-ink-500">
          Gestion des stages et soutenances
        </p>
      </div>
    </aside>
  );
}
