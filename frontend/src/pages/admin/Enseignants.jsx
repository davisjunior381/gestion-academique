import { useState, useEffect } from 'react';
import api from '../../services/api';

const inputClass = 'w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400';

function EnseignantModal({ enseignant, onClose, onSave }) {
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', motDePasse: '',
    grade: '', specialite: '', departement: ''
  });

  useEffect(() => {
    if (enseignant) {
      setForm({
        nom: enseignant.nom || '',
        prenom: enseignant.prenom || '',
        email: enseignant.email || '',
        motDePasse: '',
        grade: enseignant.grade || '',
        specialite: enseignant.specialite || '',
        departement: enseignant.departement || ''
      });
    }
  }, [enseignant]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white shadow-lg">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            {enseignant ? 'Modifier un enseignant' : 'Créer un enseignant'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 px-5 py-4">
          <input className={inputClass} placeholder="Nom *"
            value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required />
          <input className={inputClass} placeholder="Prénom *"
            value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} required />
          <input className={inputClass} placeholder="Email *" type="email"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          {!enseignant && (
            <input className={inputClass} placeholder="Mot de passe *" type="password"
              value={form.motDePasse} onChange={e => setForm({ ...form, motDePasse: e.target.value })} required />
          )}
          <input className={inputClass} placeholder="Grade"
            value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} />
          <input className={inputClass} placeholder="Spécialité"
            value={form.specialite} onChange={e => setForm({ ...form, specialite: e.target.value })} />
          <input className={inputClass} placeholder="Département"
            value={form.departement} onChange={e => setForm({ ...form, departement: e.target.value })} />
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Annuler
            </button>
            <button type="submit"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
              {enseignant ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModulesSection({ enseignantId }) {
  const [modules, setModules] = useState([]);
  const [allModules, setAllModules] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState('');

  useEffect(() => {
    loadModules();
  }, [enseignantId]);

  const loadModules = () => {
    api.get(`/enseignants/${enseignantId}/modules`).then(res => setModules(res.data)).catch(console.error);
    api.get('/modules').then(res => setAllModules(res.data)).catch(() => setAllModules([]));
  };

  const affecter = () => {
    if (!selectedModuleId) return;
    api.post(`/enseignants/${enseignantId}/modules/${selectedModuleId}`)
      .then(() => { loadModules(); setSelectedModuleId(''); })
      .catch(console.error);
  };

  const retirer = (moduleId) => {
    api.delete(`/enseignants/${enseignantId}/modules/${moduleId}`)
      .then(() => loadModules())
      .catch(console.error);
  };

  const availableModules = allModules.filter(m => !modules.some(am => am.codeModule === m.codeModule));

  return (
    <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3">
      <p className="mb-2 text-xs font-medium text-slate-600">Modules affectés</p>
      {modules.length === 0 ? (
        <p className="text-xs text-slate-400">Aucun module</p>
      ) : (
        <div className="mb-2 flex flex-wrap gap-1">
          {modules.map(m => (
            <span key={m.codeModule} className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs text-slate-700 ring-1 ring-inset ring-slate-200">
              {m.nom}
              <button onClick={() => retirer(m.codeModule)} className="text-slate-400 hover:text-red-600">&times;</button>
            </span>
          ))}
        </div>
      )}
      {availableModules.length > 0 && (
        <div className="mt-2 flex gap-2">
          <select className="flex-1 rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            value={selectedModuleId} onChange={e => setSelectedModuleId(e.target.value)}>
            <option value="">Ajouter un module...</option>
            {availableModules.map(m => (
              <option key={m.codeModule} value={m.codeModule}>{m.nom}</option>
            ))}
          </select>
          <button onClick={affecter} className="rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-800">
            Ajouter
          </button>
        </div>
      )}
    </div>
  );
}

export default function Enseignants() {
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadEnseignants();
  }, []);

  const loadEnseignants = () => {
    api.get('/enseignants')
      .then(res => setEnseignants(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSave = (form) => {
    const payload = { ...form };
    if (!payload.motDePasse) delete payload.motDePasse;

    const request = editing
      ? api.put(`/enseignants/${editing.codeUtilisateur}`, payload)
      : api.post('/enseignants', payload);

    request.then(() => {
      loadEnseignants();
      setShowModal(false);
      setEditing(null);
    }).catch(console.error);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Supprimer cet enseignant ?')) return;
    api.delete(`/enseignants/${id}`)
      .then(() => loadEnseignants())
      .catch(console.error);
  };

  const filtered = enseignants.filter(e =>
    `${e.nom} ${e.prenom} ${e.email} ${e.specialite || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-sm text-slate-400">Chargement...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Enseignants</h1>
          <p className="mt-1 text-sm text-slate-500">
            {enseignants.length} enseignant{enseignants.length > 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
          Créer un enseignant
        </button>
      </div>

      <input className={`${inputClass} mb-4`} placeholder="Rechercher un enseignant..."
        value={search} onChange={e => setSearch(e.target.value)} />

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Grade</th>
              <th className="px-4 py-3 font-medium">Spécialité</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(e => (
              <tr key={e.codeUtilisateur} className="hover:bg-slate-50">
                <td className="px-4 py-3 align-top">
                  <button onClick={() => setExpandedId(expandedId === e.codeUtilisateur ? null : e.codeUtilisateur)}
                    className="font-medium text-slate-900 hover:underline">
                    {e.nom} {e.prenom}
                  </button>
                  {expandedId === e.codeUtilisateur && <ModulesSection enseignantId={e.codeUtilisateur} />}
                </td>
                <td className="px-4 py-3 align-top text-slate-600">{e.email}</td>
                <td className="px-4 py-3 align-top text-slate-600">{e.grade || '-'}</td>
                <td className="px-4 py-3 align-top text-slate-600">{e.specialite || '-'}</td>
                <td className="px-4 py-3 align-top">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => { setEditing(e); setShowModal(true); }}
                      className="text-sm font-medium text-slate-700 hover:text-slate-900">Modifier</button>
                    <button onClick={() => handleDelete(e.codeUtilisateur)}
                      className="text-sm font-medium text-red-600 hover:text-red-700">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="5" className="px-4 py-10 text-center text-slate-400">Aucun enseignant</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <EnseignantModal
          enseignant={editing}
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
