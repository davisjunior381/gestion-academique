import { useState, useEffect } from 'react';
import api from '../../services/api';
import { ui } from '../../components/common/ui';

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
    <div className={ui.modalOverlay}>
      <div className={ui.modalPanel}>
        <div className={ui.modalHeader}>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent-600">
            {apprenant ? 'Édition' : 'Nouvel apprenant'}
          </p>
          <h2 className={ui.modalTitle}>
            {apprenant ? `${apprenant.prenom} ${apprenant.nom}` : 'Ajouter un apprenant'}
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
          {!apprenant && (
            <div>
              <label className={ui.label}>Mot de passe initial</label>
              <input className={ui.input} type="password" value={form.motDePasse}
                onChange={e => setForm({ ...form, motDePasse: e.target.value })} required />
            </div>
          )}
          <div>
            <label className={ui.label}>Numéro étudiant</label>
            <input className={ui.input} value={form.numEtudiant}
              onChange={e => setForm({ ...form, numEtudiant: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={ui.label}>Filière</label>
              <select className={ui.input}
                value={form.filiereId} onChange={e => setForm({ ...form, filiereId: e.target.value })}>
                <option value="">Non affectée</option>
                {filieres.map(f => (
                  <option key={f.codeFiliere || f.id} value={f.codeFiliere || f.id}>{f.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={ui.label}>Promotion</label>
              <select className={ui.input}
                value={form.promotionId} onChange={e => setForm({ ...form, promotionId: e.target.value })}>
                <option value="">Non affectée</option>
                {promotions.map(p => (
                  <option key={p.codePromotion || p.id} value={p.codePromotion || p.id}>{p.nom}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={ui.modalFooter}>
            <button type="button" onClick={onClose} className={ui.btnSecondary}>Annuler</button>
            <button type="submit" className={ui.btnPrimary}>
              {apprenant ? 'Enregistrer' : 'Créer l\'apprenant'}
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
    if (!window.confirm('Confirmer la suppression de cet apprenant ?')) return;
    api.delete(`/apprenants/${id}`).then(() => loadApprenants()).catch(console.error);
  };

  const filtered = apprenants.filter(a =>
    `${a.nom} ${a.prenom} ${a.email} ${a.numEtudiant || ''}`.toLowerCase().includes(search.toLowerCase())
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
            <p className={ui.kicker}>Liste des élèves</p>
            <h1 className={ui.pageTitle}>Apprenants</h1>
            <p className={ui.pageLead}>
              {apprenants.length} élève{apprenants.length > 1 ? 's' : ''} sur la plateforme.
            </p>
          </div>
          <button onClick={() => { setEditing(null); setShowModal(true); }} className={ui.btnPrimary}>
            Ajouter un apprenant
          </button>
        </div>
      </header>

      <div className="mb-4 max-w-md">
        <input className={ui.input} placeholder="Rechercher par nom, email, n° étudiant..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className={ui.tableWrap}>
        <table className={ui.table}>
          <thead className={ui.thead}>
            <tr>
              <th className={ui.th}>Identité</th>
              <th className={ui.th}>Email</th>
              <th className={ui.th}>N° étudiant</th>
              <th className={ui.th}>Filière</th>
              <th className={ui.th}>Promotion</th>
              <th className={`${ui.th} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody className={ui.tbody}>
            {filtered.map(a => (
              <tr key={a.codeUtilisateur} className={ui.tr}>
                <td className={ui.tdStrong}>
                  <span className="font-display text-base">{a.prenom} {a.nom}</span>
                </td>
                <td className={ui.td}>{a.email}</td>
                <td className={`${ui.td} font-mono text-xs`}>{a.numEtudiant || '-'}</td>
                <td className={ui.td}>{a.filiereNom || '-'}</td>
                <td className={ui.td}>{a.promotionNom || '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => { setEditing(a); setShowModal(true); }}
                      className="text-sm text-ink-600 transition hover:text-brand-700">Éditer</button>
                    <button onClick={() => handleDelete(a.codeUtilisateur)}
                      className="text-sm text-accent-600 transition hover:text-accent-700">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <p className="text-sm text-ink-500">Aucun apprenant ne correspond à votre recherche.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ApprenantModal apprenant={editing}
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSave={handleSave} />
      )}
    </div>
  );
}
