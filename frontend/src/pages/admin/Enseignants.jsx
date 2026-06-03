import { useState, useEffect } from 'react';
import api from '../../services/api';
import { ui } from '../../components/common/ui';

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
    <div className={ui.modalOverlay}>
      <div className={ui.modalPanel}>
        <div className={ui.modalHeader}>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent-600">
            {enseignant ? 'Édition' : 'Nouvel enseignant'}
          </p>
          <h2 className={ui.modalTitle}>
            {enseignant ? `${enseignant.prenom} ${enseignant.nom}` : 'Ajouter un enseignant'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className={ui.modalBody}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={ui.label}>Nom</label>
              <input className={ui.input} value={form.nom}
                onChange={e => setForm({ ...form, nom: e.target.value })} required />
            </div>
            <div>
              <label className={ui.label}>Prénom</label>
              <input className={ui.input} value={form.prenom}
                onChange={e => setForm({ ...form, prenom: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className={ui.label}>Email</label>
            <input className={ui.input} type="email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          {!enseignant && (
            <div>
              <label className={ui.label}>Mot de passe initial</label>
              <input className={ui.input} type="password" value={form.motDePasse}
                onChange={e => setForm({ ...form, motDePasse: e.target.value })} required />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={ui.label}>Grade</label>
              <input className={ui.input} placeholder="Maître de conférences" value={form.grade}
                onChange={e => setForm({ ...form, grade: e.target.value })} />
            </div>
            <div>
              <label className={ui.label}>Département</label>
              <input className={ui.input} placeholder="Informatique" value={form.departement}
                onChange={e => setForm({ ...form, departement: e.target.value })} />
            </div>
          </div>
          <div>
            <label className={ui.label}>Spécialité</label>
            <input className={ui.input} placeholder="Systèmes embarqués, IA, réseaux..." value={form.specialite}
              onChange={e => setForm({ ...form, specialite: e.target.value })} />
          </div>
          <div className={ui.modalFooter}>
            <button type="button" onClick={onClose} className={ui.btnSecondary}>Annuler</button>
            <button type="submit" className={ui.btnPrimary}>
              {enseignant ? 'Enregistrer' : 'Créer l\'enseignant'}
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
    <div className="mt-3 rounded-sm border border-ink-200 bg-ink-50/60 p-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-ink-500">
        Modules enseignés
      </p>
      {modules.length === 0 ? (
        <p className="mt-2 text-xs italic text-ink-400">Aucun module affecté pour l'instant.</p>
      ) : (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {modules.map(m => (
            <li key={m.codeModule}
              className="inline-flex items-center gap-1.5 rounded-sm bg-white px-2 py-1 text-xs text-ink-700 ring-1 ring-inset ring-ink-200">
              <span>{m.nom}</span>
              <button onClick={() => retirer(m.codeModule)}
                className="text-ink-400 transition hover:text-accent-600" aria-label="Retirer">
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
      {availableModules.length > 0 && (
        <div className="mt-3 flex gap-2">
          <select className="flex-1 rounded-sm border border-ink-200 bg-white px-2 py-1 text-xs text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            value={selectedModuleId} onChange={e => setSelectedModuleId(e.target.value)}>
            <option value="">Affecter un module...</option>
            {availableModules.map(m => (
              <option key={m.codeModule} value={m.codeModule}>{m.nom}</option>
            ))}
          </select>
          <button onClick={affecter}
            className="rounded-sm bg-brand-700 px-3 py-1 text-xs font-medium text-ink-50 transition hover:bg-brand-800">
            Affecter
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

  useEffect(() => { loadEnseignants(); }, []);

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
    if (!window.confirm('Confirmer la suppression de cet enseignant ?')) return;
    api.delete(`/enseignants/${id}`).then(() => loadEnseignants()).catch(console.error);
  };

  const filtered = enseignants.filter(e =>
    `${e.nom} ${e.prenom} ${e.email} ${e.specialite || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">Chargement...</p>
      </div>
    );
  }

  return (
    <div>
      <header className={ui.pageHeader}>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className={ui.kicker}>Liste des profs</p>
            <h1 className={ui.pageTitle}>Enseignants</h1>
            <p className={ui.pageLead}>
              {enseignants.length} enseignant{enseignants.length > 1 ? 's' : ''}.
              Cliquez sur un nom pour voir ses modules.
            </p>
          </div>
          <button onClick={() => { setEditing(null); setShowModal(true); }} className={ui.btnPrimary}>
            Ajouter un enseignant
          </button>
        </div>
      </header>

      <div className="mb-4 max-w-md">
        <input className={ui.input} placeholder="Rechercher par nom, email, spécialité..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className={ui.tableWrap}>
        <table className={ui.table}>
          <thead className={ui.thead}>
            <tr>
              <th className={ui.th}>Identité</th>
              <th className={ui.th}>Email</th>
              <th className={ui.th}>Grade</th>
              <th className={ui.th}>Spécialité</th>
              <th className={`${ui.th} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody className={ui.tbody}>
            {filtered.map(e => (
              <tr key={e.codeUtilisateur} className={ui.tr}>
                <td className="px-4 py-3 align-top">
                  <button onClick={() => setExpandedId(expandedId === e.codeUtilisateur ? null : e.codeUtilisateur)}
                    className="font-display text-base font-medium text-ink-900 hover:text-brand-700 hover:underline decoration-1 underline-offset-4">
                    {e.prenom} {e.nom}
                  </button>
                  {expandedId === e.codeUtilisateur && <ModulesSection enseignantId={e.codeUtilisateur} />}
                </td>
                <td className={`${ui.td} align-top`}>{e.email}</td>
                <td className={`${ui.td} align-top`}>{e.grade || '-'}</td>
                <td className={`${ui.td} align-top`}>{e.specialite || '-'}</td>
                <td className="px-4 py-3 align-top">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => { setEditing(e); setShowModal(true); }}
                      className="text-sm text-ink-600 transition hover:text-brand-700">Éditer</button>
                    <button onClick={() => handleDelete(e.codeUtilisateur)}
                      className="text-sm text-accent-600 transition hover:text-accent-700">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-12 text-center text-sm text-ink-500">
                  Aucun enseignant ne correspond à votre recherche.
                </td>
              </tr>
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
