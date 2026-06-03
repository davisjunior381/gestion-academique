import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ROLE_LABELS = {
  ADMIN: 'Admin',
  ENSEIGNANT: 'Enseignant',
  APPRENANT: 'Élève',
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user
    ? `${user.prenom?.[0] || ''}${user.nom?.[0] || ''}`.toUpperCase()
    : '?';
  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <header className="border-b border-ink-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-8 py-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400">
            {today}
          </p>
          <p className="mt-0.5 font-display text-base text-ink-700">
            {user?.prenom} {user?.nom}
            <span className="ml-2 font-sans text-xs text-ink-400">
              {ROLE_LABELS[user?.role] || ''}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-xs text-ink-400">{user?.email}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-brand-700 font-mono text-[11px] font-medium tracking-wider text-ink-50">
            {initials}
          </div>
          <button
            onClick={handleLogout}
            className="rounded-sm border border-ink-200 px-3 py-1.5 text-sm text-ink-600 transition hover:border-accent-300 hover:text-accent-600"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </header>
  );
}
