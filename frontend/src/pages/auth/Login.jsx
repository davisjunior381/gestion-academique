import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, motDePasse);
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'ENSEIGNANT') navigate('/enseignant');
      else navigate('/apprenant');
    } catch (err) {
      setError('Identifiants incorrects. Vérifiez votre adresse et votre mot de passe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-ink-50 text-ink-900">
      {/* Colonne gauche : manifeste editorial */}
      <aside className="relative hidden w-5/12 flex-col justify-between overflow-hidden border-r border-ink-200 bg-brand-800 px-12 py-12 text-ink-50 lg:flex">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-200">
            ESEO Angers
          </p>
          <h1 className="mt-4 font-display text-5xl font-medium leading-[1.05] tracking-tight">
            Sygle<span className="text-accent-300">.</span>
          </h1>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-brand-200">
            Gestion des stages
          </p>
        </div>

        <figure className="max-w-md">
          <blockquote className="font-display text-2xl leading-snug text-ink-50">
            «&nbsp;Une bonne école d'ingénieurs, ce n'est pas que des diplômes : c'est aussi un vrai suivi des élèves.&nbsp;»
          </blockquote>
          <figcaption className="mt-4 font-mono text-[11px] uppercase tracking-wider text-brand-200">
            Sygle - 2026
          </figcaption>
        </figure>

        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-300">
          Stages &middot; Rapports &middot; Soutenances &middot; Modules
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent-500/20 blur-3xl"
        />
      </aside>

      {/* Colonne droite : formulaire */}
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-600">
              ESEO Angers
            </p>
            <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink-900">
              Sygle<span className="text-accent-500">.</span>
            </h1>
          </div>

          <div className="mb-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-600">
              Connexion
            </p>
            <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink-900">
              Connectez-vous à votre espace
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              Entrez votre adresse et votre mot de passe pour retrouver vos stages, vos rapports et vos soutenances.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-sm border border-danger-100 bg-danger-50 px-3 py-2 text-sm text-danger-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-ink-500">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-sm border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300 transition focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="prenom.nom@reseau.eseo.fr"
                required
              />
            </div>
            <div>
              <label htmlFor="motDePasse" className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-ink-500">
                Mot de passe
              </label>
              <input
                id="motDePasse"
                type="password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                className="w-full rounded-sm border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300 transition focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-sm bg-brand-700 py-2.5 text-sm font-medium text-ink-50 transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <p className="mt-8 border-t border-ink-200 pt-4 text-xs text-ink-400">
            Un souci pour vous connecter ? Contactez le secrétariat de l'ESEO.
          </p>
        </div>
      </main>
    </div>
  );
}
