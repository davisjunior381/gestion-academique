import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: '⊞' },
  { to: '/admin/apprenants', label: 'Apprenants', icon: '◉' },
  { to: '/admin/enseignants', label: 'Enseignants', icon: '◈' },
  { to: '/admin/stages', label: 'Stages', icon: '◆' },
  { to: '/admin/rapports', label: 'Rapports', icon: '◇' },
  { to: '/admin/soutenances', label: 'Soutenances', icon: '△' },
  { to: '/admin/entreprises', label: 'Entreprises', icon: '□' },
];

const enseignantLinks = [
  { to: '/enseignant', label: 'Dashboard', icon: '⊞' },
  { to: '/enseignant/modules', label: 'Mes modules', icon: '◈' },
  { to: '/enseignant/stages', label: 'Stages encadrés', icon: '◆' },
  { to: '/enseignant/rapports', label: 'Rapports', icon: '◇' },
  { to: '/enseignant/soutenances', label: 'Soutenances', icon: '△' },
];

const apprenantLinks = [
  { to: '/apprenant', label: 'Dashboard', icon: '⊞' },
  { to: '/apprenant/stages', label: 'Mes stages', icon: '◆' },
  { to: '/apprenant/rapports', label: 'Mes rapports', icon: '◇' },
  { to: '/apprenant/soutenances', label: 'Soutenances', icon: '△' },
  { to: '/apprenant/suivi', label: 'Suivi académique', icon: '◉' },
];

export default function Sidebar() {
  const { user } = useAuth();

  const links = user?.role === 'ADMIN' ? adminLinks
    : user?.role === 'ENSEIGNANT' ? enseignantLinks
    : apprenantLinks;

  const roleLabel = user?.role === 'ADMIN' ? 'Administration'
    : user?.role === 'ENSEIGNANT' ? 'Espace Enseignant'
    : 'Espace Apprenant';

  const roleColor = user?.role === 'ADMIN' ? 'bg-red-50 text-red-700'
    : user?.role === 'ENSEIGNANT' ? 'bg-blue-50 text-blue-700'
    : 'bg-green-50 text-green-700';

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-5 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-800">Gestion Académique</h1>
        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${roleColor}`}>
          {roleLabel}
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/admin' || link.to === '/enseignant' || link.to === '/apprenant'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <span className="text-base">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-400">ESEO - 2026</p>
      </div>
    </aside>
  );
}
