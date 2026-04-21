import { useState, useEffect } from 'react';
import api from '../../services/api';

const STATUT_COLORS = {
  EN_COURS: 'bg-blue-50 text-blue-700',
  TERMINE: 'bg-amber-50 text-amber-700',
  VALIDE: 'bg-green-50 text-green-700',
  REFUSE: 'bg-red-50 text-red-700'
};

function StageModal({ stage, onClose, onSave }) {
  const [form, setForm] = useState({
    titre: '', dateDebut: '', dateFin: '', duree: '', objectif: '',
    apprenantId: '', encadrantId: '', entrepriseId: ''
  });
  const [apprenants, setApprenants] = useState([]);
  const [enseignants, setEnseignants] = useState([]);

  useEffect(() => {
    api.get('/apprenants').then(res => setApprenants(res.data)).catch(() => setApprenants([]));
    api.get('/enseignants').then(res => setEnseignants(res.data)).catch(() => setEnseignants([]));
  }, []);

  useEffect(() => {
    if (stage) {
      setForm({
        titre: stage.titre || '', dateDebut: stage.dateDebut || '',
        dateFin: stage.dateFin || '', duree: stage.duree || '',
        objectif: stage.objectif || '', apprenantId: stage.apprenantId || '',
        encadrantId: stage.encadrantId || '', entrepriseId: stage.entrepriseId || ''
      });
    }
  }, [stage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, duree: Number(form.duree) };
    if (payload.apprenantId) payload.apprenantId = Number(payload.apprenantId);
    else delete payload.apprenantId;
    if (payload.encadrantId) payload.encadrantId = Number(payload.encadrantId);
    else delete payload.encadrantId;
    if (payload.entrepriseId) payload.entrepriseId = Number(payload.entrepriseId);
    else delete payload.entrepriseId;
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">{stage ? 'Modifier' : 'Créer'} un stage</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Titre *"
            value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })} required />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Début *</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" type="date"
                value={form.dateDebut} onChange={e => setForm({ ...form, dateDebut: e.target.value })} required />
            </div>
            <div>
              <label className="text-xs text-gray-500">Fin *</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" type="date"
                value={form.dateFin} onChange={e => setForm({ ...form, dateFin: e.target.value })} required />
            </div>
          </div>
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Durée (semaines) *" type="number"
            value={form.duree} onChange={e => setForm({ ...form, duree: e.target.value })} required />
          <textarea className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Objectif" rows={2}
            value={form.objectif} onChange={e => setForm({ ...form, objectif: e.target.value })} />
          <select className="w-full border rounded-lg px-3 py-2 text-sm"
            value={form.apprenantId} onChange={e => setForm({ ...form, apprenantId: e.target.value })}>
            <option value="">Apprenant</option>
            {apprenants.map(a => <option key={a.codeUtilisateur} value={a.codeUtilisateur}>{a.nom} {a.prenom}</option>)}
          </select>
          <select className="w-full border rounded-lg px-3 py-2 text-sm"
            value={form.encadrantId} onChange={e => setForm({ ...form, encadrantId: e.target.value })}>
            <option value="">Encadrant</option>
            {enseignants.map(e => <option key={e.codeUtilisateur} value={e.codeUtilisateur}>{e.nom} {e.prenom}</option>)}
          </select>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700">
              {stage ? 'Modifier' : 'Créer'}
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

export default function Stages() {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => { loadStages(); }, []);

  const loadStages = () => {
    api.get('/stages')
      .then(res => setStages(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSave = (payload) => {
    const request = editing
      ? api.put(`/stages/${editing.refStage}`, payload)
      : api.post('/stages', payload);
    request.then(() => { loadStages(); setShowModal(false); setEditing(null); }).catch(console.error);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Supprimer ce stage ?')) return;
    api.delete(`/stages/${id}`).then(() => loadStages()).catch(console.error);
  };

  const filtered = filter ? stages.filter(s => s.statut === filter) : stages;

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-gray-400">Chargement...</p></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Stages</h1>
          <p className="text-sm text-gray-500 mt-1">{stages.length} stage(s)</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">+ Créer</button>
      </div>
      <div className="flex gap-2 mb-4">
        {['', 'EN_COURS', 'TERMINE', 'VALIDE', 'REFUSE'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium ${filter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {s ? s.replace('_', ' ') : 'Tous'}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3">Titre</th>
              <th className="px-4 py-3">Début</th>
              <th className="px-4 py-3">Fin</th>
              <th className="px-4 py-3">Apprenant</th>
              <th className="px-4 py-3">Encadrant</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(s => (
              <tr key={s.refStage}>
                <td className="px-4 py-3 font-medium text-gray-800">{s.titre}</td>
                <td className="px-4 py-3 text-gray-600">{s.dateDebut || '-'}</td>
                <td className="px-4 py-3 text-gray-600">{s.dateFin || '-'}</td>
                <td className="px-4 py-3 text-gray-600">{s.apprenantNom ? `${s.apprenantNom} ${s.apprenantPrenom}` : '-'}</td>
                <td className="px-4 py-3 text-gray-600">{s.encadrantNom ? `${s.encadrantNom} ${s.encadrantPrenom}` : '-'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUT_COLORS[s.statut] || 'bg-gray-100'}`}>{s.statut}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(s); setShowModal(true); }} className="text-blue-600 hover:text-blue-800 text-xs">Modifier</button>
                    <button onClick={() => handleDelete(s.refStage)} className="text-red-600 hover:text-red-800 text-xs">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Aucun stage</td></tr>}
          </tbody>
        </table>
      </div>
      {showModal && <StageModal stage={editing} onClose={() => { setShowModal(false); setEditing(null); }} onSave={handleSave} />}
    </div>
  );
}
