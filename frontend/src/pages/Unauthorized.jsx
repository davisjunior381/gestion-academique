import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-6">
      <div className="max-w-lg">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-600">
          Erreur 403
        </p>
        <h1 className="mt-3 font-display text-5xl font-medium tracking-tight text-ink-900">
          Accès non autorisé
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-500">
          Cette page n'est pas pour votre profil. Si c'est une erreur, contactez le secrétariat de l'ESEO.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex items-center rounded-sm border border-ink-300 bg-white px-4 py-2 text-sm font-medium text-ink-700 transition hover:border-brand-500 hover:text-brand-700"
        >
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
