import { useState, useEffect } from 'react';
import api from '../../services/api';

function ApprenantModal({ apprenant, onClose, onSave }) {
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', motDePasse: '',
    numEtudiant: '', filiereId: '', promotionId: ''
  });
  const [filieres, setFilieres] = useState([]);
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    api.get('/filieres').then(res => setFilieres(res.data)).catch(() => setFilieres([]));
    api.get('/promotions').then(res => setPromotions(res.data)).catch(() => setPromotions([]));
  }, []);

  useEffect(() => {
    if (apprenant) {
      setForm({
        nom: apprenant.nom || '', prenom: apprenant.prenom || '',
        email: apprenant.email || '', motDePasse: '',
        numEtudiant: apprenant.numEtudiant || '',
        filiereId: apprenant.filiereId || '', promotionId: apprenant.promotionId || ''
      });
    }
  }, [apprenant]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (!payload.motDePasse) delete payload.motDePasse;
    if (payload.filiereId) payload.filiereId = Number(payload.filiereId);
    else delete payload.filiereId;
    if (payload.promotionId) payload.promotionId = Number(payload.promotionId);
    else delete payload.promotionId;
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">{apprenant ? 'Modifier' : 'Créer'} un apprenant</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Nom *"
            value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required />
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Prénom *"
            value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} required />
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Email *" type="email"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          {!apprenant && (
            <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Mot de passe *" type="password"
              value={form.motDePasse} onChange={e => setForm({ ...form, motDePasse: e.target.value })} required />
          )}
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="N° étudiant"
            value={form.numEtudiant} onChange={e => setForm({ ...form, numEtudiant: e.target.value })} />
          <select className="w-full border rounded-lg px-3 py-2 text-sm"
            value={form.filiereId} onChange={e => setForm({ ...form, filiereId: e.target.value })}>
            <option value="">Filière</option>
            {filieres.map(f => <option key={f.codeFiliere || f.id} value={f.codeFiliere || f.id}>{f.nom}</option>)}
          </select>
          <select className="w-full border rounded-lg px-3 py-2 text-sm"
            value={form.promotionId} onChange={e => setForm({ ...form, promotionId: e.target.value })}>
            <option value="">Promotion</option>
            {promotions.map(p => <option key={p.codePromotion || p.id} value={p.codePromotion || p.id}>{p.nom}</option>)}
          </select>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700">
              {apprenant ? 'Modifier' : 'Créer'}
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

export default function Apprenants() {
  const [apprenants, setApprenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => { loadApprenants(); }, []);

  const loadApprenants = () => {
    api.get('/apprenants')
      .then(res => setApprenants(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSave = (payload) => {
    const request = editing
      ? api.put(`/apprenants/${editing.codeUtilisateur}`, payload)
      : api.post('/apprenants', payload);
    request.then(() => { loadApprenants(); setShowModal(false); setEditing(null); }).catch(console.error);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Supprimer cet apprenant ?')) return;
    api.delete(`/apprenants/${id}`).then(() => loadApprenants()).catch(console.error);
  };

  const filtered = apprenants.filter(a =>
    `${a.nom} ${a.prenom} ${a.email} ${a.numEtudiant || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-gray-400">Chargement...</p></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Apprenants</h1>
          <p className="text-sm text-gray-500 mt-1">{apprenants.length} apprenant(s)</p>
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
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">N° étudiant</th>
              <th className="px-4 py-3">Filière</th>
              <th className="px-4 py-3">Promotion</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(a => (
              <tr key={a.codeUtilisateur}>
                <td className="px-4 py-3 font-medium text-gray-800">{a.nom} {a.prenom}</td>
                <td className="px-4 py-3 text-gray-600">{a.email}</td>
                <td className="px-4 py-3 text-gray-600">{a.numEtudiant || '-'}</td>
                <td className="px-4 py-3 text-gray-600">{a.filiereNom || '-'}</td>
                <td className="px-4 py-3 text-gray-600">{a.promotionNom || '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(a); setShowModal(true); }} className="text-blue-600 hover:text-blue-800 text-xs">Modifier</button>
                    <button onClick={() => handleDelete(a.codeUtilisateur)} className="text-red-600 hover:text-red-800 text-xs">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Aucun apprenant</td></tr>}
          </tbody>
        </table>
      </div>
      {showModal && <ApprenantModal apprenant={editing} onClose={() => { setShowModal(false); setEditing(null); }} onSave={handleSave} />}
    </div>
  );
}
