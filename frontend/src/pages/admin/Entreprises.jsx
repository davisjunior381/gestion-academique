import { useState, useEffect } from 'react';
import api from '../../services/api';

const inputClass = 'w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white shadow-lg">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            {entreprise ? 'Modifier une entreprise' : 'Créer une entreprise'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 px-5 py-4">
          <input className={inputClass} placeholder="Nom *"
            value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required />
          <input className={inputClass} placeholder="Secteur"
            value={form.secteur} onChange={e => setForm({ ...form, secteur: e.target.value })} />
          <textarea className={inputClass} placeholder="Adresse" rows={2}
            value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })} />
          <input className={inputClass} placeholder="Email contact" type="email"
            value={form.emailContact} onChange={e => setForm({ ...form, emailContact: e.target.value })} />
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Annuler
            </button>
            <button type="submit"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
              {entreprise ? 'Enregistrer' : 'Créer'}
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

  if (loading) return <div className="flex h-64 items-center justify-center text-sm text-slate-400">Chargement...</div>;

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Entreprises partenaires</h1>
          <p className="mt-1 text-sm text-slate-500">
            {entreprises.length} entreprise{entreprises.length > 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
          Créer une entreprise
        </button>
      </div>

      <input className={`${inputClass} mb-4`} placeholder="Rechercher une entreprise..."
        value={search} onChange={e => setSearch(e.target.value)} />

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Secteur</th>
              <th className="px-4 py-3 font-medium">Adresse</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(e => (
              <tr key={e.siretEntreprise} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{e.nom}</td>
                <td className="px-4 py-3 text-slate-600">{e.secteur || '-'}</td>
                <td className="px-4 py-3 text-slate-600">{e.adresse || '-'}</td>
                <td className="px-4 py-3 text-slate-600">{e.emailContact || '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => { setEditing(e); setShowModal(true); }} className="text-sm font-medium text-slate-700 hover:text-slate-900">Modifier</button>
                    <button onClick={() => handleDelete(e.siretEntreprise)} className="text-sm font-medium text-red-600 hover:text-red-700">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-400">Aucune entreprise</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && <EntrepriseModal entreprise={editing} onClose={() => { setShowModal(false); setEditing(null); }} onSave={handleSave} />}
    </div>
  );
}
