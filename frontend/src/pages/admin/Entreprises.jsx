import { useState, useEffect } from 'react';
import api from '../../services/api';

function EntrepriseModal({ entreprise, onClose, onSave }) {
  const [form, setForm] = useState({
    nom: '', secteur: '', adresse: '', emailContact: ''
  });

  useEffect(() => {
    if (entreprise) {
      setForm({
        nom: entreprise.nom || '', secteur: entreprise.secteur || '',
        adresse: entreprise.adresse || '', emailContact: entreprise.emailContact || ''
      });
    }
  }, [entreprise]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">{entreprise ? 'Modifier' : 'Créer'} une entreprise</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Nom *"
            value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required />
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Secteur"
            value={form.secteur} onChange={e => setForm({ ...form, secteur: e.target.value })} />
          <textarea className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Adresse" rows={2}
            value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })} />
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Email contact" type="email"
            value={form.emailContact} onChange={e => setForm({ ...form, emailContact: e.target.value })} />
          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700">
              {entreprise ? 'Modifier' : 'Créer'}
            </button>
            <button type="button" onClick={onClose} className="flex-1 border rounded-lg py-2 text-sm font-medium hover:bg-gray-50">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Entreprises() {
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => { loadEntreprises(); }, []);

  const loadEntreprises = () => {
    api.get('/entreprises')
      .then(res => setEntreprises(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSave = (form) => {
    const request = editing
      ? api.put(`/entreprises/${editing.siretEntreprise}`, form)
      : api.post('/entreprises', form);
    request.then(() => { loadEntreprises(); setShowModal(false); setEditing(null); }).catch(console.error);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Supprimer cette entreprise ?')) return;
    api.delete(`/entreprises/${id}`).then(() => loadEntreprises()).catch(console.error);
  };

  const filtered = entreprises.filter(e =>
    `${e.nom} ${e.secteur || ''} ${e.emailContact || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-gray-400">Chargement...</p></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Entreprises partenaires</h1>
          <p className="text-sm text-gray-500 mt-1">{entreprises.length} entreprise(s)</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">+ Créer</button>
      </div>
      <input className="w-full border rounded-lg px-3 py-2 text-sm mb-4" placeholder="Rechercher..."
        value={search} onChange={e => setSearch(e.target.value)} />
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Secteur</th>
              <th className="px-4 py-3">Adresse</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(e => (
              <tr key={e.siretEntreprise}>
                <td className="px-4 py-3 font-medium text-gray-800">{e.nom}</td>
                <td className="px-4 py-3 text-gray-600">{e.secteur || '-'}</td>
                <td className="px-4 py-3 text-gray-600">{e.adresse || '-'}</td>
                <td className="px-4 py-3 text-gray-600">{e.emailContact || '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(e); setShowModal(true); }} className="text-blue-600 hover:text-blue-800 text-xs">Modifier</button>
                    <button onClick={() => handleDelete(e.siretEntreprise)} className="text-red-600 hover:text-red-800 text-xs">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Aucune entreprise</td></tr>}
          </tbody>
        </table>
      </div>
      {showModal && <EntrepriseModal entreprise={editing} onClose={() => { setShowModal(false); setEditing(null); }} onSave={handleSave} />}
    </div>
  );
}
