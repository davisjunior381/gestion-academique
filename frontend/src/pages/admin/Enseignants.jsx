import { useState, useEffect } from 'react';
import api from '../../services/api';

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          {enseignant ? 'Modifier' : 'Créer'} un enseignant
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Nom *"
            value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required />
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Prénom *"
            value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} required />
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Email *" type="email"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          {!enseignant && (
            <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Mot de passe *" type="password"
              value={form.motDePasse} onChange={e => setForm({ ...form, motDePasse: e.target.value })} required />
          )}
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Grade"
            value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} />
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Spécialité"
            value={form.specialite} onChange={e => setForm({ ...form, specialite: e.target.value })} />
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Département"
            value={form.departement} onChange={e => setForm({ ...form, departement: e.target.value })} />
          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700">
              {enseignant ? 'Modifier' : 'Créer'}
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
    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
      <p className="text-xs font-medium text-gray-600 mb-2">Modules affectés</p>
      {modules.length === 0 ? (
        <p className="text-xs text-gray-400">Aucun module</p>
      ) : (
        <div className="flex flex-wrap gap-1 mb-2">
          {modules.map(m => (
            <span key={m.codeModule} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
              {m.nom}
              <button onClick={() => retirer(m.codeModule)} className="hover:text-red-500">&times;</button>
            </span>
          ))}
        </div>
      )}
      {availableModules.length > 0 && (
        <div className="flex gap-2 mt-2">
          <select className="flex-1 border rounded-lg px-2 py-1 text-xs"
            value={selectedModuleId} onChange={e => setSelectedModuleId(e.target.value)}>
            <option value="">Ajouter un module...</option>
            {availableModules.map(m => (
              <option key={m.codeModule} value={m.codeModule}>{m.nom}</option>
            ))}
          </select>
          <button onClick={affecter} className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-700">
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
    return <div className="flex items-center justify-center h-64"><p className="text-gray-400">Chargement...</p></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Enseignants</h1>
          <p className="text-sm text-gray-500 mt-1">{enseignants.length} enseignant(s)</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          + Créer
        </button>
      </div>

      <input className="w-full border rounded-lg px-3 py-2 text-sm mb-4" placeholder="Rechercher..."
        value={search} onChange={e => setSearch(e.target.value)} />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Grade</th>
              <th className="px-4 py-3">Spécialité</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(e => (
              <tr key={e.codeUtilisateur}>
                <td className="px-4 py-3">
                  <button onClick={() => setExpandedId(expandedId === e.codeUtilisateur ? null : e.codeUtilisateur)}
                    className="font-medium text-gray-800 hover:text-blue-600">
                    {e.nom} {e.prenom}
                  </button>
                  {expandedId === e.codeUtilisateur && <ModulesSection enseignantId={e.codeUtilisateur} />}
                </td>
                <td className="px-4 py-3 text-gray-600">{e.email}</td>
                <td className="px-4 py-3 text-gray-600">{e.grade || '-'}</td>
                <td className="px-4 py-3 text-gray-600">{e.specialite || '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(e); setShowModal(true); }}
                      className="text-blue-600 hover:text-blue-800 text-xs">Modifier</button>
                    <button onClick={() => handleDelete(e.codeUtilisateur)}
                      className="text-red-600 hover:text-red-800 text-xs">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-400">Aucun enseignant</td></tr>
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
