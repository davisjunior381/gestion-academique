import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">403</h1>
        <p className="text-gray-600 mb-4">Accès non autorisé</p>
        <Link to="/login" className="text-blue-600 hover:underline">Retour à la connexion</Link>
      </div>
    </div>
  );
}
