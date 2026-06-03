import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-ink-50">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">
          Chargement de votre espace...
        </p>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" />;

  return children;
}
